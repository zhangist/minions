// env init
process.env.SERVER_HOST = process.env.SERVER_HOST || "http://localhost";
process.env.SERVER_PORT = process.env.SERVER_PORT || "1992";
process.env.CLIENT_NAME =
  process.env.CLIENT_NAME || "client_" + new Date().getTime();

// abstract
process.env.SERVER_FILES_DIR = process.env.SERVER_FILES_DIR || "";
process.env.CLIENT_FILES_DIR = process.env.CLIENT_FILES_DIR || "";
process.env.TEMP_DIR = process.env.TEMP_DIR || "";
