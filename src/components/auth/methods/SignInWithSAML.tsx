import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styles from './SignInWithSAML.module.scss';
import { useEnv } from '../../../providers/EnvProvider';
import { SignInButton } from './SignInButton';

export function SignInWithSAML({ className }: {
  className?: any;
}) {
  const env = useEnv();
  return (
    <a
      href={`${env.MELI_API_URL}/auth/saml`}
      className={className}
    >
      <SignInButton
        icon={(
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faKey} className="d-block w-100" />
          </div>
        )}
        label="Single Signon"
        className={styles.SSO}
      />
    </a>
  );
}
