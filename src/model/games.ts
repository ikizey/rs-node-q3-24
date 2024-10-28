import { getRoom, removeRoom } from "./rooms.js";
import { User } from "./users.js";
import { Ws } from "./ws.js";

type Cell = {
  x: number;
  y: number;
  ship: boolean;
  attacked: boolean;
};

type Board = Cell[];

type Game = {
  gameId: number;
  roomId: number;
  players: { user: User; board: Board; index: number; ships: Ship[] }[];
  currentPlayerIndex: number;
};

const games: Map<number, Game> = new Map();

let gameIndex = 0;
const nextGameIndex = () => {
  gameIndex += 1;
  return gameIndex;
};

export const createGame = (roomId: number) => {
  const room = getRoom(roomId);
  if (!room) {
    return null;
  }
  const game = {
    gameId: nextGameIndex(),
    roomId,
    players: [
      { user: room.roomUsers[0], board: [] as Board, index: 0, ships: [] },
      { user: room.roomUsers[1], board: [] as Board, index: 1, ships: [] },
    ],
    currentPlayerIndex: Math.random() > 0.5 ? 0 : 1,
  };
  games.set(game.gameId, game);
  removeRoom(roomId);
  return game;
};

export const getGame = (gameId: number) => {
  const game = games.get(gameId);
  return game;
};

export const getPlayerIndex = (gameId: number, ws: Ws) => {
  const game = getGame(gameId);
  if (!game) {
    return null;
  }
  return game.players.findIndex(
    (player) => player.user.ws.userIndex === ws.userIndex,
  );
};

const shipType = {
  small: 1,
  medium: 2,
  large: 3,
  huge: 4,
} as const;

type ShipType = keyof typeof shipType;

type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean; // true - horizontal, false - vertical
  length: number;
  type: ShipType;
};

const createCell = (ship: Ship) => {
  const cells: Cell[] = [];
  for (let i = 0; i < ship.length; i++) {
    const cell: Cell = { ship: true, attacked: false, x: -1, y: -1 };
    if (ship.direction) {
      cell.x = ship.position.x;
      cell.y = ship.position.y + i;
    } else {
      cell.x = ship.position.x + i;
      cell.y = ship.position.y;
    }
    cells.push(cell);
  }
  return cells;
};

export const addShips = (
  gameId: number,
  ships: Ship[],
  playerIndex: number,
) => {
  const game = getGame(gameId);
  if (!game) {
    return null;
  }

  const player = game.players[playerIndex];

  const board = player.board;
  ships.forEach((ship) => {
    const cells = createCell(ship);
    board.push(...cells);
  });
  player.ships = [...player.ships, ...ships];
  return canStartGame(gameId);
};

export const getPlayerShips = (gameId: number, playerIndex: number) => {
  const game = getGame(gameId);
  if (!game) {
    return null;
  }
  return game.players[playerIndex].ships;
};

const canStartGame = (gameId: number) => {
  const FULL_BOARD_LENGTH = 20;
  const game = getGame(gameId);
  if (!game) {
    return false;
  }
  return game.players.every(
    (player) => player.board.length === FULL_BOARD_LENGTH,
  );
};

export const getCurrentPlayerIndex = (gameId: number) => {
  const game = getGame(gameId);
  if (!game) {
    return null;
  }
  return game.currentPlayerIndex;
};

export const setCurrentPlayerIndex = (gameId: number) => {
  const game = getGame(gameId);
  if (!game) {
    return null;
  }

  game.currentPlayerIndex = game.currentPlayerIndex === 0 ? 1 : 0;

  return game.currentPlayerIndex;
};

type AttackData = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

const enemy = (game: Game, playerIndex: number) => {
  const enemyIndex = playerIndex === 0 ? 1 : 0;
  return game.players[enemyIndex];
};

type AttackStatus = "miss" | "killed" | "shot";

type AttackResult = {
  attackStatus: AttackStatus;
  winner: number | null;
  data: {
    status: AttackStatus;
    position: {
      x: number;
      y: number;
    };
  }[];
} | null;

export const attack = (data: AttackData): AttackResult => {
  const game = getGame(data.gameId);
  if (!game) {
    return null;
  }
  const currentPlayerIndex = getCurrentPlayerIndex(data.gameId);
  if (currentPlayerIndex !== data.indexPlayer) {
    console.log(
      `player ${data.indexPlayer} is not current player, current player is ${currentPlayerIndex}`,
    );
    return null;
  }
  const enemyPlayer = enemy(game, data.indexPlayer);
  const enemyBoard = enemyPlayer.board;
  const cell = enemyBoard.find(
    (cell) => cell.x === data.x && cell.y === data.y,
  );
  if (!cell) {
    enemyBoard.push({ x: data.x, y: data.y, attacked: true, ship: false });
    return {
      attackStatus: "miss",
      winner: null,
      data: [
        {
          status: "miss",
          position: { x: data.x, y: data.y },
        },
      ],
    };
  }

  if (cell.attacked) {
    return null;
  }

  cell.attacked = true;

  const isFinished = isGameFinished(enemyBoard);
  const winner = isFinished ? currentPlayerIndex : null;
  if (winner) {
    game.players[winner].user.wins += 1;
  }

  const killData = getShipKillData(enemyBoard, data.x, data.y);
  if (killData.length > 0) {
    return {
      attackStatus: "killed",
      winner,
      data: killData,
    };
  }

  return {
    attackStatus: "shot",
    winner,
    data: [
      {
        status: "shot",
        position: { x: data.x, y: data.y },
      },
    ],
  };
};

const randomCoordinate = () => {
  const MIN = 1;
  const MAX = 10;
  const min = Math.ceil(MIN);
  const max = Math.floor(MAX);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

type RandomAttackData = {
  gameId: number;
  indexPlayer: number;
};

export const randomAttack = (data: RandomAttackData) => {
  const game = getGame(data.gameId);
  if (!game) {
    return null;
  }
  const enemyPlayer = enemy(game, data.indexPlayer);
  const enemyBoard = enemyPlayer.board;
  let randomX = randomCoordinate();
  let randomY = randomCoordinate();
  while (
    !enemyBoard.find((cell) => cell.x === randomX && cell.y === randomY) &&
    !enemyBoard.find((cell) => cell.attacked)
  ) {
    randomX = randomCoordinate();
    randomY = randomCoordinate();
  }

  return attack({
    x: randomX,
    y: randomY,
    ...data,
  });
};

const isGameFinished = (currentEnemyBoard: Board) => {
  const shipCells = currentEnemyBoard.filter((cell) => cell.ship);
  return shipCells.every((cell) => cell.attacked);
};

type AttackCellData = {
  status: AttackStatus;
  position: {
    x: number;
    y: number;
  };
};

const getShipKillData = (
  board: Board,
  x: number,
  y: number,
): AttackCellData[] => {
  const result: AttackCellData[] = [];
  const killedCells: Cell[] = [];
  const surroundingCells: { x: number; y: number }[] = [];

  // Find all connected ship cells
  const findConnectedShipCells = (cellX: number, cellY: number) => {
    const cell = board.find((c) => c.x === cellX && c.y === cellY);
    if (cell && cell.ship && !killedCells.includes(cell)) {
      killedCells.push(cell);
      findConnectedShipCells(cellX + 1, cellY);
      findConnectedShipCells(cellX - 1, cellY);
      findConnectedShipCells(cellX, cellY + 1);
      findConnectedShipCells(cellX, cellY - 1);
    }
  };

  findConnectedShipCells(x, y);

  const isShipKilled =
    killedCells.length > 0 && killedCells.every((cell) => cell.attacked);

  if (isShipKilled) {
    killedCells.forEach((cell) => {
      result.push({
        status: "killed",
        position: { x: cell.x, y: cell.y },
      });

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const sx = cell.x + dx;
          const sy = cell.y + dy;

          if (board.some((c) => c.ship && c.x === sx && c.y === sy)) continue;

          if (!surroundingCells.some((pos) => pos.x === sx && pos.y === sy)) {
            surroundingCells.push({ x: sx, y: sy });
          }
        }
      }
    });

    surroundingCells.forEach((pos) => {
      result.push({
        status: "miss",
        position: pos,
      });
    });
  }

  return result;
};
