import { useEffect, useState } from 'react';
import { emitNowAndOnReconnect, listen } from '../../providers/websockets/listen';
import { ReactState } from '../../commons/types/react-state';
import { useSocket } from '../../providers/websockets/SocketProvider';
import { AppEvent } from '../../events';
import { Site } from './site';
import { useAuth } from '../../providers/AuthProvider';
import { Token } from './tokens/token';
import { Release } from './releases/release';

// TODO should we also emit to leave room ?
const joinHandle = 'join.site';

export function useSiteAdded(): ReactState<Site> {
  const socket = useSocket();
  const [site, setSite] = useState<Site>();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      return listen(socket, `user.${user._id.toString()}.${AppEvent.site_added}`, setSite);
    }
  }, [socket, user]);
  return [site, setSite];
}

export function useSiteUpdated(siteId: string): ReactState<Site> {
  const socket = useSocket();
  const [site, setSite] = useState<Site>();
  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit(joinHandle, siteId)), [socket, siteId]);
  useEffect(() => listen(socket, `site.${siteId}.${AppEvent.site_updated}`, setSite), [socket, siteId]);
  return [site, setSite];
}

// TODO teamId instead of user
export function useSiteDeleted(): ReactState<string> {
  const socket = useSocket();
  const { user } = useAuth();
  const [site, setSite] = useState<string>();
  useEffect(() => {
    if (user) {
      return listen(socket, `user.${user._id.toString()}.${AppEvent.site_deleted}`, setSite);
    }
  }, [socket, user]);
  return [site, setSite];
}

export function useReleaseUploaded(siteId: string): ReactState<Release> {
  const socket = useSocket();
  const [release, setRelease] = useState<Release>();
  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit(joinHandle, siteId)), [socket, siteId]);
  useEffect(() => listen(socket, `site.${siteId}.${AppEvent.release_created}`, setRelease), [socket, siteId]);
  return [release, setRelease];
}

export function useTokenAdded(siteId: string): ReactState<Token> {
  const socket = useSocket();
  const [token, setToken] = useState<Token>();
  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit(joinHandle, siteId)), [socket, siteId]);
  useEffect(() => listen(socket, `site.${siteId}.${AppEvent.token_added}`, setToken), [socket, siteId]);
  return [token, setToken];
}

export function useTokenDeleted(siteId: string): ReactState<string> {
  const socket = useSocket();
  const [tokenId, setTokenId] = useState<string>();
  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit(joinHandle, siteId)), [socket, siteId]);
  useEffect(() => listen(socket, `site.${siteId}.${AppEvent.token_deleted}`, setTokenId), [socket, siteId]);
  return [tokenId, setTokenId];
}
