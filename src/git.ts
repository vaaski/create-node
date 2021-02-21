import { Input } from "enquirer"
import execa from "execa"

export default async (name: string): Promise<void> => {
  const { CREATE_NODE_USERNAME } = process.env

  await execa("git", ["init"])
  await execa("git", ["add", "."])
  await execa("git", ["commit", "-m", "init"])
  await execa("git", ["branch", "-M", "main"])

  let repoURL = ""
  if (CREATE_NODE_USERNAME) repoURL = `https://github.com/${CREATE_NODE_USERNAME}/${name}.git`
  else {
    repoURL = await new Input({ message: "repo url: " }).run()
  }

  if (repoURL) await execa("git", ["remote", "add", "origin", repoURL])
}
