export function emitNowAndOnReconnect(
  socket: SocketIOClient.Socket,
  emit: () => any,
): (() => void) | undefined {
  if (socket) {
    emit();
    const connectEvent = 'connect';
    const connectListener = () => {
      emit();
    };
    socket.on(connectEvent, connectListener);
    return () => {
      socket.removeListener(connectEvent, connectListener);
    };
  }
}

export function listen(socket: SocketIOClient.Socket, event: string, listener: any): () => void | undefined {
  if (socket) {
    socket.on(event, listener);
    return () => {
      socket.removeListener(event, listener);
    };
  }
}

export function listenMany(
  socket: SocketIOClient.Socket,
  listeners: {
    event: string;
    listener: any;
  }[],
): () => void | undefined {
  if (socket) {
    listeners.forEach(({ event, listener }) => {
      socket.on(event, listener);
    });
    return () => {
      listeners.forEach(({ event, listener }) => {
        socket.removeListener(event, listener);
      });
    };
  }
}
