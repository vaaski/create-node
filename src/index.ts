#! /usr/bin/env node

// strongly inspired by
// https://github.com/vitejs/vite/blob/main/packages/create-vite/src/index.ts

import path from "node:path"
import prompts from "prompts"
import minimist from "minimist"

import { formatTargetDirectory } from "./util"
import { mkdir } from "node:fs/promises"
import { addNodemon, addPm2, addUnbuild, createBackend } from "./backend"
import {
  initializeGit,
  installDependencies,
  writeGitignore,
  writePackageJson,
  writeTsconfig,
} from "./base"
import { config } from "./shared"
import { addEslint, addPrettier } from "./tooling"
import { askForFrontend } from "./frontend"

/*
 * todo:
 * - add tsx and backend structure
 * - build with unbuild
 * - use colors
 * - add options for
 *   - debug
 *   - eslint
 *   - prettier
 *   - jest/ava/vitest idk
 *   - nodemon
 *   - pm2 (account for unbuild)
 *   - socket.io
 *     - maybe add socket boilerplate
 *   - vite
 *     - shared utils/folder
 *     - css reset
 *     - sass
 *     - concurrently
 *   - unbuild
 *   - dotenv
 *   - separate types folder
 *   - initialize git
 */

const argv = minimist(process.argv.slice(2))
const cwd = process.cwd()
config.frontendTemplate = argv.template || argv.t || ""

const argumentTargetDirectory = formatTargetDirectory(argv._[0])
let relativeTargetDirectory = argumentTargetDirectory

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

  await mkdir(config.targetDirectory, { recursive: true })

  await askForFrontend()

  await createBackend()

  await addNodemon()
  await addUnbuild()
  await addPrettier()
  await addEslint()
  await addPm2()

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
