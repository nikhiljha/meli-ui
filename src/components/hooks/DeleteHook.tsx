import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../commons/components/Button';
import { axios } from '../../providers/axios';
import { CardModal } from '../../commons/components/modals/CardModal';
import { useLoading } from '../../commons/hooks/use-loading';
import { useEnv } from '../../providers/EnvProvider';
import { useHookContext } from './HookProvider';

export function DeleteHook({
  hookId, className, children, onDelete,
}: {
  hookId: string;
  children: any;
  className?: string;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useLoading(false);
  const env = useEnv();
  const { context } = useHookContext();

  const remove = () => {
    setLoading(true);
    return axios
      .delete(`${env.MELI_SERVER_URL}/api/v1/${context}/hooks/${hookId}`)
      .then(() => {
        setIsOpen(false);
        onDelete();
      })
      .catch(err => {
        toast(`Could not delete hook: ${err}`, {
          type: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete hook"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this hook ?</p>
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
            onClick={remove}
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