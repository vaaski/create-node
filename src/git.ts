import execa from "execa"

export default async (): Promise<void> => {
  try {
    await execa("git", ["init"])
    await execa("git", ["add", "."])
    await execa("git", ["commit", "-m", "init"])
    await execa("git", ["branch", "-M", "main"])
  } catch (err) {
    console.log(err.shortMessage)
  }
}
