import type { PackageJson } from "type-fest"

export const config = {
  projectName: "",
  targetDirectory: "",
}

export const dependencies: string[] = []
export const devDependencies: string[] = []

export const packageJson: PackageJson = {
  name: "create-node",
  version: "0.0.0",
  description: "",
  scripts: {
    test: 'echo "no tests"',
    start: "tsx ./src/index.ts",
    // build: "unbuild",
  },
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
