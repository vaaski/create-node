module.exports = {
  apps: [
    {
      script: "./lib/index.js",
      name: "{{APP_NAME}}",
      node_args: "-r dotenv/config",
    },
  ],
}
