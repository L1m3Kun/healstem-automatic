function requireEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Eviroment Error: key - ${key}`);
  }
  return value;
}

export { requireEnv };
