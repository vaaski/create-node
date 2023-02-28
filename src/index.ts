#! /usr/bin/env node

// strongly inspired by
// https://github.com/vitejs/vite/blob/main/packages/create-vite/src/index.ts

import path from "node:path"
import prompts from "prompts"
import minimist from "minimist"

import { formatTargetDirectory } from "./util"
import { mkdir } from "node:fs/promises"

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
 *   - pm2
 *   - socket.io
 *     - maybe add socket boilerplate
 *   - vite
 *     - shared utils/folder
 *   - unbuild
 *   - dotenv
 *   - separate types folder
 */

const argv = minimist(process.argv.slice(2))
const cwd = process.cwd()

const argumentTargetDirectory = formatTargetDirectory(argv._[0])
let relativeTargetDirectory = argumentTargetDirectory

// const getProjectName = () => {
//   return relativeTargetDirectory === "."
//     ? path.basename(path.resolve())
//     : relativeTargetDirectory
// }

// const getFullTargetPath = () => {
//   return path.join(cwd, relativeTargetDirectory ?? ".")
// }

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

  const fullTargetPath = path.join(cwd, relativeTargetDirectory ?? ".")

  // console.log(relativeTargetDirectory, getProjectName(), fullTargetPath)

  await mkdir(fullTargetPath, { recursive: true })

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
