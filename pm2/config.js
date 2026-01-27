const GLOBAL_ENV = {
  NODE_ENV: "development",
  DATABASE_URL: "mysql://vistra_user:Vistra%40123456@localhost:3306/vistra_db?allowPublicKeyRetrieval=true",
};

const auth_app = {
  name: "auth",
  namespace: "service",
  script: "dist/apps/auth/main.js",
  cwd: "./backend",
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
  cwd: "./backend",
  watch: true,
  ignore_watch: ["node_modules"],
  autorestart: true,
  env: {
    ...GLOBAL_ENV,
    PORT: 1011,
    GLOBAL_PREFIX: "api/core",
    NODE_OPTIONS: "--openssl-legacy-provider",
  },
};

const frontend = {
  name: "frontend",
  namespace: "service",
  script: "npm",
  args: "run dev",
  cwd: "./frontend",
  watch: false,
  autorestart: true,
  env: {
    NODE_ENV: "development",
    PORT: 3000,
  },
};

const custom_apps = [auth_app, core_app, frontend];

module.exports = {
  apps: custom_apps,
  config: {
    auth_app,
    core_app,
    frontend,
  },
};
