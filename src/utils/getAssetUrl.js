export function getAssetUrl(relativePath) {
  if (typeof relativePath !== "string") {
    throw new TypeError(
      `getAssetUrl expected a string, but received: ${JSON.stringify(relativePath)}`,
    );
  }
  return relativePath.replace("./", import.meta.env.BASE_URL);
}
