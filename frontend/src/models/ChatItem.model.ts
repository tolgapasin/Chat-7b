import type { ChatItemType } from "./ChatItemType.enum";

export class ChatItem {
  constructor(init: { type: ChatItemType; text: string }) {
    this.type = init.type;
    this.text = init.text;
  }

  type: ChatItemType;
  text: string;
}
