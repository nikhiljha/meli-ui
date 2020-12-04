import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import classNames from 'classnames';
import giteaLogo from '../../assets/images/git-servers/gitea.svg';
import githubLogo from '../../assets/images/git-servers/github.svg';
import gitlabLogo from '../../assets/images/git-servers/gitlab.svg';
import { Loader } from '../../commons/components/Loader';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import styles from './SignIn.module.scss';
import { ErrorIcon } from '../../commons/components/ErrorIcon';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

function SignInWithGitea() {
  const env = useEnv();
  return (
    <a
      className={classNames(styles.button, styles.gitea)}
      href={`${env.MELI_API_URL}/auth/gitea`}
    >
      <div className={styles.iconContainer}>
        <img
          src={giteaLogo}
          className={styles.icon}
          alt="gitea-logo"
        />
      </div>
      <span className={styles.label}>Gitea</span>
    </a>
  );
}

function SignInWithGitlab() {
  const env = useEnv();
  return (
    <a
      className={classNames(styles.button, styles.gitlab)}
      href={`${env.MELI_API_URL}/auth/gitlab`}
    >
      <div className={styles.iconContainer}>
        <img
          src={gitlabLogo}
          className={styles.icon}
          alt="gitlab-logo"
        />
      </div>
      <span className={styles.label}>Gitlab</span>
    </a>
  );
}

function SignInWithGithub() {
  const env = useEnv();
  return (
    <a
      className={classNames(styles.button, styles.github)}
      href={`${env.MELI_API_URL}/auth/github`}
    >
      <div className={styles.iconContainer}>
        <img
          src={githubLogo}
          className={styles.icon}
          alt="github-logo"
        />
      </div>
      <span className={styles.label}>Github</span>
    </a>
  );
}

function SignInWithGoogle() {
  const env = useEnv();
  return (
    <a
      className={classNames(styles.button, styles.google)}
      href={`${env.MELI_API_URL}/auth/google`}
    >
      <div className={styles.iconContainer}>
        <FontAwesomeIcon
          icon={faGoogle}
          className={styles.icon}
        />
      </div>
      <span className={styles.label}>Google</span>
    </a>
  );
}

export function SignIn() {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [signInMethods, setSignInMethods] = useState<string[]>();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${env.MELI_API_URL}/auth/methods`)
      .then(({ data }) => data)
      .then(setSignInMethods)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, setLoading]);

  return loading ? (
    <Loader />
  ) : error ? (
    <ErrorIcon error={error} />
  ) : (
    <div className={classNames(styles.container)}>
      <div className="container">
        <div className="row">
          <div className="col d-flex justify-content-center">
            <div className={styles.grid}>
              <div className={classNames(styles.method, styles.brand)}>
                <h1 className={styles.title}>
                  meli
                </h1>
                <p className="text-center mb-4">
                  Deploy, now.
                </p>
              </div>
              {signInMethods.includes('gitlab') && (
                <SignInWithGitlab />
              )}
              {signInMethods.includes('github') && (
                <SignInWithGithub />
              )}
              {signInMethods.includes('gitea') && (
                <SignInWithGitea />
              )}
              {signInMethods.includes('google') && (
                <SignInWithGoogle />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
