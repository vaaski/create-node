#! /usr/bin/env node

import path from "node:path"
import prompts from "prompts"
import minimist from "minimist"

import { formatTargetDirectory } from "./util"

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

const response = await prompts([
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
