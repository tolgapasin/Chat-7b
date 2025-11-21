export class SocketMessage {
  constructor(init: { type: string; payload: string }) {
    this.type = init.type;
    this.payload = init.payload;
  }

  type: string;
  payload: string;
}
