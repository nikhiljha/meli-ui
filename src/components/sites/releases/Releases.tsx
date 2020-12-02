import React, {
  useEffect, useRef, useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EmptyList } from '../../../commons/components/EmptyList';
import { LoadMore } from '../../../commons/components/LoadMore';
import { AlertError } from '../../../commons/components/AlertError';
import { useEnv } from '../../../providers/EnvProvider';
import { getReleases, ReleaseSearchQuery } from './get-releases';
import { Release } from './release';
import { CodeSnippet } from '../../../commons/components/CodeSnippet';
import { useReleaseUploaded } from '../live-site';
import { ReleaseIcon } from '../../icons/ReleaseIcon';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { ReleaseView } from './ReleaseView';
import { SearchInput } from './SearchInput';
import { useLoading } from '../../../commons/hooks/use-loading';
import { useBranch } from '../branches/BranchView';

function UploadReleaseSnippet({ siteId, className }: { siteId: string; className? }) {
  const env = useEnv();
  const snippet = `npx @meli/cli upload \\
    --url ${env.MELI_SERVER_URL} \\
    --site ${siteId} \\
    --token <token> \\
    <path>`;
  return (
    <CodeSnippet language="shell" className={className}>{snippet}</CodeSnippet>
  );
}

function HowToUpload({ children }: { children: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        className="link"
        onClick={e => {
          e.preventDefault();
          openModal();
        }}
      >
        How to upload
      </button>
      <CardModal isOpen={isOpen} closeModal={closeModal} title="How to upload">
        {children}
      </CardModal>
    </>
  );
}

export function Releases() {
  const env = useEnv();
  const { siteId } = useParams();
  const branchContext = useBranch();
  const [releaseAdded] = useReleaseUploaded(siteId);
  const [loading, setLoading] = useLoading(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<Release[]>([]);
  const itemsRef = useRef<Release[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const searchQueryRef = useRef<ReleaseSearchQuery>({
    search: '',
    page: 0,
    size: 10,
    branch: branchContext?.branch?._id,
  });
  const [searchQuery, setSearchQuery] = useState<ReleaseSearchQuery>(searchQueryRef.current);

  useEffect(() => {
    // prevents duplicate calls when search input is initialized
    if (search === searchQueryRef.current.search || branchContext?.branch?._id === searchQueryRef.current.branch) {
      return;
    }

    let query: ReleaseSearchQuery = {
      ...searchQueryRef.current,
      search,
    };

    // start to search
    if (search && search !== searchQueryRef.current.search) {
      query = {
        ...query,
        page: 0,
      };
    }

    // stop searching (cleared search)
    if (searchQueryRef.current.search && !search) {
      query = {
        ...query,
        page: 0,
      };
      itemsRef.current = [];
    }

    searchQueryRef.current = query;
    setSearchQuery(query);
  }, [search, branchContext]);

  useEffect(() => {
    if (searchQuery.search) {
      setSearching(true);
    }

    setError(undefined);
    setLoading(true);

    getReleases(env, siteId, searchQuery)
      .then(data => {
        itemsRef.current = searchQuery.search ? data.items : [...itemsRef.current, ...data.items];
        setItems(itemsRef.current);
        setCanLoadMore(itemsRef.current.length !== data.count);
      })
      .catch(setError)
      .catch(err => {
        toast(`Could not list releases: ${err}`, {
          type: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
        setSearching(false);
      });
  }, [env, siteId, searchQuery, setLoading]);

  useEffect(() => {
    if (releaseAdded) {
      itemsRef.current = [releaseAdded, ...itemsRef.current];
      setItems(itemsRef.current);
    }
  }, [releaseAdded]);

  const nextPage = () => {
    setSearchQuery({
      ...searchQuery,
      page: searchQuery.page + 1,
    });
  };

  const uploadSnippet = (
    <UploadReleaseSnippet siteId={siteId} />
  );

  const emptyList = (
    <EmptyList
      icon={<ReleaseIcon />}
      title="No releases"
    >
      <p>There are no releases yet, use our CLI to upload one</p>
      {uploadSnippet}
    </EmptyList>
  );

  const onDelete = (tokenId: string) => {
    setItems(items.filter(({ _id }) => _id !== tokenId));
  };

  const onChange = (changed: Release) => {
    setItems(items.map(item => (item._id === changed._id ? changed : item)));
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <SearchInput
          loading={searching}
          search={searchQuery.search}
          setSearch={setSearch}
          placeholder="Search releases"
        />
        <HowToUpload>
          {uploadSnippet}
        </HowToUpload>
      </div>
      {items.length === 0 ? (
        searchQuery.search ? (
          <>No search results found</>
        ) : (
          emptyList
        )
      ) : (
        <ul className="list-group">
          {items.map(release => (
            <ReleaseView
              key={release._id}
              siteId={siteId}
              release={release}
              onDelete={() => onDelete(release._id)}
              onChange={onChange}
            />
          ))}
          {canLoadMore && (
            <LoadMore
              onClick={nextPage}
              loading={loading}
              disabled={loading}
            />
          )}
          {error && (
            <AlertError error={error} className="mt-4" />
          )}
        </ul>
      )}
    </>
  );
}