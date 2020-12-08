import React, { createContext, useContext, useEffect, useState } from 'react';
import { merge } from 'lodash';
import { FullPageLoader } from '../commons/components/FullPageLoader';
import { FullPageCentered } from '../commons/components/FullPageCentered';
import { AlertError } from '../commons/components/AlertError';
import { axios } from './axios';
import { useMountedState } from '../commons/hooks/use-mounted-state';

export interface Env {
  MELI_API_URL: string;
}

const defaultEnv: Partial<Env> = {};

export const EnvContext = createContext<Env>(undefined);

export const useEnv = () => useContext(EnvContext);

function parseEnv(dotenv: string): any {
  return dotenv
    .split('\n')
    .map(str => str.match(/^(\w+)=(.*)$/))
    .filter(arr => !!arr)
    .reduce(
      (current, [, key, val]) => {
        current[key] = val;
        return current;
      },
      {},
    );
}

export function EnvProvider(props) {
  const [loading, setLoading] = useMountedState(true);
  const [env, setEnv] = useState<Env>();
  const [error, setError] = useState();

  useEffect(() => {
    axios
      .get('/env.txt')
      .then(({ data }) => parseEnv(data))
      .then(json => merge(defaultEnv, json))
      .then(loadedEnv => {
        setEnv(loadedEnv);
        // eslint-disable-next-line no-console
        console.log('env', loadedEnv);
      })
      .finally(() => setLoading(false))
      .catch(setError);
  }, [setLoading]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (error) {
    return (
      <FullPageCentered>
        <AlertError error={error} />
      </FullPageCentered>
    );
  }

  return <EnvContext.Provider value={env} {...props} />;
}
