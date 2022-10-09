const print = console.log
const ID = (o) => document.getElementById(o);
var pageStatus, mycanvas, mycanvasContext, canvasRect, wsconn

const squareSize = 20;
const halfSquareSize = squareSize / 2


const sendPosition = (x, y) => {
  const wsdata = { type: 'position', x, y }
  if (wsconn) wsconn.send(JSON.stringify(wsdata))
}

// Drawing stuff
const getMousePos = (evt) => ({
  x: evt.clientX - canvasRect.left,
  y: evt.clientY - canvasRect.top
})

const clearCanvas = () => mycanvasContext.clearRect(0, 0, mycanvas.width, mycanvas.height);

const drawSquare = (x, y) => {
  const ctx = mycanvasContext

  ctx.beginPath();
  ctx.lineWidth = "6";
  ctx.strokeStyle = "red";
  ctx.rect(x, y, squareSize, squareSize);
  ctx.stroke();
}

const initCanvas = () => {
  mycanvas.addEventListener("click", function (event) {
    pageStatus.innerHTML = `X:${event.clientX}, Y:${event.clientY}`
    const mpos = getMousePos(event)
    clearCanvas()
    print(`You clicked at: ${mpos.x}, ${mpos.y}`)
  });

  mycanvas.addEventListener("mousemove", function (event) {
    pageStatus.innerHTML = `X:${event.clientX}, Y:${event.clientY}`

    const mpos = getMousePos(event)
    clearCanvas()
    drawSquare(mpos.x, mpos.y)
    sendPosition(mpos.x, mpos.y)
  });

}


// Ready function
(function () {
  mycanvas = ID('cnv1')
  pageStatus = ID('page_status')
  mycanvasContext = mycanvas.getContext("2d")
  mycanvas.width = mycanvas.clientWidth
  mycanvas.height = mycanvas.clientHeight
  canvasRect = mycanvas.getBoundingClientRect();
  // initCanvas()
})();


const processMessage = (messageString) => {
  var message = null
  try {
    message = JSON.parse(messageString)
  } catch {}
  if (message !== null && message.type === 'position') {
    // print(JSON.stringify(message))
    clearCanvas()
    drawSquare(message.x, message.y)
  }
}
// web socket stuff

if (window["WebSocket"]) {
  wsconn = new WebSocket('ws://localhost:5000/ws');
  if (wsconn) {
    wsconn.onopen = function (evt) {
      print("Connection opened")
    }
    wsconn.onclose = function (evt) {
      print('Connection Closed')
    };
    wsconn.onmessage = function (evt) {
      var messages = evt.data.split('\n');
      for (var i = 0; i < messages.length; i++) {
        print('msg: ' + messages[i]);
        processMessage(messages[i])
      }
    }
  }
}
