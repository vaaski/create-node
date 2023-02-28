import { writeFile } from "node:fs/promises"
import { join } from "node:path"
import { config, dependencies, devDependencies, packageJson } from "./shared"

export const writePackageJson = async () => {
  const packageJsonPath = join(config.targetDirectory, "package.json")

  console.log({ packageJson })
  await writeFile(packageJsonPath, JSON.stringify(packageJson, undefined, 2))
}

export const installDependencies = async () => {
  console.log({ dependencies, devDependencies })
}
