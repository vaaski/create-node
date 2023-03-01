import type { PackageJson } from "type-fest"
import minimist from "minimist"

export const argv = minimist(process.argv.slice(2))

export const config = {
  projectName: "",
  targetDirectory: "",
  withFrontend: true,
  frontendTemplate: "",

  backendBuilder: false,
}

export const dependencies: string[] = []
export const devDependencies: string[] = []

export const packageJsonScripts: Record<string, string> = {
  // test: 'echo "no tests"',
  // start: "tsx ./src/index.ts",
}

export const packageJson: PackageJson = {
  name: "create-node",
  version: "0.0.0",
  description: "",
  type: "module",
  keywords: [],
  author: "",
  license: "MIT",
}

export const getBackendFolder = () => {
  return config.withFrontend ? "backend" : "src"
}
export const getBackendDistribution = () => {
  return config.withFrontend ? "dist-backend" : "dist"
}

export const getTsconfigFilename = () => {
  return config.withFrontend ? "tsconfig.backend.json" : "tsconfig.json"
}
