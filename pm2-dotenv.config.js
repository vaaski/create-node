module.exports = {
  apps: [
    {
      script: "./dist/index.js",
      name: "{{APP_NAME}}",
      node_args: "-r dotenv/config",
    },
  ],
}
