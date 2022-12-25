export interface ChangeLog {
  version: string;
  release_date: string;
  changes: { new: string[]; improved: string[]; fixed: string[] }[];
}