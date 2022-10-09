import express from 'express'
import jsonql from './jsonql'
import websocketHandler from './websocket'

const print = console.log
const app = express()
const port = process.env.PORT ?? 5000

app.use(express.json())

app.use(express.static('public'))

app.post('/jql', (req, res) => {
  void jsonql(req, res)
})

app.get('/', (_, res) => {
  res.status(200).send('Stay awhile and listen!')
})

const httpserver = app.listen(port, () => print(`Running on port ${port}`))

websocketHandler(httpserver)
