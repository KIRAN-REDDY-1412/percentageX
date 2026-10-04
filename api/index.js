const { createRequire } = require("module");
// Fallback commonjs/esm handler for root deployment
const app = require("./client/server/index.cjs");
module.exports = app;
