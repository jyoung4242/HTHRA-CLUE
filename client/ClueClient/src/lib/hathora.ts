import { HathoraClient, HathoraConnection } from "@hathora/client-sdk";

const APP_ID = "app-0b9572ec-c44d-4f1c-9bd7-c53a9b7e3651";

export enum ClientMessageTypes {
  CONNECTION,
}

export default class HathoraInterface {
  state: any = undefined;
  client: HathoraClient;
  token: string | null = null;
  connection: HathoraConnection | undefined;
  currentRoom: string;
  defaultRoom: string = "13y1rrt3b498c";

  constructor(state: any) {
    //const connectionInfo = undefined; //cloud
    const connectionInfo = { host: "localhost", port: 9000, transportType: "tcp" as const };
    this.state = state;
    this.client = new HathoraClient(APP_ID, connectionInfo);
    this.currentRoom = "";
    this.connection = undefined;
    this.login();
  }

  async login() {
    this.token = sessionStorage.getItem("token");
    if (!this.token) this.token = await this.client.loginAnonymous();
    sessionStorage.setItem("token", this.token);
    this.currentRoom = this.defaultRoom;
    if (this.token) this.init();
  }

  async init() {
    this.connection = await this.client.newConnection(this.currentRoom);
    this.connection.onClose(this.onClose);
    this.connection.onMessageJson(this.getJSONmsg);
    await this.connection.connect(this.token!);
    this.sendMessage(ClientMessageTypes.CONNECTION, "HELLO HATHORA");
  }

  async sendMessage(type: ClientMessageTypes, data: string) {
    this.connection?.writeJson({
      type: type,
      msg: data,
    });
  }

  onClose(e: any) {
    console.log("HATHORA CONNECTION FAILURE");
    console.log(`error:`, e);
  }

  getJSONmsg(msg: any) {
    console.log(`HATHORA SERVER MESSAGE`);
    console.log(`message: `, msg);
  }

  async switchRoom(roomId: string) {
    this.connection!.disconnect();
    this.connection = await this.client.newConnection(roomId);
    this.connection.connect(this.token!);
    this.connection.onClose(this.onClose);
    this.connection.onMessageJson(this.getJSONmsg);
    this.currentRoom = roomId;
  }

  async enterLobby() {
    if (this.currentRoom == this.defaultRoom) return;
    this.connection!.disconnect();
    this.connection = await this.client.newConnection(this.defaultRoom);
    this.connection.connect(this.token!);
    this.connection.onClose(this.onClose);
    this.connection.onMessageJson(this.getJSONmsg);
    this.currentRoom = this.defaultRoom;
  }
}
