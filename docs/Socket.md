# Socket.IO

## Architecture

`SocketModule` is a reusable feature module. `SocketGateway` owns the Socket.IO transport and delegates authentication, connected-user tracking, rooms, and emits to `SocketService`. The service is exported for future chat, notification, order, or message modules.

```text
Socket.IO client
  -> SocketGateway handshake and event handlers
  -> SocketService
  -> JwtService + UsersService / in-memory connection maps
```

## Configuration

Configure the gateway through `config/.env`:

```dotenv
SOCKET_PORT= # optional; omit to share the Nest HTTP server port
SOCKET_NAMESPACE=/socket
SOCKET_CORS_ORIGIN=http://localhost:3000
SOCKET_CORS_CREDENTIALS=true
SOCKET_TRANSPORTS=websocket,polling
```

When `SOCKET_PORT` is omitted, Socket.IO shares the application port (`5000` by default). A configured `SOCKET_PORT` starts an independent Socket.IO listener. The default namespace is `/socket`.

## Authentication

Connections must send the existing JWT as a bearer token in either `extraHeaders.authorization` or `auth.token`. The service verifies it through the application `JwtService`, loads the user through `UsersService`, rejects missing/invalid/expired tokens, and stores `{ id, email, role }` on `socket.data.user`.

## Events

| Event | Direction | Access | Payload / behavior |
| --- | --- | --- | --- |
| `connection` | Server lifecycle | Authenticated | Registers socket, joins `user:<userId>`, emits `online` for newly online users. |
| `disconnect` | Server lifecycle | Authenticated | Cleans maps and emits `offline` when the user's final socket disconnects. |
| `joinRoom` | Client -> server | Authenticated | `{ room: string }`; joins a room. |
| `leaveRoom` | Client -> server | Authenticated | `{ room: string }`; leaves a room. |
| `ping` | Client -> server | Authenticated | Sends `pong` with an ISO timestamp. |
| `pong` | Server -> client | Authenticated | Timestamp acknowledgement. |
| `typing` | Client -> room peers | Authenticated | `{ room, conversationId? }`; excludes sender. |
| `stopTyping` | Client -> room peers | Authenticated | Same payload; excludes sender. |
| `online` | Server -> clients / client -> server | Authenticated | Presence broadcast; emitting from client returns online users. |
| `offline` | Server -> clients | Authenticated | Final-disconnect presence broadcast. |
| `socket:error` | Server -> client | N/A | Authentication and socket-operation errors. |

## Rooms and service methods

`SocketService` provides `joinRoom`, `leaveRoom`, `joinUserRoom`, `joinConversationRoom`, and `broadcastToRoom`. It also exposes `emitToUser`, `emitToRoom`, `emitToAll`, `emitExceptSender`, `getSocketByUserId`, `getUserBySocketId`, `isUserOnline`, `getOnlineUsers`, and `getOnlineUserCount`.

Presence is kept in memory per process with user ID, active socket ID, connection time, and last activity. A user may have multiple sockets; they remain online until their final socket disconnects.

## Connection flow

1. Client establishes a connection under `/socket` with a bearer token.
2. Gateway delegates token verification and user loading to `SocketService`.
3. Service stores the socket/user mapping, joins the private user room, and emits `online` when applicable.
4. Gateway logs user ID, socket ID, and timestamp.

## Disconnection flow

1. Gateway delegates cleanup to `SocketService`.
2. Service removes the socket mapping and updates presence.
3. If no sockets remain for the user, service emits `offline`.
4. Gateway logs user ID, socket ID, and timestamp.

## Client example

```ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000/socket', {
  auth: { token: `Bearer ${accessToken}` },
  transports: ['websocket'],
});

socket.on('connect', () => {
  socket.emit('joinRoom', { room: 'conversation:abc123' });
  socket.emit('ping');
});

socket.on('pong', ({ timestamp }) => console.log('pong', timestamp));
socket.on('typing', (payload) => console.log('typing', payload));
socket.on('online', (user) => console.log('online', user));
socket.on('offline', (user) => console.log('offline', user));
socket.on('socket:error', (error) => console.error(error.message));
```

To send a typing state:

```ts
socket.emit('typing', {
  room: 'conversation:abc123',
  conversationId: 'abc123',
});
```

## Scaling note

The current in-memory presence map is correct for a single Nest process. For multi-instance deployment, replace the map and default Socket.IO adapter with a shared adapter/store such as Redis.
