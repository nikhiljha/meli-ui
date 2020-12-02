export interface UserInvite {
  _id: string;
  org: {
    name: string;
    color: string;
  };
  expiresAt: Date;
  memberOptions: {
    admin: boolean;
  };
}
