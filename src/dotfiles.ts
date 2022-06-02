import { read, write } from "fs-jetpack"
import { join } from "path"
import { cp } from "./util"

export default async (name: string, dotenv: boolean): Promise<void> => {
  const toCopy = [".prettierrc", ".eslintrc.json", "license.md", "tsconfig.json"]

  for (const file of toCopy) {
    cp("../" + file, file)
  }

  let pm2Config = read(
    join(__dirname, dotenv ? "../pm2-dotenv.config.js" : "../pm2.config.js")
  )
  if (!pm2Config) throw new Error("no pm2 file found")
  pm2Config = pm2Config.replace("{{APP_NAME}}", name)
  write("pm2.config.js", pm2Config)
}
