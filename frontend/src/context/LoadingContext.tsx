import React, { createContext, useCallback, useContext, useState } from 'react';
import { Spin } from 'antd';

type LoadingCtx = {
  show: () => void;
  hide: () => void;
  loading: boolean;
};

const LoadingContext = createContext<LoadingCtx>({
  show: () => {},
  hide: () => {},
  loading: false,
});

export const useGlobalLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [count, setCount] = useState(0);

  const show = useCallback(() => setCount((c) => c + 1), []);
  const hide = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);

  const value = { show, hide, loading: count > 0 };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {count > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // use CSS variable so overlay adapts to theme
            background: 'var(--overlay, rgba(0,0,0,0.35))',
          }}
        >
          <Spin size="large" tip="Loading..." />
        </div>
      )}
    </LoadingContext.Provider>
  );
};
