import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { axios } from './axios';
import { useEnv } from './EnvProvider';
import { Loader } from '../commons/components/Loader';
import { AlertError } from '../commons/components/AlertError';
import { useLoading } from '../commons/hooks/use-loading';

interface MeliLocation {
  id: string;
  label: string;
}

const Context = createContext<MeliLocation[]>(undefined);

export const useLocations = () => useContext(Context);

export function LocationsProvider(props) {
  const env = useEnv();
  const [loading, setLoading] = useLoading(true);
  const [error, setError] = useState();
  const [availableLocations, setAvailableLocations] = useState<MeliLocation[]>();

  useEffect(() => {
    setLoading(true);
    axios
      .get<MeliLocation[]>(`${env.MELI_API_URL}/api/v1/locations`)
      .then(({ data }) => data)
      .then(setAvailableLocations)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, setLoading]);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} className="text-left" />
  ) : (
    <Context.Provider value={availableLocations} {...props} />
  );
}
