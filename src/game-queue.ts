import { GameInstance } from './game-instance';
import { Client, ServerClientMessageType, ServerClientMessage } from './comm';

export class GameQueue {
    private clients: Client[] = [];
  
    constructor(clients?: Client[]) {
      this.clients = clients === undefined ? [] : clients;
    }

    public addClient(client: Client): void {
      console.log(`Client ${client.getName()} added to game queue....`);
      this.clients.push(client);
    }

    public makeGameInstance(): GameInstance | undefined {
      if ( this.clients.length >= 2) {
        console.log(`Creating game instance with clients:`);
        console.log(`> ${this.clients[0].getName()}`);
        console.log(`> ${this.clients[1].getName()}`);
        const newGameInstance: GameInstance = new GameInstance([this.clients[0], this.clients[1]]);
        this.clients.shift();
        this.clients.shift();
        return newGameInstance;
      }
      return undefined;
    }

    public tick(): void {
      for (const client of this.clients) {
        client.sendMessage({ type: ServerClientMessageType.FINDING_MATCH });
      }
    }
  }