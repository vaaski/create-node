import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { config, devDependencies, getBackendDistribution, getBackendFolder, packageJson, packageJsonScripts } from "./shared"
import { writeProjectFile } from "./util"

export const createBackend = async () => {
  const backendFolder = getBackendFolder()
  const backendPath = join(config.targetDirectory, backendFolder)

  devDependencies.push("tsx")
  packageJsonScripts.start = `tsx ./${getBackendFolder()}/index.ts`

  await mkdir(backendPath, { recursive: true })

  const defaultIndexTs = `console.log("Hello, world!")\nexport{}`
  await writeProjectFile(join(backendFolder, "index.ts"), defaultIndexTs)
}

const nodemonConfig = () => ({
  watch: [`${getBackendFolder()}/**/*.ts`],
  ext: "ts",
  exec: "npx tsx",
  events: {
    start: 'node -e "console.clear()"',
  },
})
export const addNodemon = async () => {
  devDependencies.push("nodemon")

  packageJsonScripts.dev = `nodemon ./${getBackendFolder()}/index.ts`

  await writeProjectFile("nodemon.json", nodemonConfig())
}

export const getUnbuildConfig = () => ({
  main: `./${getBackendDistribution()}/index.cjs`,
  types: `./${getBackendDistribution()}/index.d.ts`,
  files: [getBackendDistribution()],
  exports: {
    ".": {
      import: `./${getBackendDistribution()}/index.mjs`,
      require: `./${getBackendDistribution()}/index.cjs`,
    },
  },
  unbuild: {
    entries: [`./${getBackendFolder()}/index`],
    outDir: `./${getBackendDistribution()}`,
    declaration: true,
    rollup: {
      emitCJS: true,
    },
  },
})
export const addUnbuild = async () => {
  devDependencies.push("unbuild")

  const unbuildConfig = getUnbuildConfig()
  const configEntries = Object.entries(unbuildConfig)

  for (const [key, value] of configEntries) {
    packageJson[key] = value
  }

  packageJsonScripts.build = "unbuild"
}

export const addPm2 = async () => {
  const pm2Config = {
    apps: [
      {
        name: config.projectName,
        script: `npx tsx ${getBackendFolder()}/index.ts`,
      },
    ],
  }

  writeProjectFile("pm2.json", pm2Config)
}
