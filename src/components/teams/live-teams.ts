import { useEffect, useState } from 'react';
import { emitNowAndOnReconnect, listen } from '../../providers/websockets/listen';
import { ReactState } from '../../commons/types/react-state';
import { useSocket } from '../../providers/websockets/SocketProvider';
import { AppEvent } from '../../events';
import { Team } from './team';
import { useAuth } from '../../providers/AuthProvider';
import { TeamMember } from './members/team-member';

// TODO should we also emit to leave room ?
const joinHandle = 'join.team';

export function useTeamAdded(): ReactState<Team> {
  const socket = useSocket();
  const [team, setTeam] = useState<Team>();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      return listen(socket, `user.${user._id.toString()}.${AppEvent.team_added}`, setTeam);
    }
  }, [socket, user]);
  return [team, setTeam];
}

export function useTeamUpdated(teamId: string): ReactState<Team> {
  const socket = useSocket();
  const [team, setTeam] = useState<Team>();
  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit(joinHandle, teamId)), [socket, teamId]);
  useEffect(() => listen(socket, `team.${teamId}.${AppEvent.team_updated}`, setTeam), [socket, teamId]);
  return [team, setTeam];
}

// TODO subscribe on org or team ?
export function useTeamDeleted(): ReactState<string> {
  const socket = useSocket();
  const { user } = useAuth();
  const [team, setTeam] = useState<string>();
  useEffect(() => {
    if (user) {
      return listen(socket, `team.${user._id.toString()}.${AppEvent.team_deleted}`, setTeam);
    }
  }, [socket, user]);
  return [team, setTeam];
}

export function useMemberAdded(teamId: string): ReactState<TeamMember> {
  const socket = useSocket();
  const [token, setToken] = useState<TeamMember>();
  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit(joinHandle, teamId)), [socket, teamId]);
  useEffect(() => listen(socket, `team.${teamId}.${AppEvent.team_member_added}`, setToken), [socket, teamId]);
  return [token, setToken];
}

export function useMemberDeleted(teamId: string): ReactState<string> {
  const socket = useSocket();
  const [tokenId, setTokenId] = useState<string>();
  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit(joinHandle, teamId)), [socket, teamId]);
  useEffect(() => listen(socket, `team.${teamId}.${AppEvent.team_member_deleted}`, setTokenId), [socket, teamId]);
  return [tokenId, setTokenId];
}
