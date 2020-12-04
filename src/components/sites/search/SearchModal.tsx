import React, {
  useEffect, useRef, useState,
} from 'react';
import { BehaviorSubject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, filter,
} from 'rxjs/operators';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { toast } from 'react-toastify';
import styles from './SearchModal.module.scss';
import { useEnv } from '../../../providers/EnvProvider';
import { routerHistory } from '../../../providers/history';
import { Loader } from '../../../commons/components/Loader';
import { getTeamSites } from '../get-team-sites';
import { SiteCard } from '../SiteCard';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';

export function SearchModal({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) {
  const env = useEnv();
  const search$ = useRef(new BehaviorSubject(''));
  const [loading, setLoading] = useMountedState(false);
  const [sites, setRepos] = useState<any[]>();
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement>();

  useEffect(() => {
    if (isOpen) {
      const subs = search$.current
        .pipe(
          filter(value => !value || value.length >= 3),
          debounceTime(200),
          distinctUntilChanged(),
        )
        .subscribe(value => {
          setLoading(true);
          getTeamSites(env, value)
            .then(({ items }) => items)
            .then(setRepos)
            .catch(err => toast(`Could not get repos: ${err}`, {
              type: 'error',
            }))
            .finally(() => setLoading(false));
        });
      return () => {
        subs.unsubscribe();
      };
    }
  }, [search$, env, isOpen, setLoading]);

  useEffect(() => {
    if (isOpen) {
      if (searchInputRef) {
        searchInputRef.focus();
      }
    }
  }, [isOpen, searchInputRef]);

  const onItemClick = site => {
    routerHistory.push(`/sites/${site._id}`);
    closeModal();
  };

  return (
    <CardModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={styles.search}
      title="Search"
    >
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-center position-relative">
              <input
                type="text"
                ref={setSearchInputRef}
                className="form-control"
                onChange={e => search$.current.next(e.target.value)}
                placeholder="Search sites"
              />
              {loading && (
                <div className={styles.loader}>
                  <Loader />
                </div>
              )}
            </div>
            {sites && (
              <div className="mt-3">
                {sites.length === 0 && (
                  <strong>No results</strong>
                )}
                <TransitionGroup>
                  {sites.length !== 0 && sites.map(site => (
                    <CSSTransition key={site._id} timeout={500} classNames="fade-down">
                      <div className="mb-2" onClick={() => onItemClick(site)}>
                        <SiteCard site={site} className="bg-light" />
                      </div>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardModal>
  );
}
