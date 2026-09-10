import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Generic realtime Firestore collection hook for the admin app. Always
// reflects live data — never mock/fake data, per the admin brief.
export function useAdminCollection(collectionName, { orderByField, direction = 'desc' } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const ref = collection(db, collectionName);
    const q = orderByField ? query(ref, orderBy(orderByField, direction)) : ref;

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error(`[ABIXMART Admin] ${collectionName} listener failed:`, err?.code, err?.message);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, orderByField, direction]);

  return { data, loading, error };
}