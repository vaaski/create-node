import { write } from "fs-jetpack"
import { join } from "path"

export const emptyFolder = (path: string): void => write(join(path, ".gitkeep"), "")
