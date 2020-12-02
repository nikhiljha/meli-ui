import { useCallback, useState } from 'react';
import { ReactState } from '../types/react-state';
import { useMounted } from './use-mounted';

export function useLoading(initialValue?: boolean): ReactState<boolean> {
  const mounted = useMounted();
  const [loading, _setLoading] = useState(initialValue);

  const setLoading = useCallback((val: boolean) => {
    if (mounted && mounted.current) {
      _setLoading(val);
    }
  }, [mounted]);

  return [loading, setLoading];
}
