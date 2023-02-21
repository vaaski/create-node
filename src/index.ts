#! /usr/bin/env node

// strongly inspired by
// https://github.com/vitejs/vite/blob/main/packages/create-vite/src/index.ts

import path from "node:path"
import prompts from "prompts"
import minimist from "minimist"

import { formatTargetDirectory } from "./util"

/*
 * todo:
 * - add tsx and backend structure
 * - build with unbuild
 * - use colors
 * - add options for
 *   - eslint
 *   - prettier
 *   - jest/ava/vitest idk
 *   - nodemon
 *   - pm2
 *   - socket.io
 *     - maybe add socket boilerplate
 *   - vite
 *     - shared folder
 *   - unbuild
 *   - dotenv
 *   - separate types folder
 */

const argv = minimist(process.argv.slice(2))
const cwd = process.cwd()

const argumentTargetDirectory = formatTargetDirectory(argv._[0])
let targetDirectory = argumentTargetDirectory

const getProjectName = () => {
  return targetDirectory === "." ? path.basename(path.resolve()) : targetDirectory
}
const getFullTargetPath = () => {
  return path.join(cwd, targetDirectory ?? ".")
}

await prompts([
  {
    type: argumentTargetDirectory ? undefined : "text",
    name: "projectName",
    message: "Project name:",
    validate: (name: string) => name.length > 0 || "Project name is required",
    onState: state => {
      targetDirectory = formatTargetDirectory(state.value) || ""
    },
  },
])

console.log(targetDirectory, getProjectName(), getFullTargetPath())
