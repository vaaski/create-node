import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { config, devDependencies, packageJson } from "./shared"
import { writeProjectFile } from "./util"

export const createBackend = async () => {
  const backendPath = join(config.targetDirectory, "src")

  devDependencies.push("typescript", "tsx")

  await mkdir(backendPath, { recursive: true })
  await writeProjectFile("index.ts", `console.log("Hello, world!")`)
}

const nodemonConfig = {
  watch: ["src/**/*.ts"],
  "ext:": "ts",
  exec: "npx tsx",
  events: {
    start: 'node -e "console.clear()"',
  },
}

export const addNodemon = async () => {
  devDependencies.push("nodemon")

  if (!packageJson.scripts) packageJson.scripts = {}
  packageJson.scripts.dev = "nodemon ./src/index.ts"

  await writeProjectFile("nodemon.json", nodemonConfig)
}

export const addUnbuild = async () => {
  devDependencies.push("unbuild")

  if (!packageJson.scripts) packageJson.scripts = {}
  packageJson.scripts.build = "unbuild"
}
