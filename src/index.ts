#! /usr/bin/env node

import { z } from "zod"
import { zodPrompt } from "./prompt"

const questionSchema = z.object({
  // name: z
  //   .string()
  //   .min(3, "must be at least 3 characters")
  //   .regex(/^[\d_a-z-]+$/, {
  //     message: "must be lowercase, numbers, dashes, and underscores",
  //   }),
  someNumber: z.number().min(0, "must be positive"),
})

const prompt = await zodPrompt(questionSchema, [{ name: "someNumber", type: "number" }])

console.log("passed", prompt)
