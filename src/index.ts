#! /usr/bin/env node

import prompts from "prompts"

const response = await prompts([

  {
    type: "multiselect",
    name: "multicolor",
    message: "Pick colors",
    instructions: false,
    choices: [
      { title: "Red", description: "This option has a description.", value: "#ff0000" },
      { title: "Green", value: "#00ff00" },
      { title: "Yellow", value: "#ffff00", disabled: true },
      { title: "Blue", value: "#0000ff" },
    ],
  },
])

console.log(response)
