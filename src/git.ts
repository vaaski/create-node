import execa from "execa"

export default async (): Promise<void> => {
  await execa("git", ["init"])
  await execa("git", ["add", "."])
  await execa("git", ["commit", "-m", "init"])
  await execa("git", ["branch", "-M", "main"])
}
