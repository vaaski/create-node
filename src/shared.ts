import type { PackageJson } from "type-fest"

export const config = {
  projectName: "",
  targetDirectory: "",
  withFrontend: true,
}

export const dependencies: string[] = []
export const devDependencies: string[] = []

export const packageJsonScripts: Record<string, string> = {
  // test: 'echo "no tests"',
  start: "tsx ./src/index.ts",
}

export const packageJson: PackageJson = {
  name: "create-node",
  version: "0.0.0",
  description: "",
  type: "module",
  main: "./dist/index.cjs",
  types: "./dist/index.d.ts",
  files: ["dist"],
  exports: {
    ".": {
      import: "./dist/index.mjs",
      require: "./dist/index.cjs",
    },
  },
  keywords: [],
  author: "",
  license: "MIT",
}
