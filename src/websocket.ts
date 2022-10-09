// import WebSocket from 'ws'
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http'
import url from 'url'


var CLIENTS = new Map<string, WebSocket.WebSocket>();

const print = console.log


const broadcast = (message: string) => {
  print(`broadcasting: ${message}`);
  for (var key of CLIENTS.keys()) {
    // print(key)
    CLIENTS.get(key)?.send(message);
  }
}


const processMessage = (wsconn: WebSocket.WebSocket, message: WebSocket.RawData) => {
  const msgString = message.toString();
  const wsdata = JSON.parse(msgString)
  if (wsdata.type === 'position') {
    broadcast(msgString)
  }
}

const websocketHandler = (expressServer: http.Server): void => {
  //  const websocketServer = new WebSocket.Server({ server: expressServer })
  const websocketServer = new WebSocketServer({ noServer: true });

  // HTTP upgrade handler
  expressServer.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws') {
      websocketServer.handleUpgrade(request, socket, head, (websocket) => {
        websocketServer.emit('connection', websocket, request)
      })
    }
  })

  websocketServer.on('connection', (websocketConnection, connectionRequest) => {
    // const [_path, params] = connectionRequest?.url?.split("?");
    // const connectionParams = queryString.parse(params);

    // NOTE: connectParams are not used here but good to understand how to get
    // to them if you need to pass data with the connection to identify it (e.g., a userId).
    // console.log(connectionParams);

    const id = (Math.random()*100000).toString();
    CLIENTS.set(id, websocketConnection);

    websocketConnection.send('Welcome to my crib')

    websocketConnection.on('message', (message) => {
      // const parsedMessage = JSON.parse(message.toString())
      print(`msg: ${message}`)
      // websocketConnection.send(JSON.stringify({ message: 'There be gold in them thar hills.' }))
      processMessage(websocketConnection, message)
    })
  })
}

export default websocketHandler
