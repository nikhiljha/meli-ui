import React, {
  useEffect, useRef, useState,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uniqueId } from 'lodash';
import { useEnv } from '../../providers/EnvProvider';
import { Loader } from '../../commons/components/Loader';
import { EmptyList } from '../../commons/components/EmptyList';
import { getTeamSites } from './get-team-sites';
import { SiteCard } from './SiteCard';
import { AlertError } from '../../commons/components/AlertError';
import { Site } from './site';
import { PaginationData } from '../../commons/components/Pagination';
import { LoadMore } from '../../commons/components/LoadMore';
import { AddSite } from './AddSite';
import { useSiteAdded } from './live-site';
import { SiteIcon } from '../icons/SiteIcon';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export function SiteList() {
  const { teamId } = useParams();
  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<Site[]>();
  const itemsRef = useRef<Site[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 0, size: 10,
  });
  const [addedSite] = useSiteAdded();
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    getTeamSites(env, teamId, '', pagination)
      .then(data => {
        itemsRef.current.push(...data.items);
        setItems(itemsRef.current);
        setHasMore(itemsRef.current.length < data.count);
      })
      .catch(setError)
      .catch(err => toast(`Could not list repos: ${err}`, {
        type: 'error',
      }))
      .finally(() => setLoading(false));
  }, [env, pagination, teamId, setLoading]);

  useEffect(() => {
    if (addedSite) {
      setItems([addedSite, ...itemsRef.current]);
    }
  }, [addedSite]);

  const nextPage = () => {
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  const emptyList = (
    <EmptyList
      icon={<SiteIcon />}
      title="No sites"
    >
      <AddSite teamId={teamId}>
        <button type="button" className="btn btn-primary d-block">
          Add site
        </button>
      </AddSite>
    </EmptyList>
  );

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <div className="mt-5" key={uniqueId()}>
      {items.length === 0 ? (
        emptyList
      ) : (
        <>
          <h2>Sites</h2>
          {items.map(site => (
            <Link to={`/sites/${site._id}`} className="d-block" key={site._id}>
              <SiteCard site={site} />
            </Link>
          ))}
        </>
      )}
      {hasMore && (
        <LoadMore
          onClick={nextPage}
          loading={loading}
          disabled={loading}
        />
      )}
    </div>
  );
}
