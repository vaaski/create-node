import JSON5 from "json5"
import { appendFile, readFile } from "node:fs/promises"
import { join } from "node:path"
import type { PackageJson, TsConfigJson } from "type-fest"
import {
  config,
  dependencies,
  devDependencies,
  getBackendDistribution,
  getBackendFolder,
  getTsconfigFilename,
  packageJson,
  packageJsonScripts,
} from "./config"
import { forwardedExeca, readProjectFile, writeProjectFile } from "./util"

export const patchFrontendPackageJson = async () => {
  const existingPackageJsonPath = join(config.targetDirectory, "package.json")
  const existingPackageJsonBuffer = await readFile(existingPackageJsonPath)
  const existingPackageJson: PackageJson = JSON5.parse(
    existingPackageJsonBuffer.toString()
  )

  if (typeof existingPackageJson !== "object" || existingPackageJson === null) {
    throw new Error("Invalid package.json")
  }

  const newScripts: Record<string, string | undefined> = {
    ...existingPackageJson.scripts,
    ...packageJson.scripts,
    "front:dev": existingPackageJson.scripts?.dev,
    "front:build": existingPackageJson.scripts?.build,
    "front:preview": existingPackageJson.scripts?.preview,
    "back:dev": packageJson.scripts?.dev,
    "back:build": packageJson.scripts?.build,
    "back:start": packageJson.scripts?.start,
  }

  delete newScripts.dev
  delete newScripts.build
  delete newScripts.preview
  delete newScripts.start

  const newPackageJson = {
    ...packageJson,
    ...existingPackageJson,
    scripts: newScripts,
  }

  await writeProjectFile("package.json", newPackageJson)
}

export const writePackageJson = async () => {
  packageJson.name = config.projectName
  packageJson.scripts = packageJsonScripts

  if (config.withFrontend) {
    await patchFrontendPackageJson()
  } else {
    await writeProjectFile("package.json", packageJson)
  }
}

export const installDependencies = async () => {
  if (dependencies.length > 0) {
    console.log(`installing ${dependencies.length} dependencies...`)
    await forwardedExeca("npm", ["install", ...dependencies])
  }

  if (devDependencies.length > 0) {
    console.log(`installing ${devDependencies.length} development dependencies...`)
    await forwardedExeca("npm", ["install", "-D", ...devDependencies])
  }
}

const defaultGitignore = ["node_modules", "dist", ".DS_Store"].join("\n")
export const writeGitignore = async () => {
  if (config.withFrontend) {
    const gitignorePath = join(config.targetDirectory, ".gitignore")
    const gitignorePatch = `"\n# Backend\n${getBackendDistribution()}`

    await appendFile(gitignorePath, gitignorePatch)
  } else {
    await writeProjectFile(".gitignore", defaultGitignore)
  }
}
export const initializeGit = async () => {
  await forwardedExeca("git", ["init"])
}
export const initialCommit = async () => {
  await forwardedExeca("git", ["add", "."])
  await forwardedExeca("git", ["commit", "-m", "init"])
}

const patchFrontendTsconfig = async () => {
  // const existingTsconfigPath = join(config.targetDirectory, "tsconfig.json")
  // const existingTsconfigBuffer = await readFile(existingTsconfigPath)
  // const existingTsconfig = JSON5.parse(existingTsconfigBuffer.toString())
  const existingTsconfig = await readProjectFile<TsConfigJson>("tsconfig.json")

  if (typeof existingTsconfig !== "object" || existingTsconfig === null) {
    throw new TypeError("Invalid tsconfig.json")
  }

  if (!Array.isArray(existingTsconfig.references)) {
    existingTsconfig.references = []
  }

  existingTsconfig.references.push({
    path: `./${getTsconfigFilename()}`,
  })

  await writeProjectFile("tsconfig.json", existingTsconfig)
}
const makeTsconfig = () => ({
  compilerOptions: {
    composite: config.withFrontend,
    module: "ESNext",
    target: "ESNext",
    moduleResolution: "Node",
    allowSyntheticDefaultImports: true,
    skipLibCheck: true,
    types: ["@types/node"],
    strict: true,
    lib: ["ES6"],
  },
  include: [`${getBackendFolder()}/**/*.ts`],
})
export const writeTsconfig = async () => {
  const configLocation = getTsconfigFilename()
  devDependencies.push("typescript", "@types/node")

  if (config.withFrontend) await patchFrontendTsconfig()

  await writeProjectFile(configLocation, makeTsconfig())
}
