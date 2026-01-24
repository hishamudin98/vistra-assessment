const standard = require("./config.js");

const auth_app = {
  watch: ["../backend/apps/auth"],
  ext: "ts",
  exec: "cd ../backend/apps/auth && rimraf dist && nest start auth",
  env: {
    ...standard.config.auth_app.env
  }
};

const core_app = {
  watch: ["../backend/apps/core"],
  ext: "ts",
  exec: "cd ../backend/apps/core && rimraf dist && nest start core",
  env: {
    ...standard.config.core_app.env
  }
}

module.exports = {
  auth_app,
  core_app
};
