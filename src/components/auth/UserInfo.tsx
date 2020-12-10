import React, { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { uniqueId } from 'lodash';
import { useAuth } from '../../providers/AuthProvider';
import styles from './UserInfo.module.scss';
import { useCurrentOrg } from '../../providers/OrgProvider';
import { DropdownLink } from '../../commons/components/dropdown/DropdownLink';
import DropdownSeparator from '../../commons/components/dropdown/DropdownSeparator';
import { Dropdown, dropdownToggle } from '../../commons/components/dropdown/Dropdown';
import { UserIcon } from '../icons/UserIcon';
import { OrgIcon } from '../icons/OrgIcon';
import { IsAdmin } from './IsAdmin';

function shortenNameWithoutCss(str: string) {
  const name = str || '?';
  return name.length > 10 ? `${name.substr(0, 10)}...` : name;
}

export function UserInfo({ className }: {
  className?: string;
}) {
  const [uid] = useState(uniqueId());
  const { signOut, user } = useAuth();
  const { currentOrg, signOutOrg } = useCurrentOrg();
  return (
    <>
      <div
        className={classNames(styles.container, className)}
        {...dropdownToggle(uid)}
      >
        {currentOrg && (
          <div
            className={classNames(styles.bubble, styles[user.authType])}
            style={{
              backgroundColor: currentOrg.org.color,
            }}
          >
            <div>
              {currentOrg.org.name.substr(0, 1).toUpperCase()}
            </div>
          </div>
        )}
        <div className={classNames(styles.user, 'ml-3')}>
          {shortenNameWithoutCss(user.name)}
        </div>
      </div>
      <Dropdown id={uid} data-event-off="click">
        <IsAdmin>
          <DropdownLink
            icon={<FontAwesomeIcon icon={faCog} fixedWidth />}
            to="/org"
          >
            Organization Settings
          </DropdownLink>
        </IsAdmin>
        <DropdownLink
          to="/user"
          icon={<UserIcon />}
        >
          User settings
        </DropdownLink>
        <DropdownSeparator />
        {currentOrg ? (
          <DropdownLink
            icon={<OrgIcon />}
            onClick={signOutOrg}
          >
            Organizations
          </DropdownLink>
        ) : (
          <DropdownLink
            to="/orgs"
            icon={<OrgIcon />}
          >
            Organizations
          </DropdownLink>
        )}
        <DropdownLink
          icon={<FontAwesomeIcon icon={faDoorOpen} fixedWidth />}
          onClick={signOut}
        >
          Sign out
        </DropdownLink>
      </Dropdown>
    </>
  );
}
