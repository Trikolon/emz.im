/// <reference types="node" />

import path from "node:path";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { parse, type HTMLElement } from "node-html-parser";
import type { Connect, Plugin, ResolvedConfig, ViteDevServer } from "vite";
import { buildPhotoRoute, isPhotoRoute } from "../src/photo-route";
import type { PhotoMetadataGenerated } from "../src/assets/photos/index.ts";

interface PhotoOgPagesPluginOptions {
  siteUrl: string;
  galleryPage?: string;
}

interface ManifestEntry {
  file: string;
  src?: string;
  isEntry?: boolean;
  isAsset?: boolean;
}

type ViteManifest = Record<string, ManifestEntry>;

interface GeneratePagesContext {
  config: ResolvedConfig;
  siteUrl: string;
  galleryPage: string;
}

const DEFAULT_DOCTYPE = "<!doctype html>";

interface PhotoPageData {
  id: string;
  title: string;
  description: string;
  alt: string;
  imageUrl: string;
  canonicalUrl: string;
  publishedTime?: string;
}

interface MetaAttributes {
  content: string;
  name?: string;
  property?: string;
}

export default function photoOgPagesPlugin(options: PhotoOgPagesPluginOptions): Plugin {
  if (!options?.siteUrl) {
    throw new Error("photo-og-pages: siteUrl option is required");
  }

  const normalizedSiteUrl = normalizeSiteUrl(options.siteUrl);
  const galleryEntry = options.galleryPage ?? "photos.html";
  let resolvedConfig: ResolvedConfig | null = null;

  return {
    name: "photo-og-pages",
    configResolved(config) {
      resolvedConfig = config;
    },
    configureServer(server) {
      const galleryEntryPath = path.resolve(server.config.root, galleryEntry);
      server.watcher.add(galleryEntryPath);
      server.middlewares.use(createPhotoRouteMiddleware(server, galleryEntryPath));
    },
    async closeBundle() {
      if (!resolvedConfig) {
        return;
      }

      try {
        await generatePhotoPages({
          config: resolvedConfig,
          siteUrl: normalizedSiteUrl,
          galleryPage: galleryEntry,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.error(`photo-og-pages: ${message}`);
      }
    },
  };
}

async function generatePhotoPages({ config, siteUrl, galleryPage }: GeneratePagesContext) {
  const outDir = path.resolve(config.root, config.build.outDir);
  const manifestPath = path.join(outDir, ".vite", "manifest.json");
  const manifest = await loadManifest(manifestPath);
  const galleryEntryPath = path.join(outDir, galleryPage);
  const galleryEntryHtml = await readFile(galleryEntryPath, "utf8");
  const { doctype, templateHtml } = splitDoctype(galleryEntryHtml);
  const metaDir = path.resolve(config.root, "src/assets/photos/meta");
  const metaFiles = await readdir(metaDir);
  const logger = config.logger ?? console;

  const tasks = metaFiles
    .filter((file) => file.endsWith(".json"))
    .map(async (file) => {
      const id = file.replace(/\.json$/, "");
      const metadata = await readPhotoMetadata(path.join(metaDir, file));

      const imageAsset = manifest[toManifestKey("src/assets/photos/full-size", `${id}.avif`)];
      if (!imageAsset?.file) {
        throw new Error(`Missing full-size asset for photo "${id}" in manifest`);
      }

      const description = buildPhotoDescription(metadata.ObjectName, metadata.DateTimeOriginal);
      const routePath = buildPhotoRoute(config.base ?? "/", id);

      const pageData: PhotoPageData = {
        id,
        title: metadata.ObjectName ?? id,
        description,
        alt: metadata.Caption ?? metadata.ObjectName ?? id,
        imageUrl: toAbsoluteUrl(addBase(imageAsset.file, config.base), siteUrl),
        canonicalUrl: toAbsoluteUrl(routePath, siteUrl),
        publishedTime: metadata.DateTimeOriginal,
      };

      const html = createPhotoPageHtml(templateHtml, doctype, pageData);
      const fileSystemDir = path.join(outDir, "photos", id);
      await mkdir(fileSystemDir, { recursive: true });
      await writeFile(path.join(fileSystemDir, "index.html"), html, "utf8");
    });

  await Promise.all(tasks);
  logger.info(`[photo-og-pages] Generated ${tasks.length} Open Graph photo pages`);
}

async function loadManifest(manifestPath: string): Promise<ViteManifest> {
  const json = await readFile(manifestPath, "utf8");
  return JSON.parse(json) as ViteManifest;
}

async function readPhotoMetadata(filePath: string): Promise<PhotoMetadataGenerated> {
  const contents = await readFile(filePath, "utf8");
  return JSON.parse(contents) as PhotoMetadataGenerated;
}

function createPhotoPageHtml(
  baseTemplateHtml: string,
  doctype: string | null,
  data: PhotoPageData,
) {
  const document = parse(baseTemplateHtml, {
    lowerCaseTagName: false,
    comment: true,
  });
  const head = document.querySelector("head");
  if (!head) {
    throw new Error("photos.html is missing a <head> element");
  }

  const htmlTitle = `${data.title} • Emma Zuehlcke`;
  setDocumentTitle(head, htmlTitle);
  upsertMeta(head, { name: "description", content: data.description });
  upsertLink(head, "canonical", data.canonicalUrl);

  const metaDefinitions: MetaAttributes[] = [
    { property: "og:type", content: "article" },
    { property: "og:title", content: data.title },
    { property: "og:description", content: data.description },
    { property: "og:image", content: data.imageUrl },
    { property: "og:image:type", content: "image/avif" },
    { property: "og:image:alt", content: data.alt },
    { property: "og:url", content: data.canonicalUrl },
    { property: "og:site_name", content: "Emma Zuehlcke" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: data.title },
    { name: "twitter:description", content: data.description },
    { name: "twitter:image", content: data.imageUrl },
    { name: "twitter:image:alt", content: data.alt },
  ];

  metaDefinitions.forEach((attributes) => {
    upsertMeta(head, attributes);
  });

  if (data.publishedTime) {
    const isoPublished = new Date(data.publishedTime).toISOString();
    upsertMeta(head, { property: "article:published_time", content: isoPublished });
  }

  const serialized = document.toString();
  const normalizedDoctype = (doctype ?? DEFAULT_DOCTYPE).trim();
  return `${normalizedDoctype}\n${serialized}`;
}

function createPhotoRouteMiddleware(
  server: ViteDevServer,
  galleryEntryPath: string,
): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const method = (req.method ?? "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      return next();
    }

    const requestUrl = getRequestUrl(req);
    if (!requestUrl) {
      return next();
    }

    if (!isPhotoRoute(requestUrl.pathname, server.config.base ?? "/")) {
      return next();
    }

    try {
      const template = await readFile(galleryEntryPath, "utf8");
      const originalUrl =
        (req as Connect.IncomingMessage & { originalUrl?: string }).originalUrl ??
        req.url ??
        requestUrl.pathname;
      const transformed = await server.transformIndexHtml(
        requestUrl.pathname,
        template,
        originalUrl,
      );

      res.setHeader("Content-Type", "text/html");
      res.statusCode = 200;
      if (method === "HEAD") {
        res.end();
      } else {
        res.end(transformed);
      }
    } catch (error) {
      next(error as Error);
    }
  };
}

function getRequestUrl(req: Connect.IncomingMessage): URL | null {
  if (!req.url) {
    return null;
  }
  try {
    const origin = `http://${req.headers.host ?? "localhost"}`;
    return new URL(req.url, origin);
  } catch {
    return null;
  }
}

function setDocumentTitle(head: HTMLElement, value: string) {
  let titleElement = head.querySelector("title");
  if (!titleElement) {
    titleElement = createElement("title");
    head.appendChild(titleElement);
  }
  titleElement.set_content(value);
}

function upsertMeta(head: HTMLElement, attributes: MetaAttributes) {
  const selector = attributes.property
    ? `meta[property="${attributes.property}"]`
    : attributes.name
      ? `meta[name="${attributes.name}"]`
      : null;
  let element = selector ? (head.querySelector(selector) as HTMLElement | null) : null;
  if (!element) {
    element = createElement("meta");
    head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined) {
      element!.setAttribute(key, value);
    }
  });
}

function upsertLink(head: HTMLElement, rel: string, href: string) {
  let element = head.querySelector(`link[rel="${rel}"]`) as HTMLElement | null;
  if (!element) {
    element = createElement("link");
    head.appendChild(element);
  }
  element.setAttribute("rel", rel);
  element.setAttribute("href", href);
}

function createElement(tagName: string): HTMLElement {
  const fragment = parse(`<${tagName}></${tagName}>`);
  if (fragment.tagName?.toLowerCase() === tagName.toLowerCase()) {
    return fragment;
  }
  const child = fragment.querySelector(tagName);
  if (!child) {
    throw new Error(`Unable to create <${tagName}> element`);
  }
  return child;
}

function splitDoctype(html: string): { doctype: string | null; templateHtml: string } {
  const match = html.match(/^\s*<!doctype[^>]*>/i);
  if (!match) {
    return { doctype: null, templateHtml: html };
  }
  const templateHtml = html.slice(match[0].length);
  return { doctype: match[0], templateHtml };
}

function addBase(pathWithQuery: string, base: string): string {
  const [pathname, query] = pathWithQuery.split("?");
  if (base === "./") {
    return query ? `${normalizePath(pathname)}?${query}` : normalizePath(pathname);
  }

  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const cleanedPath = normalizePath(pathname).replace(/^\//, "");
  const combined = `${normalizedBase}${cleanedPath}`.replace(/\/{2,}/g, "/");
  return query ? `${combined}?${query}` : combined;
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/");
}

function toAbsoluteUrl(pathname: string, siteUrl: string): string {
  const cleaned = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return new URL(cleaned, siteUrl).toString();
}

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("siteUrl must be a non-empty absolute URL");
  }

  const url = new URL(trimmed);
  return url.href.endsWith("/") ? url.href : `${url.href}/`;
}

function toManifestKey(...segments: string[]): string {
  return segments.join("/").replace(/\\/g, "/");
}

function buildPhotoDescription(title?: string, dateIso?: string): string {
  const dateText = formatReadableDate(dateIso);
  if (title && dateText) {
    return `${title} — captured ${dateText}.`;
  }
  if (title) {
    return `${title} — part of Emma Zuehlcke's photo journal.`;
  }
  if (dateText) {
    return `Photo captured ${dateText}.`;
  }
  return "Photo from Emma Zuehlcke.";
}

function formatReadableDate(dateIso?: string): string | undefined {
  if (!dateIso) {
    return undefined;
  }
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
