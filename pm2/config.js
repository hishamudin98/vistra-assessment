const GLOBAL_ENV = {
  NODE_ENV: "development",
};

const auth_app = {
  name: "auth",
  namespace: "service",
  script: "dist/apps/auth/main.js",
  cwd: "./backend-nest-js", // change this to your project path
  watch: true,
  ignore_watch: ["node_modules"],
  autorestart: true,
  env: {
    ...GLOBAL_ENV,
    PORT: 1010,
    GLOBAL_PREFIX: "api/auth",
    NODE_OPTIONS: "--openssl-legacy-provider",
  },
};

const core_app = {
  name: "core",
  namespace: "service",
  script: "dist/apps/core/main.js",
  cwd: "./backend-nest-js", // change this to your project path
  watch: true,
  ignore_watch: ["node_modules"],
  autorestart: true,
  env: {
    ...GLOBAL_ENV,
    PORT: 1010,
    GLOBAL_PREFIX: "api/core",
    NODE_OPTIONS: "--openssl-legacy-provider",
  },
};

const custom_apps = [auth_app, core_app];

module.exports = {
  apps: custom_apps,
  config: {
    auth_app,
    core_app,
  },
};
