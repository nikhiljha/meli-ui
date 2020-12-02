import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import { SentryIcon } from '../commons/sentry/SentryIcon';
import { ExternalLink } from '../commons/components/ExternalLink';

export function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div>
          <ExternalLink
            href="https://twitter.com/MELI_sh"
            className={styles.link}
          >
            Twitter
          </ExternalLink>
          <Link
            to="/legal"
            className={styles.link}
          >
            Legal
          </Link>
        </div>
        <div className="text-muted d-flex align-items-center">
          <SentryIcon />
          <div className="ml-2">
            v
            {process.env.REACT_APP_VERSION}
          </div>
        </div>
      </footer>
    </>
  );
}
