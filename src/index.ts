import { WebSocketServer } from "ws";
import { httpServer } from "./http_server/index.js";
import { decodeMessage, encodeMessage } from "./utils/utils.js";
import { addUser, getWinners } from "./model/users.js";
import { addUserToRoom, createRoom, getPlayableRooms } from "./model/rooms.js";
import {
  addShips,
  attack,
  createGame,
  getCurrentPlayerIndex,
  getGame,
  getPlayerIndex,
  getPlayerShips,
  randomAttack,
  setCurrentPlayerIndex,
} from "./model/games.js";
import { Ws } from "./model/ws.js";

const HTTP_PORT = 8181;
const WS_PORT = 3000;

const wsServer = new WebSocketServer({ port: WS_PORT }, () => {
  console.log(`Websocket server started on the ${WS_PORT} port!`);
  httpServer.listen(HTTP_PORT, () => {
    console.log(`Static http server started on the ${HTTP_PORT} port!`);
  });
});

wsServer.on("connection", (websocket) => {
  const ws: Ws = websocket as Ws;
  ws.on("message", (message, isBinary) => {
    const { type, data } = decodeMessage(message as Buffer);

    if (type === "reg") {
      const user = addUser(data.name, data.password, ws);
      const answerData = {
        name: user.name,
        index: user.index,
        error: false,
        errorText: "",
      };
      const regResponse = encodeMessage({ type, data: answerData });
      ws.send(regResponse, { binary: isBinary });

      // broadcast playable rooms
      const playableRooms = getPlayableRooms();
      const updateRoomsResponse = encodeMessage({
        type: "update_room",
        data: playableRooms,
      });
      wsServer.clients.forEach((client) => {
        client.send(updateRoomsResponse, { binary: isBinary });
      });

      // broadcast winners
      const winners = getWinners();
      const updateWinnersResponse = encodeMessage({
        type: "update_winners",
        data: winners,
      });
      wsServer.clients.forEach((client) => {
        client.send(updateWinnersResponse, { binary: isBinary });
      });
    }

    if (type === "create_room") {
      const room = createRoom(ws);
      if (!room) {
        return;
      }
      // broadcast playable rooms
      const playableRooms = getPlayableRooms();
      const updateRoomsResponse = encodeMessage({
        type: "update_room",
        data: playableRooms,
      });
      wsServer.clients.forEach((client) => {
        client.send(updateRoomsResponse, { binary: isBinary });
      });
    }

    if (type === "add_user_to_room") {
      const room = addUserToRoom(data.indexRoom, ws);
      if (!room) {
        return;
      }
      const game = createGame(room.roomId);
      if (!game) {
        return;
      }

      const clients = game.players.map((player) => player.user.ws);
      clients.forEach((client) => {
        client.send(
          encodeMessage({
            type: "create_game",
            data: {
              idGame: game.gameId,
              idPlayer: getPlayerIndex(game.gameId, client),
            },
          }),
          {
            binary: isBinary,
          },
        );
      });

      // broadcast playable rooms
      const playableRooms = getPlayableRooms();
      const updateRoomsResponse = encodeMessage({
        type: "update_room",
        data: playableRooms,
      });
      wsServer.clients.forEach((client) => {
        client.send(updateRoomsResponse, { binary: isBinary });
      });
    }

    if (type === "add_ships") {
      const canStart = addShips(data.gameId, data.ships, data.indexPlayer);
      if (canStart) {
        const game = getGame(data.gameId);
        if (!game) {
          return;
        }

        const clients = game.players.map((player) => player.user.ws);
        clients.forEach((client) => {
          const playerIndex = getPlayerIndex(data.gameId, client);
          if (playerIndex === null) {
            return;
          }
          client.send(
            encodeMessage({
              type: "start_game",
              data: {
                ships: getPlayerShips(game.gameId, playerIndex),
                currentPlayerIndex: playerIndex,
              },
            }),
            { binary: isBinary },
          );
        });

        clients.forEach((client) => {
          const currentPlayer = setCurrentPlayerIndex(game.gameId);
          client.send(
            encodeMessage({
              type: "turn",
              data: { currentPlayer },
            }),
            { binary: isBinary },
          );
        });
      }
    }

    if (type === "attack" || type === "random_attack") {
      const attackResult =
        type === "attack" ? attack(data) : randomAttack(data);
      if (!attackResult) {
        return;
      }

      const game = getGame(data.gameId);
      if (!game) {
        return;
      }

      const clients = game.players.map((player) => player.user.ws);
      clients.forEach((client) => {
        attackResult.data.forEach((result) => {
          client.send(
            encodeMessage({
              type,
              data: { ...result, currentPlayer: data.indexPlayer },
            }),
            {
              binary: isBinary,
            },
          );
        });
      });

      const currentPlayer =
        attackResult.attackStatus === "shot" ||
        attackResult.attackStatus === "killed"
          ? getCurrentPlayerIndex(game.gameId)
          : setCurrentPlayerIndex(game.gameId);
      clients.forEach((client) => {
        client.send(
          encodeMessage({
            type: "turn",
            data: { currentPlayer },
          }),
          { binary: isBinary },
        );
      });

      if (attackResult.winner) {
        clients.forEach((client) => {
          client.send(
            encodeMessage({
              type: "finish",
              data: { winPlayer: attackResult.winner },
            }),
            { binary: isBinary },
          );
        });

        // broadcast winners
        const winners = getWinners();
        const updateWinnersResponse = encodeMessage({
          type: "update_winners",
          data: winners,
        });
        wsServer.clients.forEach((client) => {
          client.send(updateWinnersResponse, { binary: isBinary });
        });
      }
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
