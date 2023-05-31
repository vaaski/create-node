import type { Options } from "execa"

import { readFile, rm, stat, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { execa } from "execa"
import { config } from "./config"
import JSON5 from "json5"

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

export const forwardedExeca = (
  command: string,
  // eslint-disable-next-line unicorn/prevent-abbreviations
  args: string[],
  options?: Options
) => {
  return execa(command, args, {
    stdio: "inherit",
    cwd: config.targetDirectory,
    ...options,
  })
}

export const openCode = async () => {
  try {
    await forwardedExeca("code", [config.targetDirectory])
  }
  catch {
    // ignore
  }
}

export const exists = async (filePath: string) => {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

export const onCancel = async () => {
  console.log("Operation cancelled")
  await rm(config.targetDirectory, { recursive: true, force: true })

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0)
}

export async function readProjectFile<T = unknown>(
  filePath: string,
  type?: "json"
): Promise<T | null>
export async function readProjectFile(filePath: string, type?: "text"): Promise<string>
export async function readProjectFile(filePath: string, type: "json" | "text" = "json") {
  const completePath = join(config.targetDirectory, filePath)
  const fileBuffer = await readFile(completePath)
  const fileString = fileBuffer.toString()

  if (type === "json") return JSON5.parse(fileString)
  if (type === "text") return fileString

  throw new Error("Invalid type")
}
