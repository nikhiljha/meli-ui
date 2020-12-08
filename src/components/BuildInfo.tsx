import React, { useEffect, useRef, useState } from 'react';
import { useEnv } from '../providers/EnvProvider';
import { useMountedState } from '../commons/hooks/use-mounted-state';
import { axios } from '../providers/axios';
import { CopyToClipboard } from '../commons/components/CopyToClipboard';

interface ApiInfo {
  version: string;
  buildDate: Date;
  commitHash: string;
}

function useApiInfo() {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(false);
  const [error, setError] = useState();
  const [apiInfo, setApiInfo] = useState<ApiInfo>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<ApiInfo>(`${env.MELI_API_URL}/system/info`)
      .then(({ data }) => data)
      .then(setApiInfo)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, setLoading]);

  return {
    apiInfo,
    error,
    loading,
  };
}

export function BuildInfo({ className }: {
  className?;
}) {
  const { apiInfo } = useApiInfo();

  const jsonRef = useRef({
    ui: {
      version: process.env.REACT_APP_VERSION,
      commitHash: process.env.REACT_APP_BUILD_DATE,
      buildDate: process.env.REACT_APP_BUILD_DATE,
    },
    api: undefined,
  });

  const [json, setJson] = useState(JSON.stringify(jsonRef.current, null, 2));

  useEffect(() => {
    if (apiInfo) {
      jsonRef.current.api = apiInfo;
    }
    setJson(JSON.stringify(jsonRef.current, null, 2));
  }, [apiInfo]);

  return (
    <>
      <CopyToClipboard
        className={className}
        value={json}
      >
        {apiInfo?.version || process.env.REACT_APP_VERSION}
      </CopyToClipboard>
    </>
  );
}
