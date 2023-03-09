import { Application, RoomId, startServer, UserId, verifyJwt } from "@hathora/server-sdk";
import * as dotenv from "dotenv";
dotenv.config();

let LOBBY = "13y1rrt3b498c";
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");
type RoomData = Record<string, string[]>;
let roomMap: RoomData = { [LOBBY]: [] };

const app: Application = {
  verifyToken: (token: string): UserId | undefined => {
    return verifyJwt(token, process.env.APP_SECRET as string);
  },
  subscribeUser: (roomId: RoomId, userId: UserId): void => {
    console.log("new user: ", roomId, userId);

    if (!roomMap[roomId]) {
      roomMap[roomId] = [];
    }
    roomMap[roomId].push(userId);
    server.broadcastMessage(
      roomId,
      encoder.encode(
        JSON.stringify({
          type: "USERLIST",
          roomID: roomId,
          users: [...roomMap[roomId]],
        })
      )
    );
  },
  unsubscribeUser: (roomId: RoomId, userId: UserId): void => {},
  onMessage: (roomId: RoomId, userId: UserId, data: ArrayBuffer): void => {
    console.log("new message: ", roomId, userId, decoder.decode(data));
  },
};

const port = 9000;
const server = await startServer(app, port);
console.log(`Hathora Server listening on port ${port}`);
