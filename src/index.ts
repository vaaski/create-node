#! /usr/bin/env node

// strongly inspired by
// https://github.com/vitejs/vite/blob/main/packages/create-vite/src/index.ts

import path from "node:path"
import prompts from "prompts"

import { mkdir } from "node:fs/promises"
import { addNodemon, addPm2, addUnbuild, createBackend } from "./backend"
import {
  initializeGit,
  installDependencies,
  writeGitignore,
  writePackageJson,
  writeTsconfig
} from "./base"
import { askForFrontend } from "./frontend"
import { argv, config } from "./shared"
import { addEslint, addPrettier } from "./tooling"
import { formatTargetDirectory, onCancel } from "./util"

/*
 * todo:
 * - handle ctrl+c at any time
 * - preselect some modules
 * - use colors
 * - use a global config object for everything
 * - ask for description and put it in package.json and readme
 * - add license.md
 * - add readme.md
 * - add options for:
 *   - init commit
 *   - separate types folder
 *   - debug
 *   - jest/ava/vitest idk
 *   - socket.io
 *     - maybe add socket boilerplate
 *   - vite frontend
 *     - shared utils/folder
 *     - css reset
 *     - sass
 *     - concurrently build/dev
 *   - dotenv
 */

const cwd = process.cwd()

const argumentTargetDirectory = formatTargetDirectory(argv._[0])
let relativeTargetDirectory = argumentTargetDirectory

type OptionalModule = [executor: () => Promise<void>, preselected: boolean]
const optionalModules = new Map<string, OptionalModule>([
  ["nodemon", [addNodemon, true]],
  ["unbuild", [addUnbuild, true]],
  ["prettier", [addPrettier, true]],
  ["eslint", [addEslint, true]],
  ["pm2", [addPm2, true]],
])



const main = async () => {
  await prompts({
    type: argumentTargetDirectory ? undefined : "text",
    name: "projectName",
    message: "Project name:",
    validate: (name: string) => name.length > 0 || "Project name is required",
    onState: state => {
      relativeTargetDirectory = formatTargetDirectory(state.value) || ""
    },
  })

  const projectName =
    relativeTargetDirectory === "."
      ? path.basename(path.resolve())
      : relativeTargetDirectory

  if (!projectName) throw new Error("Project name is required")

  config.projectName = projectName
  config.targetDirectory = path.join(cwd, relativeTargetDirectory ?? ".")
  config.frontendTemplate = argv.template || argv.t || ""

  await mkdir(config.targetDirectory, { recursive: true })

  await askForFrontend()
  await createBackend()

  const moduleChoices: prompts.Choice[] = []

  for (const [key, [, preselected]] of optionalModules.entries()) {
    moduleChoices.push({
      title: key,
      value: key,

      // todo: fix terkelg/prompts#340
      disabled: argv[key] !== undefined,
      selected: argv[key] === true || preselected,
    })
  }

  const { modules } = await prompts(
    {
      type: "multiselect",
      name: "modules",
      message: "Select optional modules:",
      choices: moduleChoices,
      instructions: "\nArrow keys to navigate. Space to select. Enter to submit.",
    },
    { onCancel }
  )

  for (const moduleKey of modules) {
    const module = optionalModules.get(moduleKey)
    if (module) await module[0]()
  }

  await writePackageJson()
  await writeTsconfig()
  await writeGitignore()
  await initializeGit()
  await installDependencies()

  // const { overwrite } = await prompts({
  //   type: "confirm",
  //   name: "overwrite",
  //   initial: true,
  //   message: `Target directory ${relativeTargetDirectory} already exists. Continue?`,
  // })

  // console.log({ overwrite })
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main()
