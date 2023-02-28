import type { PackageJson } from "type-fest"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import {
  config,
  dependencies,
  devDependencies,
  packageJson,
  packageJsonScripts,
} from "./shared"
import { forwardedExeca, getBackendFolder, writeProjectFile } from "./util"

export const patchFrontendPackageJson = async () => {
  const existingPackageJsonPath = join(config.targetDirectory, "package.json")
  const existingPackageJsonBuffer = await readFile(existingPackageJsonPath)
  const existingPackageJson: PackageJson = JSON.parse(
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

  // eslint-disable-next-line unicorn/prefer-ternary
  if (config.withFrontend) {
    await patchFrontendPackageJson()
  } else {
    await writeProjectFile("package.json", packageJson)
  }
}

export const installDependencies = async () => {
  console.log("dependencies", { dependencies, devDependencies })

  if (dependencies.length > 0) {
    console.log("installing dependencies...")
    await forwardedExeca("npm", ["install", ...dependencies])
  }

  if (devDependencies.length > 0) {
    console.log("installing development dependencies...")
    await forwardedExeca("npm", ["install", "-D", ...devDependencies])
  }
}

const defaultGitignore = ["node_modules", "dist"].join("\n")
export const writeGitignore = async () => {
  await writeProjectFile(".gitignore", defaultGitignore)
}

const makeTsconfig = () => ({
  compilerOptions: {
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
  const configLocation = config.withFrontend ? "tsconfig.backend.json" : "tsconfig.json"

  await writeProjectFile(configLocation, makeTsconfig())
}
