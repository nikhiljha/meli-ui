import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { routerHistory } from '../../providers/history';
import { Button } from '../../commons/components/Button';
import { CardModal } from '../../commons/components/modals/CardModal';
import { useLoading } from '../../commons/hooks/use-loading';

export function DeleteTeam({
  id, className, children,
}: {
  id: string;
  className?: string;
  children: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useLoading(false);
  const env = useEnv();

  const deleteTeam = () => {
    setLoading(true);
    return axios
      .delete(`${env.MELI_SERVER_URL}/api/v1/teams/${id}`)
      .then(() => {
        setIsOpen(false);
        routerHistory.push('/');
      })
      .catch(err => {
        toast(`Could not delete team: ${err}`, {
          type: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete team"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this token ?</p>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <Button
            className="btn btn-danger ml-3"
            onClick={deleteTeam}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </CardModal>
      <div onClick={() => setIsOpen(true)} className={className}>
        {children}
      </div>
    </>
  );
}
