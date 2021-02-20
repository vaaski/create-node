import { copy } from "fs-jetpack"
import { join } from "path"

export default (): void => {
  // cspell:ignore prettierrc

  const toCopy = [".prettierrc", ".eslintrc.json", "license", "tsconfig.json"]

  for (const file of toCopy) {
    copy(join(__dirname, "../", file), file)
  }
}
