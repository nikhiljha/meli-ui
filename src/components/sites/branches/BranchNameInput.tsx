import { useFormContext } from 'react-hook-form';
import React from 'react';
import { toast } from 'react-toastify';
import { Env, useEnv } from '../../../providers/EnvProvider';
import {
  isSubdomain, maxLength, required,
} from '../../../commons/components/forms/form-constants';
import { debounceTime } from '../../../utils/debounce-time';
import { InputError } from '../../../commons/components/forms/InputError';
import { axios } from '../../../providers/axios';
import { useSite } from '../SiteView';

async function validateName(env: Env, siteId: string, name: string): Promise<string | undefined> {
  if (!name) {
    return undefined;
  }
  return axios
    .post<string | undefined>(`${env.MELI_API_URL}/api/v1/sites/${siteId}/branches.validate/name`, {
      name,
    })
    .then(({ data }) => data || undefined)
    .catch(err => {
      toast(`Could not validate branch name: ${err}`, {
        type: 'error',
      });
      return undefined;
    });
}

export function BranchNameInput({ setInputRef }: {
  setInputRef?: (input: HTMLInputElement) => void;
}) {
  const { register, errors } = useFormContext();
  const { site } = useSite();
  const env = useEnv();

  const ref = input => {
    if (setInputRef) {
      setInputRef(input);
    }
    register({
      required,
      maxLength: maxLength(),
      pattern: isSubdomain,
      validate: debounceTime<string | undefined>(val => validateName(env, site._id, val), 300),
    })(input);
  };

  return (
    <div className="form-group">
      <label htmlFor="name" className="form-label">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        ref={ref}
        className="form-control"
        placeholder="next"
        autoComplete="off"
      />
      <InputError error={errors} path="name" />
    </div>
  );
}
