const dev = {
  serverUrl: "http://localhost:1992",
};

const prd = {
  serverUrl: "http://soundcontroller.shulive.com",
};

const config = process.env.NODE_ENV === "production" ? prd : dev;

export default config;
