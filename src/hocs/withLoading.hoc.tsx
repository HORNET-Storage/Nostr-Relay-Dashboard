import React, { Suspense } from 'react';
import { Loading } from '@app/components/common/Loading/Loading';

type WithLoadingProps<T> = T & { children?: React.ReactNode };

const withLoading = <T extends object>(Component: React.ComponentType<T>) => {
  const WithLoadingComponent = (props: WithLoadingProps<T>) => {
    console.log(`Rendering withLoading for`, Component.displayName || Component.name || 'UnnamedComponent');
    return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    );
  };

  // Set a display name for easier debugging
  WithLoadingComponent.displayName = `WithLoading(${Component.displayName || Component.name || 'UnnamedComponent'})`;

  return WithLoadingComponent;
};

export { withLoading };

