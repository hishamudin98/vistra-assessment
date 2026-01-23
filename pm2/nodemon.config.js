const standard = require("./config.js");

module.exports = {
  watch: ["../backend-nest-js/apps/auth"],
  ext: "ts",
  exec: "cd ../backend-nest-js && rimraf dist && nest start auth",
  env: {
    ...standard.config.auth_app.env
  }
};
