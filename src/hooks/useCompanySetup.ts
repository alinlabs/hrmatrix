import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export function useCompanySetup() {
  const companies = useLiveQuery(() => db.company.toArray());

  if (companies === undefined) return undefined;
  return companies.length > 0 ? companies[0] : null;
}
