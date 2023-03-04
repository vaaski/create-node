import type { TsConfigJson } from "type-fest"

import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { config } from "./config"
import { readProjectFile } from "./util"

export const makeTypesFolder = async () => {
  const tsconfig = await readProjectFile<TsConfigJson>("tsconfig.json")
  if (!tsconfig) throw new Error("Invalid tsconfig.json")

  const typesPath = join(config.targetDirectory, "types")
  await mkdir(typesPath, { recursive: true })

  if (!Array.isArray(tsconfig.include)) {
    tsconfig.include = []
  }

  tsconfig.include.push("types/**/*.d.ts")
}
