#!/usr/bin/env node
import { MultiSelect } from "enquirer"
import { cwd, dir, read, write } from "fs-jetpack"
import npmInit from "./packageJson"
import dotfiles from "./dotfiles"
import test, { testDependencies } from "./test"
import { join, parse } from "path"
import git from "./git"
import execa from "execa"
import ora from "ora"
import chalk from "chalk"

!(async () => {
  const { version } = read(join(__dirname, "../package.json"), "json")
  console.clear()
  console.log(chalk.grey(`@vaaski/create-node v${version}\n`))

  const folderName = parse(cwd()).base
  let packageJson = read("package.json", "json")
  const devDependencies = [
    "@types/node",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint",
    "eslint-config-prettier",
    "eslint-plugin-prettier",
    "rimraf",
    "ts-node",
    "typescript",
    "prettier",
  ]
  const gitIgnore = ["node_modules", "lib"]

  if (!packageJson) packageJson = await npmInit(folderName)

  if (!packageJson.scripts) packageJson.scripts = {}
  packageJson.scripts.build = "rimraf lib && tsc"
  packageJson.scripts.prepare = "npm run build"
  packageJson.scripts.dev = "ts-node src"

  packageJson.files = ["lib/**/*"]

  const addons = ((await new MultiSelect({
    type: "multiselect",
    name: "addons",
    message: "select addons",
    // @ts-expect-error it does actually work this way, i think the types are weird
    initial: ["test", "commitizen", "nodemon"],
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
    packageJson.scripts.prepublishOnly = "npm test"
  }

  if (addons.includes("commitizen")) {
    devDependencies.push("commitizen@4.2.2")
    packageJson.scripts.commit = "cz -S"
  }

  if (addons.includes("dotenv")) {
    devDependencies.push("dotenv")
    write(".env", "")
    write(".env.example", "")
    gitIgnore.push(".env")
  }

  if (addons.includes("nodemon")) {
    const nodemon = read(join(__dirname, "../nodemon.json"), "json")
    if (addons.includes("dotenv")) nodemon.exec = "npx ts-node -r dotenv/config ./src/index.ts"

    write("nodemon.json", nodemon)
    devDependencies.push("nodemon")
    packageJson.scripts.dev = "nodemon"
  }

  write("package.json", packageJson)
  write(".gitignore", gitIgnore.join("\n"))

  write("src/index.ts", 'console.log("works!")')
  dir("tests")
  dir("types")
  ora("adding default files/folders").succeed()

  dotfiles()
  ora("adding dotfiles").succeed()

  await execa("code", ["."])
  ora("opening vscode").succeed()

  const spinner = ora("installing dependencies").start()
  await execa("npm", ["i", "-D", ...devDependencies])
  spinner.succeed()

  git()
  ora("initializing git").succeed()
})()
