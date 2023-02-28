import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { config, devDependencies, packageJsonScripts } from "./shared"
import { getBackendFolder, writeProjectFile } from "./util"

export const createBackend = async () => {
  const backendFolder = getBackendFolder()
  const backendPath = join(config.targetDirectory, backendFolder)

  devDependencies.push("typescript", "tsx")

  await mkdir(backendPath, { recursive: true })
  await writeProjectFile(join(backendFolder, "index.ts"), `console.log("Hello, world!")`)
}

const nodemonConfig = {
  watch: ["src/**/*.ts"],
  ext: "ts",
  exec: "npx tsx",
  events: {
    start: 'node -e "console.clear()"',
  },
}
export const addNodemon = async () => {
  devDependencies.push("nodemon")

  packageJsonScripts.dev = "nodemon ./src/index.ts"

  await writeProjectFile("nodemon.json", nodemonConfig)
}

export const addUnbuild = async () => {
  devDependencies.push("unbuild")

  packageJsonScripts.build = "unbuild"
}

export const addPm2 = async () => {
  const pm2Config = {
    apps: [
      {
        name: config.projectName,
        script: "npx tsx backend/index.ts",
      },
    ],
  }

  writeProjectFile("pm2.json", pm2Config)
}
