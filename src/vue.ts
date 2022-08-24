import enq from "enquirer"
const { Toggle } = enq
import jet from "fs-jetpack"
const { read, rename, write } = jet
import { join } from "path"
import { cp, emptyFolder, __dirname } from "./util.js"

interface ReturnDependencies {
  dependencies: string[]
  devDependencies: string[]
}

export default async (name: string): Promise<ReturnDependencies> => {
  const dependencies = {
    devDependencies: [
      "@vitejs/plugin-vue",
      "@vue/compiler-sfc",
      "typescript",
      "vite",
      "vue-tsc",
    ],
    dependencies: ["vue@3"],
  }

  const windi = await new Toggle({
    message: "add tailwind (windicss)?",
    enabled: "yes",
    disabled: "no",
    // @ts-expect-error the types are very weird for enquirer
    initial: true,
  }).run()

  const router = await new Toggle({
    message: "add vue-router?",
    enabled: "yes",
    disabled: "no",
    // @ts-expect-error the types are very weird for enquirer
    initial: true,
  }).run()

  // changes to backend
  {
    rename("src", "backend")
    const backendTSconfig = read("tsconfig.json", "json")
    backendTSconfig.include = ["backend"]
    write("tsconfig.backend.json", backendTSconfig)
    cp("../vue/tsconfig.json", "tsconfig.json", true)
    cp("../vue/.eslintrc.json", ".eslintrc.json", true)

    const packageJson = read("package.json", "json")

    packageJson.scripts["back:build"] = packageJson.scripts.build + " -p tsconfig.backend.json"
    packageJson.scripts["back:dev"] = packageJson.scripts.dev
    packageJson.scripts["front:dev"] = "vite --port 8080"
    packageJson.scripts["front:build"] = "vue-tsc --noEmit && vite build"

    delete packageJson.scripts.build
    delete packageJson.scripts.dev
    delete packageJson.scripts.prepare
    delete packageJson.scripts.prepublishOnly

    write("package.json", packageJson)

    const nodemonConfig = read("nodemon.json", "json")
    if (nodemonConfig) {
      nodemonConfig.watch = ["backend", "types"]
      nodemonConfig.exec = "node --loader ts-node/esm ./backend/index.ts"
      write("nodemon.json", nodemonConfig)
    }
  }

  const indexHTML = read(join(__dirname, "../vue/index.html"))
  if (!indexHTML) throw new Error("index.html missing")
  write("index.html", indexHTML.replace("{{APP_NAME}}", name))
  emptyFolder("public")

  // create main.ts
  if (router && !windi) {
    cp("../vue/main-router.ts", "src/main.ts")
  } else if (!router && windi) {
    cp("../vue/main-windi.ts", "src/main.ts")
  } else if (router && windi) {
    cp("../vue/main-windi-router.ts", "src/main.ts")
  } else {
    cp("../vue/main.ts", "src/main.ts")
  }

  // add tailwind config
  if (windi) {
    dependencies.devDependencies.push("vite-plugin-windicss")
    cp("../vue/tailwind.config.ts", "tailwind.config.ts")
    cp("../vue/vite-windi.config.ts", "vite.config.ts")
  } else {
    cp("../vue/vite.config.ts", "vite.config.ts")
  }

  // create router
  if (router) {
    dependencies.dependencies.push("vue-router@4")

    cp("../vue/router.ts", "src/router.ts")
    cp("../vue/app-router.vue", "src/App.vue")
    cp("../vue/home.vue", "src/views/Home.vue")
  } else {
    cp("../vue/app.vue", "src/App.vue")
  }

  cp("../vue/netlify.toml", "netlify.toml")

  return dependencies
}
