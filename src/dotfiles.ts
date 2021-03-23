import { copy } from "fs-jetpack"
import { join } from "path"

// TODO ecosystem.config.js
export default async (): Promise<void> => {
  const toCopy = [".prettierrc", ".eslintrc.json", "license.md", "tsconfig.json"]

  for (const file of toCopy) {
    copy(join(__dirname, "../", file), file)
  }
}
