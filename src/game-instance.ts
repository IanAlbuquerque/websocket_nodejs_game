import * as WebSocket from 'ws';
import { Client, ServerClientMessageType, ServerClientMessage, ClientServerMessage, ClientServerMessageType, ClientChat, MatchChatData } from './comm';

export class GameInstance {

  private clients: Client[];

  constructor(clients?: Client[]) {
    this.clients = clients === undefined ? [] : clients;

    for (const client of this.clients) {
      client.onReceiveMessage((msg: ClientServerMessage) => {
        if (msg.type === ClientServerMessageType.CHAT) {
          const data : ClientChat = msg.data;
          this.broadcastChatData(data, client);
        }
      });
    }
  }

  public tick(): void {
    for (const client of this.clients) {
      client.sendMessage({ type: ServerClientMessageType.MATCH_TICK });
    }
  }

  private broadcastChatData(data: ClientChat, client: Client): void {
    const chatData: MatchChatData = {
      timestamp: new Date().toISOString(),
      playerName: client.getName(),
      text: data.text
    }
    for (const client of this.clients) {
      client.sendMessage({ type: ServerClientMessageType.MATCH_CHAT, data: chatData });
    }
  }
}