import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useSentry } from './SentryProvider';
import { Tooltip, tooltipToggle } from '../components/Tooltip';

export function SentryIcon() {
  const { enabled, openModal } = useSentry();
  const [uid] = useState(uniqueId());

  return (
    <>
      <FontAwesomeIcon
        {...tooltipToggle(uid)}
        icon={faShieldAlt}
        className={classNames('cursor-pointer', enabled ? 'text-success' : 'text-danger')}
        onClick={openModal}
      />
      <Tooltip id={uid}>
        Sentry is
        {' '}
        {enabled ? 'enabled' : 'disabled'}
      </Tooltip>
    </>
  );
}
