import React from 'react';
import storage from 'libs/storage';

export const usePacketsPerPage = (projectName: string, origin: string):
[number, React.Dispatch<React.SetStateAction<number>>] => {
  const [ppp, setPPP] = React.useState(15);

  React.useEffect(() => {
    const loadPPP = async () => {
      const numPPP = await storage.getNumPacketsOfOriginByProject(origin);
      setPPP(numPPP);
    };
    loadPPP();
  }, [projectName, origin]);

  return [ppp, setPPP];
};
