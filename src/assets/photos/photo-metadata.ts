/**
 * Custom metadata for photos that isn't part of the EXIF data we extract using
 * the script.
 */
export const photoMetadata: Record<string, { alt: string; position?: string }> = {
  "liminal-space": {
    alt: "A large, empty basement with white walls and floor tiles. Square ceiling lights illuminate the space, and several dark rectangular columns are evenly spaced throughout. On two of the columns in the front there are small green emergency exit signs. In the back right corner there is a hunched down person with a winter jacket on, facing away from the camera.",
  },
  reflections: {
    alt: "Reflection of bare trees on a calm water surface, with patches of snow visible along the edge.",
  },
  "asia-wok": {
    alt: 'A small Asian restaurant named "Asia Wok" with an illuminated sign, located on a dimly lit street corner at night.',
  },
  surveillance: {
    alt: "Surveillance camera mounted on a structure, lit by a bright light. Bird spikes are visible near the camera. A dark screen is partially visible in the foreground. Ceiling with grid pattern overhead.",
  },
  montreal: {
    alt: "Foggy cityscape with modern high-rise buildings partially obscured by mist.",
  },
  "shades-of-blue": {
    alt: "A vast ocean view with shades of turquoise water under a bright blue sky. A small sailboat is visible on the right horizon, and a few wispy clouds stretch across the sky.",
  },
  vienna: {
    alt: "A street view of a building featuring a shop with a metal shutter painted with a cartoonish bear-like creature. The sign above reads Juwelen, and the door and windows are adorned with graffiti. The sidewalk is made of stone tiles.",
  },
  vancouver: {
    alt: "A cityscape featuring a tower with a circular observation deck displaying a Canadian flag. The tower is framed by modern high-rise buildings with reflective glass windows under a clear blue sky.",
  },
  windows: {
    alt: "A modern building with large reflective windows is angled against a bright blue sky with a few white clouds. The structure appears to be made of concrete or a similar material, showcasing a geometric design.",
  },
  teufelsberg: {
    alt: "Aerial view of a vast green forest under a partly cloudy sky. Sunlight streams through clouds, illuminating patches of the forest. Two geodesic dome structures are visible on a hill to the left. A distant body of water is seen on the horizon.",
    position: "left center",
  },
  "muted-sky": {
    alt: "Dark gray storm clouds loom over a landscape with trees and a field. The trees are lush and green, contrasting with the dramatic sky, suggesting an impending storm.",
    position: "center bottom",
  },
  tempelhof: {
    alt: "A vast field of golden grass under a clear blue sky as the sun sets. In the distance, a citys skyline is visible with various buildings and towers. The scene is peaceful and illuminated by warm, golden light.",
  },
  oulu: {
    alt: "Upward view of a staircase leading to a small structure with a flagpole on top. The sky is clear and blue, and the perspective highlights the symmetry and linearity of the stairs and railings.",
  },
  fern: {
    alt: "A close-up of a fern leaf with its green fronds spreading out in a feather-like pattern. The leaf is backlit by soft sky light, creating a delicate, textured appearance with blurred greenery in the background.",
  },
  "moon-on-muted-blue": {
    alt: "Bare tree branches arching toward a night sky with a visible waxing gibbous moon. The branches appear intricate and almost lace-like, framing the moon in the dark, muted blue background.",
  },
  "sky-and-branches": {
    alt: "A silhouette of leafy branches against a bright blue sky. The shapes of the leaves are distinctly serrated, and some evergreen trees are faintly visible in the background on the left.",
  },
  "mansfelder-strasse": {
    alt: "A close-up view of a modern high-rise building with a grid-like facade featuring square windows. The structure has staggered sections, creating a unique layered appearance. The evening sunlight casts a soft pinkish glow on the building, while a few windows are illuminated from inside. The sky in the background is clear and pale.",
  },
  "half-life-2": {
    alt: "A tall red-and-white transmission tower stands prominently in the center of the image, surrounded by cables for stabilization. In the background, apartment buildings and residential structures are visible under a soft, golden sunset sky. Below the urban area, a dense forest stretches across the foreground. The clouds above add texture to the serene atmosphere.",
  },
};
