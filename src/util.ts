import { copy, write } from "fs-jetpack"
import { join } from "path"

export const emptyFolder = (path: string): void => write(join(path, ".gitkeep"), "")

export const cp = (a: string, b: string, overwrite = false): void =>
  copy(join(__dirname, a), join(b), { overwrite })
