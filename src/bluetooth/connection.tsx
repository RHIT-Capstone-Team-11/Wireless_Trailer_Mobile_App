import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { connectToTrailer } from './manager';

export type BluetoothStatus = 'disconnected' | 'connecting' | 'connected';

type BluetoothContextValue = {
  status: BluetoothStatus;
  /** Why the last attempt failed or the link dropped, or null. */
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const BluetoothContext = createContext<BluetoothContextValue | null>(null);

export function useBluetooth() {
  const value = use(BluetoothContext);
  if (!value) throw new Error('useBluetooth must be used inside <BluetoothProvider />');
  return value;
}

export function BluetoothProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<BluetoothStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const disconnectRef = useRef<(() => void) | null>(null);
  const isMounted = useRef(true);

  // This provider unmounts on sign-out, which should also drop the link.
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      disconnectRef.current?.();
      disconnectRef.current = null;
    };
  }, []);

  const connect = useCallback(async () => {
    setStatus('connecting');
    setError(null);
    try {
      const disconnectTrailer = await connectToTrailer(() => {
        disconnectRef.current = null;
        setStatus('disconnected');
        setError('Connection to the trailer was lost.');
      });
      if (!isMounted.current) {
        disconnectTrailer();
        return;
      }
      disconnectRef.current = disconnectTrailer;
      setStatus('connected');
    } catch (e) {
      console.warn('Bluetooth connect failed:', e);
      setStatus('disconnected');
      // The library rejects with raw strings and objects, which aren't fit to show.
      setError(e instanceof Error ? e.message : "Couldn't connect to the trailer. Try again.");
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectRef.current?.();
    disconnectRef.current = null;
    setStatus('disconnected');
    setError(null);
  }, []);

  const value = useMemo<BluetoothContextValue>(
    () => ({ status, error, connect, disconnect }),
    [status, error, connect, disconnect],
  );

  return <BluetoothContext value={value}>{children}</BluetoothContext>;
}
