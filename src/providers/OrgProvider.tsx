import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import { Env, useEnv } from './EnvProvider';
import { axios } from './axios';
import { emitNowAndOnReconnect } from './websockets/listen';
import { useSocket } from './websockets/SocketProvider';
import { Loader } from '../commons/components/Loader';
import { FullPageCentered } from '../commons/components/FullPageCentered';
import { OrgMember } from '../components/orgs/staff/members/org-member';
import { Org } from '../components/orgs/org';
import { routerHistory } from './history';
import { useMountedState } from '../commons/hooks/use-mounted-state';

export interface CurrentOrg {
  org: Org;
  member: OrgMember;
  isAdmin: boolean;
  isOwner: boolean;
  isAdminOrOwner: boolean;
}

interface OrgContext {
  currentOrg: CurrentOrg;
  setOrg: (org: CurrentOrg) => void;
  changeCurrentOrg: (orgId: string) => Promise<void>;
  signOutOrg: () => void;
}

export const Context = createContext<OrgContext>(undefined);

export const useCurrentOrg = () => useContext(Context);

const storageKey = 'org';

export function OrgProvider(props) {
  const [loading, setLoading] = useMountedState(!!localStorage.getItem(storageKey));
  const [currentOrg, setCurrentOrg] = useState<CurrentOrg>();
  const socket = useSocket();
  const env = useEnv();

  const signOutOrg = () => {
    setCurrentOrg(null);
    localStorage.setItem(storageKey, '');
    routerHistory.push('/orgs');
  };

  const changeCurrentOrg = (environment: Env, orgId: string) => (
    Promise
      .all([
        axios.get<Org>(`${environment.MELI_API_URL}/api/v1/orgs/${orgId}`),
        axios.get<OrgMember>(`${environment.MELI_API_URL}/api/v1/orgs/${orgId}/member`),
      ])
      .then(([{ data: org }, { data: member }]) => {
        const newCurrentOrg: CurrentOrg = {
          org,
          member,
          isAdmin: member.admin,
          isOwner: member.owner,
          isAdminOrOwner: member.admin || member.owner,
        };
        setCurrentOrg(newCurrentOrg);
        localStorage.setItem(storageKey, newCurrentOrg?.org._id);
      })
  );

  useEffect(() => {
    const orgId = localStorage.getItem(storageKey);
    if (env && orgId) {
      changeCurrentOrg(env, orgId)
        .finally(() => setLoading(false))
        .catch(err => {
          toast(`Could not get org: ${err}`, {
            type: 'error',
          });
          signOutOrg();
        });
    }
  }, [env, setLoading]);

  useEffect(() => {
    if (currentOrg && socket) {
      return emitNowAndOnReconnect(socket, () => socket.emit('join.org', currentOrg.org._id));
    }
  }, [currentOrg, socket]);

  return loading ? (
    <FullPageCentered>
      <Loader />
    </FullPageCentered>
  ) : (
    <Context.Provider
      value={{
        currentOrg,
        changeCurrentOrg: org => changeCurrentOrg(env, org),
        signOutOrg,
      }}
      {...props}
    />
  );
}
