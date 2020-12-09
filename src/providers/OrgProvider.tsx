import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Env, useEnv } from './EnvProvider';
import { axios } from './axios';
import { emitNowAndOnReconnect } from './websockets/listen';
import { useSocket } from './websockets/SocketProvider';
import { OrgMember } from '../components/orgs/staff/members/org-member';
import { Org } from '../components/orgs/org';
import { routerHistory } from './history';
import { useAuth } from './AuthProvider';
import { FullPageCentered } from '../commons/components/FullPageCentered';
import { Loader } from '../commons/components/Loader';

export interface CurrentOrg {
  org: Org;
  member: OrgMember;
  isAdmin: boolean;
  isOwner: boolean;
  isAdminOrOwner: boolean;
}

interface OrgContext {
  initialized: boolean;
  loading: boolean;
  currentOrg: CurrentOrg;
  setOrg: (org: CurrentOrg) => void;
  changeCurrentOrg: (orgId: string) => Promise<void>;
  signOutOrg: () => void;
}

export const Context = createContext<OrgContext>(undefined);

export const useCurrentOrg = () => useContext(Context);

const storageKey = 'org';

export function OrgProvider(props) {
  const [initialized, setInitialized] = useState(!localStorage.getItem(storageKey));
  const [loading, setLoading] = useState(!!localStorage.getItem(storageKey));
  const [currentOrg, setCurrentOrg] = useState<CurrentOrg>();
  const socket = useSocket();
  const env = useEnv();
  const { user } = useAuth();

  const signOutOrg = () => {
    setCurrentOrg(null);
    localStorage.setItem(storageKey, '');
    routerHistory.push('/orgs');
  };

  const changeCurrentOrg = (environment: Env, orgId: string) => {
    setLoading(true);
    return Promise
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
      .finally(() => {
        setInitialized(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    const orgId = localStorage.getItem(storageKey);
    if (user && orgId) {
      changeCurrentOrg(env, orgId)
        .catch(err => {
          toast(`Could not get current org: ${err}`, {
            type: 'error',
          });
          signOutOrg();
        });
    } else {
      setInitialized(true);
      setLoading(false);
    }
  }, [env, setLoading, user]);

  useEffect(() => {
    if (currentOrg && socket) {
      return emitNowAndOnReconnect(socket, () => socket.emit('join.org', currentOrg.org._id));
    }
  }, [currentOrg, socket]);

  return !initialized ? (
    <FullPageCentered>
      <p>
        Loading organization
        <Loader className="ml-2" />
      </p>
    </FullPageCentered>
  ) : (
    <Context.Provider
      value={{
        initialized,
        loading,
        currentOrg,
        changeCurrentOrg: org => changeCurrentOrg(env, org),
        signOutOrg,
      }}
      {...props}
    />
  );
}
