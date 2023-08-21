export default function getEnvVarOrFail(key: string) {
  const found = process.env[key];
  if (found) {
    return found;
  } else {
    throw new Error("No env var found for" + key);
  }
}
