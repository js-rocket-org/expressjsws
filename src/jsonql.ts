/*
curl -H "Content-Type: application/json" -d '{"version":{},"calc":{"in":6},"nope":{},"wronginput":"sorry","calc2":{"in":3}}' "http://localhost:5000/jql"
curl -H "Content-Type: application/json" -d '{}' "http://localhost:5000/jql"
*/

import express from 'express'

interface calcInputs {
  in: number
}

const sleep = async (ms: number): Promise<void> => {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

const handlers = {
  version: (): object => {
    return { version: '1.1' }
  },
  calc: async (inputs: calcInputs): Promise<object> => {
    await sleep(0)
    return { calc: inputs.in * 2 }
  },
  calc2: async (inputs: calcInputs): Promise<object> => {
    const content = await new Promise<number>((resolve) => setTimeout(() => resolve(10000), 2))
    return { calc2: inputs.in + content }
  },
  wronginput: async (): Promise<object> => {
    await sleep(0)
    return { result: '1.1' }
  }
}

const jsonql = async (req: express.Request, res: express.Response): Promise<void> => {
  const reqKeys = Object.keys(req.body)
  if (reqKeys.length === 0) {
    res.status(400).send('Bad request')
    return
  }

  const requests = []
  for (const key of reqKeys) {
    // @ts-expect-error
    const keyFunction = handlers[key]
    if (typeof keyFunction === 'function') {
      const inputs = req.body[key]
      const result = typeof inputs !== 'object' ? { [key]: 'invalid input' } : keyFunction(inputs)
      requests.push(result)
    } else {
      requests.push({ [key]: 'unknown function' })
    }
  }

  const result = await Promise.all(requests)

  // print(result)
  res.status(200).send(JSON.stringify(result))
}

export default jsonql
