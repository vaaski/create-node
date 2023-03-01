import { rename } from "node:fs/promises"
import { join } from "node:path"
import { config } from "./shared"
import { exists, forwardedExeca } from "./util"

const patchViteEnvironmentAbbreviation = async () => {
  const viteEnvironmentPath = join(config.targetDirectory, "./src/vite-environment.d.ts")

  /* eslint-disable unicorn/prevent-abbreviations */
  const viteEnvPath = join(config.targetDirectory, "./src/vite-env.d.ts")
  const viteEnvExists = await exists(viteEnvPath)

  if (viteEnvExists) await rename(viteEnvPath, viteEnvironmentPath)

  /* eslint-enable unicorn/prevent-abbreviations */
}

export const addVite = async () => {
  await forwardedExeca("npx", ["--yes", "create-vite@latest", config.projectName], {
    cwd: join(config.targetDirectory, ".."),
  })

  await patchViteEnvironmentAbbreviation()
}
