import { prompt } from "enquirer"

export default async (name: string): Promise<Record<string, any>> => {
  const packageJson = await prompt([
    {
      type: "input",
      name: "name",
      message: "package name: ",
      initial: name,
    },
    {
      type: "input",
      name: "description",
      message: "description: ",
      initial: name,
    },
    {
      type: "list",
      name: "keywords",
      message: "keywords: ",
    },
  ])

  packageJson.version = "0.0.1"
  packageJson.main = "lib/index.js"
  packageJson.author = "vaaski <admin@vaa.ski>"
  packageJson.license = "MIT"

  return packageJson
}
