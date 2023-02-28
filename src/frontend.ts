import { join } from "node:path"
import { config } from "./shared"
import { forwardedExeca } from "./util"

export const addVite = async () => {
  await forwardedExeca("npx", ["--yes", "create-vite@latest", config.projectName], {
    cwd: join(config.targetDirectory, ".."),
  })
}
