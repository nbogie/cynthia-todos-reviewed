export function getEnvVarOrFail(key: string) {
  const found = process.env[key];
  if (found) {
    return found;
  } else {
    throw new Error("missing required env var:");
  }
}
