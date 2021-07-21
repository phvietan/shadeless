import React from 'react';

export const useHashLocation = () => {
  const [loc, setLoc] = React.useState(location.hash.slice(1));

  React.useEffect(() => {
    const handler = () => setLoc(location.hash.slice(1));

    // subscribe on hash changes
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return loc;
};
