import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOpenid } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import styles from './SignInWithSSO.module.scss';
import { useEnv } from '../../../providers/EnvProvider';
import { SignInButton } from './SignInButton';

export function SignInWithSSO({ className }: {
  className?: any;
}) {
  const env = useEnv();
  return (
    <a
      href={`${env.MELI_API_URL}/auth/oidc`}
      className={className}
    >
      <SignInButton
        icon={(
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faOpenid} className="d-block w-100" />
          </div>
        )}
        label="Single Signon"
        className={styles.SSO}
      />
    </a>
  );
}
