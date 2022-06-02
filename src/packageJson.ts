import { Input, prompt } from "enquirer"

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
  packageJson.license = "MIT"

  const { CREATE_NODE_USERNAME, CREATE_NODE_EMAIL } = process.env

  if (CREATE_NODE_USERNAME && CREATE_NODE_EMAIL)
    packageJson.author = `${CREATE_NODE_USERNAME} <${CREATE_NODE_EMAIL}>`
  else
    packageJson.author = await new Input({
      message: "author: ",
    }).run()

  return packageJson
}
