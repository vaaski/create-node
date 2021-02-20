import execa from "execa"

export default async (name: string): Promise<void> => {
  await execa("git", ["init"])
  await execa("git", ["add", "."])
  await execa("git", ["commit", "-m", "init"])
  await execa("git", ["branch", "-M", "main"])
  await execa("git", ["remote", "add", "origin", `https://github.com/vaaski/${name}.git`])
}
