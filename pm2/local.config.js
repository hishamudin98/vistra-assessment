const standard = require("./config.js");

const custom_apps = [
  {
    ...standard.config.auth_app,
    script: "node_modules/.bin/nest",
    args: "start auth --watch",
    watch: false,
    env: {
      ...standard.config.auth_app.env,
    },
  },
  {
    ...standard.config.core_app,
    script: "node_modules/.bin/nest",
    args: "start core --watch",
    watch: false,
    env: {
      ...standard.config.core_app.env,
    },
  },
  {
    ...standard.config.frontend,
  },
];

module.exports = {
  apps: custom_apps,
};
