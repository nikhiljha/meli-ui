import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../../../commons/components/Button';
import { axios } from '../../../../providers/axios';
import { CardModal } from '../../../../commons/components/modals/CardModal';
import { useEnv } from '../../../../providers/EnvProvider';
import { useCurrentOrg } from '../../../../providers/OrgProvider';
import { useLoading } from '../../../../commons/hooks/use-loading';

export function DeleteInvite({
  inviteId, className, children, onDelete,
}: {
  inviteId: string;
  children: any;
  className?: string;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useLoading(false);
  const env = useEnv();
  const { currentOrg } = useCurrentOrg();

  const deleteInvite = () => {
    setLoading(true);
    return axios
      .delete(`${env.MELI_SERVER_URL}/api/v1/orgs/${currentOrg.org._id}/invites/${inviteId}`)
      .then(() => {
        setIsOpen(false);
        onDelete();
      })
      .catch(err => {
        toast(`Could not delete invite: ${err}`, {
          type: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete invite"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this invite ?</p>
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
            onClick={deleteInvite}
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
