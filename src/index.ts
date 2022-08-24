#!/usr/bin/env node
import enq from "enquirer"
const { MultiSelect } = enq
import jet from "fs-jetpack"
const { cwd, read, write } = jet
import npmInit from "./packageJson.js"
import dotfiles from "./dotfiles.js"
import test, { testDependencies } from "./test.js"
import git from "./git.js"
import vue from "./vue.js"
import { emptyFolder, __dirname } from "./util.js"

import { join, parse } from "path"
import execa from "execa"
import ora from "ora"
import chalk from "chalk"

!(async () => {
  const { version } = read(join(__dirname, "../package.json"), "json")
  console.clear()
  console.log(chalk.grey(`@vaaski/create-node v${version}\n`))
  console.log(chalk.grey(`project will be at ${parse(cwd()).dir}`))

  const folderName = parse(cwd()).base
  let packageJson = read("package.json", "json")
  const devDependencies = [
    "@types/debug",
    "@types/node@16",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint",
    "eslint-config-prettier",
    "eslint-plugin-prettier",
    "eslint-plugin-vue",
    "rimraf",
    "ts-node",
    "typescript",
    "prettier",
  ]
  const dependencies: string[] = ["debug"]
  const gitIgnore = ["node_modules", "dist", ".DS_Store", "**/*.local", ".env"]

  if (!packageJson) packageJson = await npmInit(folderName)

  if (!packageJson.scripts) packageJson.scripts = {}
  packageJson.scripts.start = "node dist"
  packageJson.scripts.build = "rimraf dist && tsc"
  packageJson.scripts.prepare = "npm run build"
  packageJson.scripts.dev = "ts-node src"
  packageJson.scripts.format =
    "prettier -w **/*.{vue,ts,js,json} --no-error-on-unmatched-pattern"
  packageJson.type = "module"

  packageJson.files = ["dist/**/*"]

  const addons = (await new MultiSelect({
    type: "multiselect",
    name: "addons",
    message: "select addons",
    // @ts-expect-error it does actually work this way, i think the types are weird
    initial: ["test", "nodemon"],
    choices: [
      {
        name: "dotenv",
        value: "dotenv",
      },
      {
        name: "vue 3",
        value: "vue 3",
      },
      {
        name: "nodemon",
        value: "nodemon",
      },
      {
        name: "test",
        value: "test",
      },
    ],
  }).run()) as unknown as string[]

  if (addons.includes("test")) {
    devDependencies.push(...testDependencies)
    const testConfig = await test(addons.includes("dotenv"))
    packageJson = { ...packageJson, ...testConfig }
    gitIgnore.push(".nyc_output", "coverage")
    packageJson.scripts.test = "nyc ava"
    packageJson.scripts.coverage = "live-server coverage/lcov-report"
    packageJson.scripts.prepublishOnly = "npm test"
    emptyFolder("tests")
  }

  if (addons.includes("dotenv")) {
    devDependencies.push("dotenv")
    write(".env", "")
    write(".env.example", "")
    packageJson.scripts.start = "node -r dotenv/config dist"
  }

  if (addons.includes("nodemon")) {
    const nodemon = read(join(__dirname, "../nodemon.json"), "json")

    if (addons.includes("dotenv")) {
      nodemon.exec = "node --loader ts-node/esm -r dotenv/config ./src/index.ts"
    }

    if (nodemon.env?.DEBUG) {
      nodemon.env.DEBUG = nodemon.env.DEBUG.replace("{{APP_NAME}}", packageJson.name)
    }

    write("nodemon.json", nodemon)
    devDependencies.push("nodemon")
    packageJson.scripts.dev = "nodemon"
  }

  write(
    "src/index.ts",
    `import debug from "debug"\nconst log = debug("${packageJson.name}")\n\nlog("works!")`
  )

  await dotfiles(packageJson.name, addons.includes("dotenv"))

  write("package.json", packageJson)
  write(".gitignore", gitIgnore.join("\n"))

  if (addons.includes("vue 3")) {
    const vueDeps = await vue(packageJson.name)
    dependencies.push(...vueDeps.dependencies)
    devDependencies.push(...vueDeps.devDependencies)
  }

  ora("adding dotfiles").succeed()

  emptyFolder("types")

  await execa("code", ["."])
  ora("opening vscode").succeed()

  const spinner = ora("installing dependencies").start()
  await execa("npm", ["i", "-D", ...devDependencies])
  if (dependencies.length) await execa("npm", ["i", ...dependencies])
  spinner.succeed()

  ora("formatting files").succeed()
  await execa("npm", ["run", "format"])

  git()
  ora("initializing git").succeed()
})()
