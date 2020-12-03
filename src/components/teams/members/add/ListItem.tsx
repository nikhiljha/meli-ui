import React from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { useEnv } from '../../../../providers/EnvProvider';
import { axios } from '../../../../providers/axios';
import { Loader } from '../../../../commons/components/Loader';
import { OrgMember } from '../../../orgs/staff/members/org-member';
import { useLoading } from '../../../../commons/hooks/use-loading';

export function ListItem({
  teamId, member, onAdded,
}: {
  teamId: string;
  member: OrgMember;
  onAdded: () => void;
}) {
  const [loading, setLoading] = useLoading(false);
  const env = useEnv();

  const select = () => {
    setLoading(true);
    return axios
      .put(`${env.MELI_API_URL}/api/v1/teams/${teamId}/members/${member._id}`, {
        member: member._id,
      })
      .then(() => {
        onAdded();
      })
      .catch(err => {
        toast(`Could not select branch: ${err}`, {
          type: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      className={classNames(
        'list-group-item list-group-item-action d-flex justify-content-between align-items-center bg-light',
      )}
      onClick={() => select()}
    >
      <strong>{member.name}</strong>
      <div>
        {loading && (
          <Loader />
        )}
      </div>
    </div>
  );
}
