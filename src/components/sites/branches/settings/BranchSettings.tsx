import React from 'react';
import { useParams } from 'react-router-dom';
import { BranchProtection } from '../BranchProtection';
import { useBranch } from '../BranchView';
import { BranchGeneralSettings } from './BranchGeneralSettings';

export function BranchSettings() {
  const { siteId } = useParams();
  const { branch, setBranch } = useBranch();
  return (
    <>
      <div className="card">
        <div className="card-header no-border">
          <BranchProtection
            siteId={siteId}
            branch={branch}
            onChange={setBranch}
          />
        </div>
      </div>

      <BranchGeneralSettings />
    </>
  );
}
