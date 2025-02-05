import { GalleryImage } from "../../types";

// Full size images
import liminalSpace from "./full-size/liminal-space.avif";
import reflections from "./full-size/reflections.avif";
import asiaWok from "./full-size/asia-wok.avif";
import montreal from "./full-size/montreal.avif";
import shadesOfBlue from "./full-size/shades-of-blue.avif";
import surveillance from "./full-size/surveillance.avif";
import tempelhof from "./full-size/tempelhof.avif";
import teufelsberg from "./full-size/teufelsberg.avif";
import vancouver from "./full-size/vancouver.avif";
import windows from "./full-size/windows.avif";
import vienna from "./full-size/vienna.avif";
import mutedSky from "./full-size/muted-sky.avif";
import oulu from "./full-size/oulu.avif";

// Thumbnails
import liminalSpaceThumbnail from "./thumbnails/liminal-space.avif";
import reflectionsThumbnail from "./thumbnails/reflections.avif";
import asiaWokThumbnail from "./thumbnails/asia-wok.avif";
import montrealThumbnail from "./thumbnails/montreal.avif";
import shadesOfBlueThumbnail from "./thumbnails/shades-of-blue.avif";
import surveillanceThumbnail from "./thumbnails/surveillance.avif";
import tempelhofThumbnail from "./thumbnails/tempelhof.avif";
import teufelsbergThumbnail from "./thumbnails/teufelsberg.avif";
import vancouverThumbnail from "./thumbnails/vancouver.avif";
import windowsThumbnail from "./thumbnails/windows.avif";
import viennaThumbnail from "./thumbnails/vienna.avif";
import mutedSkyThumbnail from "./thumbnails/muted-sky.avif";
import ouluThumbnail from "./thumbnails/oulu.avif";

// Metadata
import liminalSpaceMeta from "./meta/liminal-space.json";
import reflectionsMeta from "./meta/reflections.json";
import asiaWokMeta from "./meta/asia-wok.json";
import montrealMeta from "./meta/montreal.json";
import shadesOfBlueMeta from "./meta/shades-of-blue.json";
import surveillanceMeta from "./meta/surveillance.json";
import tempelhofMeta from "./meta/tempelhof.json";
import teufelsbergMeta from "./meta/teufelsberg.json";
import vancouverMeta from "./meta/vancouver.json";
import windowsMeta from "./meta/windows.json";
import viennaMeta from "./meta/vienna.json";
import mutedSkyMeta from "./meta/muted-sky.json";
import ouluMeta from "./meta/oulu.json";

/**
 * Collection of all gallery photos with their metadata
 */
export const photos: GalleryImage[] = [
  {
    src: liminalSpace,
    thumbnail: liminalSpaceThumbnail,
    alt: "A large, empty basement with white walls and floor tiles. Square ceiling lights illuminate the space, and several dark rectangular columns are evenly spaced throughout. On two of the columns in the front there are small green emergency exit signs. In the back right corner there is a hunched down person with a winter jacket on, facing away from the camera.",
    caption: "Liminal Space",
    date: new Date(liminalSpaceMeta.DateTimeOriginal),
    metadata: liminalSpaceMeta,
  },
  {
    src: reflections,
    thumbnail: reflectionsThumbnail,
    alt: "Reflection of bare trees on a calm water surface, with patches of snow visible along the edge.",
    caption: "Reflections",
    date: new Date(reflectionsMeta.DateTimeOriginal),
    metadata: reflectionsMeta,
  },
  {
    src: asiaWok,
    thumbnail: asiaWokThumbnail,
    alt: 'A small Asian restaurant named "Asia Wok" with an illuminated sign, located on a dimly lit street corner at night.',
    caption: "Asia Wok",
    date: new Date(asiaWokMeta.DateTimeOriginal),
    metadata: asiaWokMeta,
  },
  {
    src: surveillance,
    thumbnail: surveillanceThumbnail,
    alt: "Surveillance camera mounted on a structure, lit by a bright light. Bird spikes are visible near the camera. A dark screen is partially visible in the foreground. Ceiling with grid pattern overhead.",
    caption: "Surveillance",
    date: new Date(surveillanceMeta.DateTimeOriginal),
    metadata: surveillanceMeta,
  },
  {
    src: montreal,
    thumbnail: montrealThumbnail,
    alt: "Foggy cityscape with modern high-rise buildings partially obscured by mist.",
    caption: "Montreal",
    date: new Date(montrealMeta.DateTimeOriginal),
    metadata: montrealMeta,
  },
  {
    src: shadesOfBlue,
    thumbnail: shadesOfBlueThumbnail,
    alt: "A vast ocean view with shades of turquoise water under a bright blue sky. A small sailboat is visible on the right horizon, and a few wispy clouds stretch across the sky.",
    caption: "Shades of Blue",
    date: new Date(shadesOfBlueMeta.DateTimeOriginal),
    metadata: shadesOfBlueMeta,
  },
  {
    src: vienna,
    thumbnail: viennaThumbnail,
    alt: "A street view of a building featuring a shop with a metal shutter painted with a cartoonish bear-like creature. The sign above reads Juwelen, and the door and windows are adorned with graffiti. The sidewalk is made of stone tiles.",
    caption: "Vienna",
    date: new Date(viennaMeta.DateTimeOriginal),
    metadata: viennaMeta,
  },
  {
    src: vancouver,
    thumbnail: vancouverThumbnail,
    alt: "A cityscape featuring a tower with a circular observation deck displaying a Canadian flag. The tower is framed by modern high-rise buildings with reflective glass windows under a clear blue sky.",
    caption: "Vancouver",
    date: new Date(vancouverMeta.DateTimeOriginal),
    metadata: vancouverMeta,
  },
  {
    src: windows,
    thumbnail: windowsThumbnail,
    alt: "A modern building with large reflective windows is angled against a bright blue sky with a few white clouds. The structure appears to be made of concrete or a similar material, showcasing a geometric design.",
    caption: "Windows",
    date: new Date(windowsMeta.DateTimeOriginal),
    metadata: windowsMeta,
  },
  {
    src: teufelsberg,
    thumbnail: teufelsbergThumbnail,
    alt: "Aerial view of a vast green forest under a partly cloudy sky. Sunlight streams through clouds, illuminating patches of the forest. Two geodesic dome structures are visible on a hill to the left. A distant body of water is seen on the horizon.",
    caption: "Teufelsberg",
    position: "left center",
    date: new Date(teufelsbergMeta.DateTimeOriginal),
    metadata: teufelsbergMeta,
  },
  {
    src: mutedSky,
    thumbnail: mutedSkyThumbnail,
    alt: "Dark gray storm clouds loom over a landscape with trees and a field. The trees are lush and green, contrasting with the dramatic sky, suggesting an impending storm.",
    caption: "Muted Sky",
    position: "center bottom",
    date: new Date(mutedSkyMeta.DateTimeOriginal),
    metadata: mutedSkyMeta,
  },
  {
    src: tempelhof,
    thumbnail: tempelhofThumbnail,
    alt: "A vast field of golden grass under a clear blue sky as the sun sets. In the distance, a citys skyline is visible with various buildings and towers. The scene is peaceful and illuminated by warm, golden light.",
    caption: "Tempelhof",
    date: new Date(tempelhofMeta.DateTimeOriginal),
    metadata: tempelhofMeta,
  },
  {
    src: oulu,
    thumbnail: ouluThumbnail,
    alt: "Upward view of a staircase leading to a small structure with a flagpole on top. The sky is clear and blue, and the perspective highlights the symmetry and linearity of the stairs and railings.",
    caption: "Oulu",
    date: new Date(ouluMeta.DateTimeOriginal),
    metadata: ouluMeta,
  },
];
