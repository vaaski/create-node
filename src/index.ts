import inquirer from "inquirer"
import { z } from "zod"

const questionSchema = z.object({
  name: z
    .string()
    .min(3, "must be at least 3 characters")
    .regex(/^[\d_a-z-]+$/, {
      message: "must be lowercase, numbers, dashes, and underscores",
    }),
})

type SchemaShape = typeof questionSchema.shape
const promptValidator = <T extends keyof SchemaShape>(validator: SchemaShape[T]) => {
  return (message: string) => {
    const result = validator.safeParse(message)
    if (result.success) return true

    const { errors } = result.error
    const mapped = errors.map(error => error.message).join(",\n")
    return `error parsing input:\n${mapped}`
  }
}

const prompt = await inquirer.prompt([
  {
    name: "name",
    message: "project name:",
    validate: promptValidator(questionSchema.shape.name),
  },
])

console.log("passed", prompt)
