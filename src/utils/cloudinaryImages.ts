/** Cloudinary public delivery only. Original local assets remain in Git for rollback. */
const CLOUD = "https://res.cloudinary.com/wujcxa24/image/upload/";
const versions: Record<string, number> = {
  "apple-touch-icon.png": 1792672476,
  "favicon.png": 1792672476,
  "rafi-signature.webp": 1792672476,
  "hero-atmosphere.webp": 1792672486,
  "original-bg-reference.webp": 1792672486,
  "rafi-portrait.png": 1792672495,
  "datapulse.webp": 1792672548,
  "boraq.webp": 1792672547,
  "robotics.webp": 1792672548,
  "best-panel-member.webp": 1792672565,
  "best-panel-member-proof.png": 1792672611,
  "hackathon-champion.webp": 1792672565,
  "hackathon-champion-proof.png": 1792672637,
  "research-symposium.webp": 1792672566,
  "research-symposium-proof.png": 1792672607,
  "sicko-soul-showcase.webp": 1792672645,
  "sicko-soul-original.png": 1792672704,
  "banglafakemmd.webp": 1792672548,
  "driver-vision.webp": 1792672545,
  "zero-trust.webp": 1792672554,
  "submission.webp": 1792672549,
  "geospatial.webp": 1792672544,
  "histopathology.webp": 1792672544,
  "make-my-event.webp": 1792672506,
  "smart-inventory.webp": 1792672531,
  "careerpath.webp": 1792672510,
  "safepath.webp": 1792672511,
  "ridesplit.webp": 1792672509,
  "robotics-mobile.webp": 1792672512,
  "aust-students.webp": 1792672500,
  "nutritrack.webp": 1792672511,
  "hercue.webp": 1792672504,
  "pixeltext.webp": 1792672511,
  "docmind.webp": 1792672502,
  "deepfake.webp": 1792672504,
  "insurance.webp": 1792672505,
  "head-detection.webp": 1792672506,
  "flaresphere.webp": 1792672505,
  "loveos.webp": 1792672513,
  "ai-image-generator.webp": 1792672505,
  "sicko-soul.webp": 1792672512
};

function original(pathOrUrl: string): string {
  if (pathOrUrl.startsWith(CLOUD)) {
    // Remove a previously added delivery transformation before resizing.
    return pathOrUrl.replace(/\/image\/upload\/(?:f_[^/]*|q_[^/]*)\//, "/image/upload/");
  }
  // Uploaded portfolio files use their unique basenames as Cloudinary public IDs.
  let file = pathOrUrl.split("/").pop() ?? "";
  // The uploaded portrait PNG is the source for the website's WebP variant.
  if (file === "rafi-portrait.webp") file = "rafi-portrait.png";
  const version = versions[file];
  return version ? CLOUD + "v" + version + "/" + file : pathOrUrl;
}

export function cloudinaryOriginal(pathOrUrl: string): string {
  return original(pathOrUrl);
}

export function cloudinaryImage(pathOrUrl: string, width?: number): string {
  const url = original(pathOrUrl);
  if (!url.startsWith(CLOUD)) return url;
  const size = width ? ",c_limit,w_" + Math.round(width) : "";
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto:good" + size + "/");
}

export function cloudinaryResized(pathOrUrl: string, width: number): string {
  return cloudinaryImage(pathOrUrl, width);
}

export function cloudinarySrcset(pathOrUrl: string, widths: number[]): string {
  return widths.map(width => cloudinaryImage(pathOrUrl, width) + " " + width + "w").join(", ");
}

export function cloudinaryProjectCover(slug: string, width = 1200): string {
  return cloudinaryImage("/assets/project-covers/" + slug + ".webp", width);
}

export function cloudinaryProjectCoverSrcSet(slug: string): string {
  return cloudinarySrcset("/assets/project-covers/" + slug + ".webp", [480, 768, 960, 1200, 1400]);
}
