const API_ORIGIN = "https://pathfinder.tryasp.net";

export const resolveMediaUrl = (value) => {
  if (typeof value !== "string") return null;

  const trimmedValue = value.trim();
  if (
    !trimmedValue ||
    trimmedValue.toLowerCase().startsWith("string") ||
    trimmedValue.toLowerCase() === "null" ||
    trimmedValue.toLowerCase() === "undefined"
  ) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue;

  const normalizedPath = trimmedValue.startsWith("/")
    ? trimmedValue
    : `/${trimmedValue}`;
  return `${API_ORIGIN}${normalizedPath}`;
};
