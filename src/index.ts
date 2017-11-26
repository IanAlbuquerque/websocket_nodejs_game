import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { setInterval } from 'timers';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let id = 0;
const positions: { x: number, y: number }[] = [];

wss.on('connection', (ws: WebSocket) => {
  const my_id = id;
  id += 1;
  positions.push({ x: 100, y: 100 });

  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    console.log(`IN from ${my_id} <`, message);
    let position: {x: number, y: number} = JSON.parse(message);
    positions[my_id] = position;
    // ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send(JSON.stringify({id: my_id}));
});

setInterval(() => {
  wss.clients
  .forEach((client: WebSocket) => {
    client.send(JSON.stringify(positions));
  });
}, 33)

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});