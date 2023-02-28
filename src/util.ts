import { writeFile } from "node:fs/promises"
import { join } from "node:path"
import { execa } from "execa"
import { config } from "./shared"

export const isValidPackageName = (projectName: string) => {
  return /^(?:@[\d*a-z~-][\d*._a-z~-]*\/)?[\da-z~-][\d._a-z~-]*$/.test(projectName)
}

export const formatTargetDirectory = (targetDirectory: string | undefined) => {
  return targetDirectory?.trim().replace(/\/+$/g, "")
}

type DefinitelyNotAny = Parameters<typeof JSON.stringify>[0]
export const writeProjectFile = async (filePath: string, content: DefinitelyNotAny) => {
  const projectFilePath = join(config.targetDirectory, filePath)

  let stringContent: string = content
  if (typeof content !== "string") stringContent = JSON.stringify(content, undefined, 2)

  await writeFile(projectFilePath, stringContent)
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export const forwardedExeca = (command: string, args: string[]) => {
  return execa(command, args, { stdio: "inherit", cwd: config.targetDirectory })
}
