import { read, write } from "fs-jetpack"
import { join } from "path"
import { cp } from "./util"

export default async (name: string, dotenv: boolean): Promise<void> => {
  const toCopy = [".prettierrc", ".eslintrc.json", "license.md", "tsconfig.json"]

  for (const file of toCopy) {
    cp("../" + file, file)
  }

  let ecosystemConfig = read(
    join(__dirname, dotenv ? "../ecosystem-dotenv.config.js" : "../ecosystem.config.js")
  )
  if (!ecosystemConfig) throw new Error("no ecosystem file found")
  ecosystemConfig = ecosystemConfig.replace("{{APP_NAME}}", name)
  write("ecosystem.config.js", ecosystemConfig)
}
