import { Toggle } from "enquirer"
import { write } from "fs-jetpack"

export const testDependencies = ["ava", "nyc", "live-server"]

export default async (dotenv = false): Promise<Record<string, any>> => {
  const threshold = await new Toggle({
    message: "force 100% coverage?",
    enabled: "yes",
    disabled: "no",
  }).run()

  // cspell:ignore nycrc lcov
  let nycrc: Record<string, any> = {
    reporter: ["lcov", "text-summary"],
  }

  const ava = {
    extensions: ["ts"],
    files: ["tests/**/*"],
    require: ["ts-node/register"],
  }

  if (dotenv) ava.require.push("dotenv/config")

  if (threshold) {
    nycrc = {
      ...nycrc,
      "check-coverage": true,
      branches: 100,
      lines: 100,
      functions: 100,
      statements: 100,
    }
  }

  write(".nycrc.json", nycrc)

  return { ava }
}
