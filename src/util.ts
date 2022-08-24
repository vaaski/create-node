import jet from "fs-jetpack"
const { copy, write } = jet
import { dirname, join } from "path"
import { fileURLToPath } from "url"

export const __dirname = dirname(fileURLToPath(import.meta.url))
export const emptyFolder = (path: string): void => write(join(path, ".gitkeep"), "")

export const cp = (a: string, b: string, overwrite = false): void =>
  copy(join(__dirname, a), join(b), { overwrite })
