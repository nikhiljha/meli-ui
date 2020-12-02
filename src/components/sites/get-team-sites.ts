import { axios } from '../../providers/axios';
import { Env } from '../../providers/EnvProvider';
import { Site } from './site';
import { Page } from '../../commons/types/page';
import { PaginationData } from '../../commons/components/Pagination';

export function getTeamSites(
  env: Env,
  teamId: string,
  search?: string,
  pagination?: PaginationData,
): Promise<Page<Site>> {
  return axios
    .get(`${env.MELI_SERVER_URL}/api/v1/teams/${teamId}/sites`)
    .then(res => res.data);
}
