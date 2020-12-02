import { BranchRedirect } from './branch-redirect';

export interface Branch {
  _id: string;
  name: string;
  release?: string;
  hasPassword?: string;
  url: string;
  redirects: BranchRedirect[];
}
