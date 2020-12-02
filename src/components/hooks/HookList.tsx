import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { Link, useRouteMatch } from 'react-router-dom';
import styles from './HookList.module.scss';
import { EmptyList } from '../../commons/components/EmptyList';
import { axios } from '../../providers/axios';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { useLoading } from '../../commons/hooks/use-loading';
import { useEnv } from '../../providers/EnvProvider';
import { useHookContext } from './HookProvider';
import { Hook } from './hook';
import { HookIcon } from '../icons/HookIcon';

function sortHooks(a: Hook, b: Hook): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function HookList() {
  const { url } = useRouteMatch();
  const { context } = useHookContext();

  const env = useEnv();
  const [loading, setLoading] = useLoading(true);
  const [error, setError] = useState();
  const [hooks, setHooks] = useState<Hook[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios.get<Hook[]>(`${env.MELI_SERVER_URL}/api/v1/${context}/hooks`)
      .then(({ data }) => data.sort(sortHooks))
      .then(setHooks)
      .catch(setError)
      .catch(err => toast(`Could not list hooks: ${err}`, {
        type: 'error',
      }))
      .finally(() => setLoading(false));
  }, [env, setLoading, context]);

  const emptyList = (
    <EmptyList
      icon={<HookIcon />}
      title="No hooks"
    >
      <p>There are no hooks yet</p>
      <Link to={`${url}/add`}>
        <button type="button" className="btn btn-primary">
          Add hook
        </button>
      </Link>
    </EmptyList>
  );

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <>
      {hooks.length === 0 ? (
        emptyList
      ) : (
        <ul className="list-group">
          <Link
            to={`${url}/add`}
            className={classNames('list-group-item list-group-item-action', styles.add)}
          >
            Add hook
          </Link>
          {hooks.map(hook => (
            <Link
              key={hook._id}
              to={`${url}/${hook._id}`}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div className="flex-grow-1 d-flex align-items-center">
                {/* TODO status */}
                <code>{hook.type}</code>
                <strong className="mr-3">{hook.name}</strong>
              </div>
            </Link>
          ))}
        </ul>
      )}
    </>
  );
}