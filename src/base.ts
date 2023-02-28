import { config, dependencies, devDependencies, packageJson } from "./shared"
import { writeProjectFile } from "./util"

export const writePackageJson = async () => {
  packageJson.name = config.projectName

  console.log({ packageJson })
  await writeProjectFile("package.json", packageJson)
}

export const installDependencies = async () => {
  console.log("installing dependencies...")
  console.log({ dependencies, devDependencies })
}

const defaultGitignore = ["node_modules", "dist"].join("\n")
export const writeGitignore = async () => {
  await writeProjectFile(".gitignore", defaultGitignore)
}

const defaultTsconfig = {
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
  include: ["src/**/*.ts"],
}
export const writeTsconfig = async () => {
  await writeProjectFile("tsconfig.json", defaultTsconfig)
}
