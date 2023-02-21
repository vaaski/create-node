import type { Question } from "inquirer"
import inquirer from "inquirer"
import type { z } from "zod"

type SupportedPromptTypes = "input" | "number"
// type PromptQuestion<Keys> = Question & { name: Keys, type?: SupportedPromptTypes }

type PromptQuestionObject<Keys extends string | number | symbol> = {
  [K in Keys]: Question & { type?: SupportedPromptTypes }
}

export const zodPrompt = async <RawShape extends z.ZodRawShape>(
  questionSchema: z.ZodObject<RawShape>,
  prompts: PromptQuestionObject<keyof RawShape>
) => {
  type QuestionKeys = keyof RawShape
  type SpecificQuestion<K extends QuestionKeys> = Question & { name: K }

  const promptValidator = <K extends QuestionKeys>(validator: RawShape[K]) => {
    return (message: string) => {
      const result = validator.safeParse(message)
      if (result.success) return true

      const { errors } = result.error
      const mapped = errors.map(error => error.message).join(",\n")
      return `error parsing input:\n${mapped}`
    }
  }

  const autoValidate = <K extends QuestionKeys>(prompt: SpecificQuestion<K>) => {
    prompt.validate = promptValidator(questionSchema.shape[prompt.name])
    return prompt
  }

  const entries = Object.entries(prompts)
  const withValidation = entries.map(([key, prompt]) => {
    return autoValidate({ ...prompt, name: key })
  })

  const prompt = await inquirer.prompt(withValidation)
  return questionSchema.parse(prompt)
}
