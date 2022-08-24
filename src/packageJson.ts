import chalk from "chalk"
import enq from "enquirer"
const { Input, prompt } = enq

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

  if (CREATE_NODE_USERNAME && CREATE_NODE_EMAIL) {
    packageJson.author = `${CREATE_NODE_USERNAME} <${CREATE_NODE_EMAIL}>`
  } else {
    console.log(chalk.grey(`set CREATE_NODE_USERNAME and CREATE_NODE_EMAIL to skip this`))

    packageJson.author = await new Input({
      message: "author: ",
    }).run()
  }

  return packageJson
}
