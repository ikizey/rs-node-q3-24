import { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server/index.js";

const HTTP_PORT = 8181;
const WS_PORT = 3000;

const wsServer = new WebSocketServer({ port: WS_PORT }, () => {
  console.log(`Websocket server started on the ${WS_PORT} port!`);
  httpServer.listen(HTTP_PORT, () => {
    console.log(`Static http server started on the ${HTTP_PORT} port!`);
  });
});

wsServer.on("connection", (ws) => {
  ws.on("message", (message, isBinary) => {
    const messageString = message.toString();
    const messageObject = JSON.parse(messageString);
    const messageData = JSON.parse(messageObject.data);
    if (messageObject.type === "reg") {
      const answer = {
        type: "reg",
        data: JSON.stringify({
          name: messageData.name,
          index: 0,
          error: false,
          errorText: "",
        }),
      };
      const answerString = JSON.stringify(answer);
      const answerBuffer = Buffer.from(answerString);
      ws.send(answerBuffer, { binary: isBinary });
    }
  });
});

process.on("SIGINT", () => {
  httpServer.close(() => {
    console.log("Http server closed");
    wsServer.close(() => {
      console.log("Websocket server closed");
      process.exit(0);
    });
  });
});
