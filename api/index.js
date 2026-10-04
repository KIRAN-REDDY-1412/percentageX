const path = require("path");

// Safely resolve client/server/index.cjs relative to this file's location
const serverPath = path.resolve(__dirname, "../client/server/index.cjs");
const app = require(serverPath);

module.exports = app;
