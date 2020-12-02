import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useEnv } from '../../../providers/EnvProvider';
import { useLoading } from '../../../commons/hooks/use-loading';
import { Branch } from '../branches/branch';
import { axios } from '../../../providers/axios';
import { CustomSelect } from '../../../commons/components/CustomSelect';
import styles from './SelectMainBranch.module.scss';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import { InputError } from '../../../commons/components/forms/InputError';
import { required } from '../../../commons/components/forms/form-constants';

function useBranches(siteId: string) {
  const env = useEnv();
  const [loading, setLoading] = useLoading();
  const [error, setError] = useState();
  const [branches, setBranches] = useState<Branch[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Branch[]>(`${env.MELI_SERVER_URL}/api/v1/sites/${siteId}/branches`)
      .then(({ data }) => data)
      .then(setBranches)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, setLoading, siteId]);

  return {
    branches,
    setBranches,
    error,
    loading,
  };
}

export function SelectMainBranch({ siteId }: {
  siteId: string;
}) {
  const {
    branches, error, loading,
  } = useBranches(siteId);
  const { control, errors } = useFormContext();

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <div>
      <Controller
        control={control}
        name="mainBranch"
        rules={{
          required,
        }}
        render={({ value, onChange }) => (
          <CustomSelect
            options={branches?.map(b => ({
              label: b.name, value: b,
            }))}
            onChange={val => {
              onChange(val?._id);
            }}
            className={styles.select}
            value={branches?.find(b => b._id === value)}
          />
        )}
      />
      <InputError error={errors} path="mainBranch" />
    </div>
  );
}
