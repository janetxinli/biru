module.exports = {
  env: {
    BACKEND_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://api.biru.cool",
  },
};
