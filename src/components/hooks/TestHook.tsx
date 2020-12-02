import React from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { Button } from '../../commons/components/Button';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { useLoading } from '../../commons/hooks/use-loading';

export function TestHook({
  config, className, disabled,
}: {
  config: any;
  className?: string;
  disabled: boolean;
}) {
  const [loading, setLoading] = useLoading(false);
  const env = useEnv();
  const test = () => {
    setLoading(true);
    axios
      .post(`${env.MELI_SERVER_URL}/api/v1/sites/notifications/test`, config)
      .then(() => toast('It worked !', {
        type: 'success',
      }))
      .catch(err => toast(`It didnt work: ${err}`, {
        type: 'error',
      }))
      .finally(() => setLoading(false));
  };
  return (
    <>
      <Button
        loading={loading}
        onClick={test}
        disabled={disabled}
        className={classNames('btn btn-sm btn-primary', className)}
      >
        Test
      </Button>
    </>
  );
}
