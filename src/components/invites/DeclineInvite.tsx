import React from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { Button } from '../../commons/components/Button';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { UserOrg } from '../auth/user-org';
import { useLoading } from '../../commons/hooks/use-loading';

export function DeclineInvite({
  inviteId, className, onIgnore, token, disabled,
}: {
  inviteId: string;
  token: string;
  disabled: boolean;
  onIgnore: () => void;
  className?: string;
}) {
  const env = useEnv();
  const [loading, setLoading] = useLoading(false);

  const accept = () => {
    setLoading(true);
    return axios
      .put<UserOrg>(`${env.MELI_API_URL}/api/v1/invites/${inviteId}/decline`, {
        token,
      })
      .then(() => onIgnore())
      .catch(err => {
        toast(`Could not delete invite: ${err}`, {
          type: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button
        onClick={accept}
        className={classNames(className, 'btn btn-danger')}
        loading={loading}
        disabled={disabled}
      >
        Decline
      </Button>
    </>
  );
}
