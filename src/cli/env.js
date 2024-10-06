const parseEnv = () => {
  const prefix = "RSS_";

  Object.entries(process.env).forEach(([key, value]) => {
    if (key.startsWith(prefix)) {
      console.log(`${key}=${value}`);
    }
  });
};

parseEnv();
