#!/usr/bin/env node
import { MultiSelect } from "enquirer"
import { copy, cwd, dir, read, write } from "fs-jetpack"
import npmInit from "./packageJson"
import dotfiles from "./dotfiles"
import test, { testDependencies } from "./test"
import { join, parse } from "path"
import git from "./git"
import execa from "execa"
import ora from "ora"

!(async () => {
  console.clear()

  const folderName = parse(cwd()).base
  let packageJson = read("package.json", "json")
  const devDependencies = [
    "@types/node",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint",
    "eslint-config-prettier",
    "eslint-plugin-ava",
    "eslint-plugin-prettier",
    "rimraf",
    "ts-node",
    "typescript",
  ]
  const gitIgnore = ["node_modules", "lib"]

  if (!packageJson) packageJson = await npmInit(folderName)

  if (!packageJson.scripts) packageJson.scripts = {}
  packageJson.scripts.build = "rimraf lib && tsc"
  packageJson.scripts.prepare = "npm run build"
  packageJson.scripts.prepublishOnly = "npm test"
  packageJson.scripts.dev = "ts-node src"

  packageJson.files = ["lib/**/*"]

  const addons = ((await new MultiSelect({
    type: "multiselect",
    name: "addons",
    message: "select addons",
    // @ts-expect-error idk why
    initial: ["test", "commitizen"],
    choices: [
      {
        name: "dotenv",
        value: "dotenv",
      },
      {
        name: "nodemon",
        value: "nodemon",
      },
      {
        name: "test",
        value: "test",
      },
      {
        name: "commitizen",
        value: "commitizen",
      },
    ],
  }).run()) as unknown) as string[]

  if (addons.includes("test")) {
    devDependencies.push(...testDependencies)
    const testConfig = await test(addons.includes("dotenv"))
    packageJson = { ...packageJson, ...testConfig }
    gitIgnore.push(".nyc_output", "coverage")
    packageJson.scripts.test = "nyc ava"
    packageJson.scripts.coverage = "live-server coverage/lcov-report"
  }

  if (addons.includes("commitizen")) {
    devDependencies.push("commitizen@4.2.2")
    packageJson.scripts.commit = "cz -S"
  }

  if (addons.includes("dotenv")) {
    devDependencies.push("dotenv")
    write(".env", "")
    write(".env.example", "")
  }

  if (addons.includes("nodemon")) {
    devDependencies.push("nodemon")
    packageJson.scripts.dev = "nodemon"
    copy(join(__dirname, "../nodemon.json"), "nodemon.json")
  }

  write("package.json", packageJson)
  write(".gitignore", gitIgnore.join("\n"))

  write("src/index.ts", 'console.log("works!")')
  dir("tests")
  dir("types")
  ora("adding default files/folders").succeed()

  dotfiles()
  ora("adding dotfiles").succeed()

  const spinner = ora("installing dependencies").start()
  await execa("npm", ["i", "-D", ...devDependencies])
  spinner.succeed()

  git(folderName)
  ora("initializing git").succeed()

  await execa("code", ["."])
  ora("opening vscode").succeed()
})()
