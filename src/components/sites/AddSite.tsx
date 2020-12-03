import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { uniqueId } from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { routerHistory } from '../../providers/history';
import { Tooltip, tooltipToggle } from '../../commons/components/Tooltip';
import { SiteNameInput } from './settings/SiteNameInput';
import { Button } from '../../commons/components/Button';
import { CardModal } from '../../commons/components/modals/CardModal';
import { Site } from './site';
import { useLoading } from '../../commons/hooks/use-loading';
import { useCurrentOrg } from '../../providers/OrgProvider';

function AddSiteModal({ teamId, closeModal }: { teamId; closeModal }) {
  const env = useEnv();
  const methods = useForm({
    mode: 'onChange',
  });
  const [loading, setLoading] = useLoading(false);
  const { handleSubmit, formState: { isDirty } } = methods;

  const onChange = formData => axios
    .post<Site>(`${env.MELI_API_URL}/api/v1/teams/${teamId}/sites`, formData)
    .then(({ data }) => {
      routerHistory.push(`/sites/${data._id}`);
    })
    .finally(() => {
      closeModal();
    })
    .catch(err => {
      toast(`Could not create site: ${err}`, {
        type: 'error',
      });
    });

  const onSubmit = data => {
    setLoading(true);
    onChange(data).finally(() => setLoading(false));
  };

  const [inputRef, setInputRef] = useState<HTMLInputElement>();

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
    }
  }, [inputRef]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SiteNameInput setInputRef={setInputRef} />
        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            className="btn btn-primary"
            loading={loading}
            disabled={!isDirty}
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export function AddSite({
  teamId, children, className, tooltip = true,
}: {
  teamId: string;
  children;
  className?;
  tooltip?: boolean;
}) {
  const [uid] = useState(uniqueId());
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { currentOrg } = useCurrentOrg();

  return (
    <>
      {currentOrg.isAdminOrOwner && (
        <div
          onClick={openModal}
          className={className}
          {...tooltipToggle(uid)}
        >
          {children}
        </div>
      )}
      {tooltip && (
        <Tooltip id={uid} className="d-flex align-items-center">
          Add site
        </Tooltip>
      )}
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Add site">
        <AddSiteModal closeModal={closeModal} teamId={teamId} />
      </CardModal>
    </>
  );
}
