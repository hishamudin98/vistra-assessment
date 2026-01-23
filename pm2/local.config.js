const standard = require("./config.js");

const custom_apps = [
  {
    ...standard.config.auth_app,
    script: "npm run start:auth",
    // args: ["run dev:auth"],
    env: {
      ...standard.config.auth_app.env,
    },
  },
];

module.exports = {
  apps: custom_apps,
};
