module.exports = {
  env: {
    BACKEND_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://biru.vercel.app",
  },

  rewrites: async () => [
    {
      source: "/api/:path*",
      destination:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3001/api/:path*"
          : "http://biru-api.herokuapp.com",
    },
  ],
};
