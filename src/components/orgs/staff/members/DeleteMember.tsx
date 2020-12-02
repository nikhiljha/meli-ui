import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../../../commons/components/Button';
import { axios } from '../../../../providers/axios';
import { CardModal } from '../../../../commons/components/modals/CardModal';
import { useEnv } from '../../../../providers/EnvProvider';
import { useLoading } from '../../../../commons/hooks/use-loading';

export function DeleteMember({
  memberId, className, children, onDelete,
}: {
  memberId: string;
  children: any;
  className?: string;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useLoading(false);
  const env = useEnv();

  const deleteMember = () => {
    setLoading(true);
    return axios
      .delete(`${env.MELI_SERVER_URL}/api/v1/members/${memberId}`)
      .then(() => {
        setIsOpen(false);
        onDelete();
      })
      .catch(err => {
        toast(`Could not delete member: ${err}`, {
          type: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete member"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this member ?</p>
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
            onClick={deleteMember}
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