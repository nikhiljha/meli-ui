export interface Release {
  _id: string;
  name: string;
  date: Date;
  siteId: string;
  branches?: string[];
}
