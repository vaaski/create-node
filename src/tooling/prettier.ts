import { devDependencies, packageJsonScripts } from "../config"
import { writeProjectFile } from "../util"

const defaultPrettierConfig = {
  semi: false,
  trailingComma: "es5",
  arrowParens: "avoid",
  printWidth: 90,
  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  endOfLine: "auto",
}
export const addPrettier = async () => {
  devDependencies.push("prettier")

  packageJsonScripts.format = "prettier --write ."

  await writeProjectFile(".prettierrc", defaultPrettierConfig)
}
