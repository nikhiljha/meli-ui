import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './TeamSettings.module.scss';
import { Button } from '../../../commons/components/Button';
import { TeamNameInput } from './TeamNameInput';
import { useEnv } from '../../../providers/EnvProvider';
import { useTeam } from '../TeamView';
import { axios } from '../../../providers/axios';
import { InputError } from '../../../commons/components/forms/InputError';
import { COLOR_PATTERN, required } from '../../../commons/components/forms/form-constants';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';

interface Settings {
  name: string;
  color: string;
}

export function TeamSettings() {
  const env = useEnv();
  const { teamId } = useParams();
  const { team, setTeam } = useTeam();

  const methods = useForm<Settings>({
    mode: 'onChange',
  });
  const {
    errors, register, reset, handleSubmit, formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (team && reset) {
      reset(team);
    }
  }, [team, reset]);

  const [loading, setLoading] = useMountedState(false);

  const onSubmit = (settings: Settings) => {
    setLoading(true);
    axios
      .put<Settings>(`${env.MELI_API_URL}/api/v1/teams/${teamId}`, settings)
      .then(({ data }) => data)
      .then(setTeam)
      .then(() => toast('Team saved', {
        type: 'success',
      }))
      .catch(err => toast(`Could not update team: ${err}`, {
        type: 'error',
      }))
      .finally(() => setLoading(false));
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
      >

        <div className="form-group d-flex justify-content-end">
          {/* TODO use http://reactcommunity.org/react-transition-group/css-transition */}
          {isDirty && (
            <button
              type="button"
              className="btn btn-outline-primary animate fadeIn"
              onClick={() => reset(team)}
            >
              Discard
            </button>
          )}
          <Button
            type="submit"
            className="ml-3 btn btn-primary"
            loading={loading}
            disabled={!isDirty}
          >
            Save
          </Button>
        </div>

        <div className="mt-4 card">
          <div className="card-header">
            <strong>Team</strong>
          </div>
          <div className="card-body">
            <TeamNameInput />
            <div className="form-group">
              <label htmlFor="color" className="form-label">Color</label>
              <input
                type="color"
                id="color"
                name="color"
                ref={register({
                  required,
                  pattern: COLOR_PATTERN,
                })}
                className="form-control"
                placeholder="my-team"
                autoComplete="off"
                defaultValue="#000000"
              />
              <InputError error={errors} path="color" />
            </div>
          </div>
        </div>

      </form>
    </FormProvider>
  );
}
