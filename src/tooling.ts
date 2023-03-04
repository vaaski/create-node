import { devDependencies, packageJsonScripts } from "./config"
import { writeProjectFile } from "./util"

const defaultPrettierConfig = {
  semi: false,
  trailingComma: "es5",
  arrowParens: "avoid",
  printWidth: 90,
  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  endOfLine: "auto",
}
export const addPrettier = async () => {
  devDependencies.push("prettier")

  packageJsonScripts.format = "prettier --write ."

  await writeProjectFile(".prettierrc", defaultPrettierConfig)
}

const defaultEslintConfig = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "unicorn"],
  ignorePatterns: ["node_modules/**", "dist/**"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/consistent-type-imports": "error",
    semi: ["error", "never"],
    "unicorn/prefer-ternary": "off",
  },
}
export const addEslint = async () => {
  devDependencies.push(
    "eslint",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint-config-prettier",
    "eslint-plugin-prettier",
    "eslint-plugin-unicorn"
  )

  packageJsonScripts.lint = "eslint ."

  await writeProjectFile(".eslintrc", defaultEslintConfig)
}
