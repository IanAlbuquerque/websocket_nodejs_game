
import * as WebSocket from 'ws';
import { EventEmitter } from 'events';

export enum ServerClientMessageType {
  FINDING_MATCH,
  MATCH_TICK,
  MATCH_CHAT
}

export interface ServerClientMessage {
  type: ServerClientMessageType
  data?: any
}

export interface MatchChatData {
  timestamp: string;
  playerName: string;
  text: string;
}

// ----------------

export enum ClientServerMessageType {
  CREATE,
  CHAT
}

export interface ClientServerMessage {
  type: ClientServerMessageType
  data?: any
}

export interface CreateClientData {
  name: string;
}

export interface ClientChat {
  text: string;
}

export class Client {
  private ws: WebSocket;
  private name: string;

  private receiveMessageEmitter: EventEmitter = new EventEmitter();

  constructor(ws: WebSocket, name: string) {
    this.ws = ws;
    this.name = name;

    this.ws.on('message', (message: string) => {
      const msg: ClientServerMessage = JSON.parse(message);
      this.receiveMessageEmitter.emit('receive', msg);
    });

    console.log(`New client created with name ${name}...`);
  }

  public sendMessage(msg: ServerClientMessage) {
    this.ws.send(JSON.stringify(msg));
  }

  public getName(): string {
    return this.name;
  }

  public onReceiveMessage(callback: (msg: ClientServerMessage) => void): void {
    this.receiveMessageEmitter.on('receive', callback);
  }
}