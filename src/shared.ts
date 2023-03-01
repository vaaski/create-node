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

export const getPackageJson = (): PackageJson => ({
  name: "create-node",
  version: "0.0.0",
  description: "",
  type: "module",
  main: `./${getBackendDistribution()}/index.cjs`,
  types: `./${getBackendDistribution()}/index.d.ts`,
  files: [getBackendDistribution()],
  exports: {
    ".": {
      import: `./${getBackendDistribution()}/index.mjs`,
      require: `./${getBackendDistribution()}/index.cjs`,
    },
  },
  keywords: [],
  author: "",
  license: "MIT",
})

export const getBackendFolder = () => (config.withFrontend ? "backend" : "src")
export const getBackendDistribution = () =>
  config.withFrontend ? "dist-backend" : "dist"
