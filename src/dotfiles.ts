import { copy } from "fs-jetpack"
import { join } from "path"

export default (): void => {
  const toCopy = [".prettierrc", ".eslintrc.json", "license.md", "tsconfig.json"]

  for (const file of toCopy) {
    copy(join(__dirname, "../", file), file)
  }
}
