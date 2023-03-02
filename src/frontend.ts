import { rename } from "node:fs/promises"
import { join } from "node:path"
import prompts from "prompts"
import { argv, config } from "./shared"
import { exists, forwardedExeca, onCancel } from "./util"

const patchViteEnvironmentAbbreviation = async () => {
  const viteEnvironmentPath = join(config.targetDirectory, "./src/vite-environment.d.ts")

  /* eslint-disable unicorn/prevent-abbreviations */
  const viteEnvPath = join(config.targetDirectory, "./src/vite-env.d.ts")
  const viteEnvExists = await exists(viteEnvPath)

  if (viteEnvExists) await rename(viteEnvPath, viteEnvironmentPath)

  /* eslint-enable unicorn/prevent-abbreviations */
}

export const addVite = async () => {
  const npxArguments = ["--yes", "create-vite@latest", config.projectName]
  if (config.frontendTemplate) npxArguments.push("--template", config.frontendTemplate)

  await forwardedExeca("npx", npxArguments, {
    cwd: join(config.targetDirectory, ".."),
  })

  await patchViteEnvironmentAbbreviation()
}

export const askForFrontend = async () => {
  const frontendFlag = argv.frontend
  const noFrontendFlag = frontendFlag === false

  if (noFrontendFlag) {
    config.withFrontend = false
  } else {
    const { createFrontend } = await prompts(
      {
        type: config.frontendTemplate || noFrontendFlag ? undefined : "confirm",
        name: "createFrontend",
        initial: true,
        message: "Add frontend with Vite?",
      },
      { onCancel }
    )
    config.withFrontend = !!config.frontendTemplate || createFrontend
    if (config.withFrontend && !frontendFlag) await addVite()
  }
}
