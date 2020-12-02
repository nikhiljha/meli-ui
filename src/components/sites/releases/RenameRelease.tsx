import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '../../../commons/components/Button';
import { axios } from '../../../providers/axios';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { useEnv } from '../../../providers/EnvProvider';
import { Release } from './release';
import { ReleaseNameInput } from './ReleaseNameInput';
import { useLoading } from '../../../commons/hooks/use-loading';

function ModalContent({ releaseId, onRenamed }: {
  releaseId: string;
  onRenamed: (release: Release) => void;
}) {
  const env = useEnv();
  const methods = useForm({
    mode: 'onChange',
  });
  const [loading, setLoading] = useLoading(false);
  const { handleSubmit, formState: { isDirty } } = methods;

  const onChange = formData => axios
    .put<Release>(`${env.MELI_SERVER_URL}/api/v1/releases/${releaseId}`, formData)
    .then(({ data }) => data)
    .then(onRenamed)
    .catch(err => {
      toast(`Could not rename release: ${err}`, {
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
        <ReleaseNameInput setInputRef={setInputRef} />
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

export function RenameRelease({
  children, className, releaseId, onRenamed,
}: {
  children;
  className?;
  releaseId: string;
  onRenamed: (release: Release) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const renamed = val => {
    onRenamed(val);
    closeModal();
  };

  return (
    <>
      <div
        onClick={openModal}
        className={className}
      >
        {children}
      </div>
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Rename release">
        <ModalContent onRenamed={renamed} releaseId={releaseId} />
      </CardModal>
    </>
  );
}
