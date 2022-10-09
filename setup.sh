#!/bin/sh
# script to setup project in a blank folder after
yarn init -y

yarn add express ws
yarn add --dev esbuild typescript @types/node @types/express @types/ws \
eslint @typescript-eslint/eslint-plugin eslint-config-standard-with-typescript \
eslint-plugin-promise eslint-plugin-import eslint-plugin-n \
prettier eslint-config-prettier eslint-plugin-prettier

# ./node_modules/.bin/tsc --init
# ./node_modules/.bin/eslint --init

mkdir -p src

if [ ! -f "./src/index.ts" ]; then
cat <<'END_FILE' > ./src/index.ts
import express from 'express'

const app = express()
const port = 5000

app.get('/', (_, res) => {
  res.status(200).send("Hello world")
})

app.listen(port, () => console.log(`Running on port ${port}`))
END_FILE
fi
