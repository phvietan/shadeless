/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, Redirect, useLocation, Switch } from 'wouter';

import AppPage from 'pages/App';
import ProjectsPage from 'pages/Projects';

import Footer from 'pages/common/footer';
import DomainsPage from './Domains';
import TimeTravelPage from './TimeTravel';
import storage from 'libs/storage';
import BackendNotUp from './Backend-not-up';
import Page404 from './Page404';
import ConfigProjectPage from './ConfigProject';
import { notify } from 'libs/notify';
import { useToast } from '@chakra-ui/react';

const healthCheckApi = async (): Promise<{ status: number, data: string }> => {
  try {
    const resp = await fetch(process.env.REACT_APP_BACKEND_URL + '/healthcheck');
    return {
      status: resp.status,
      data: await resp.text(),
    };
  } catch (err) {
    return {
      status: 500,
      data: 'no',
    };
  }
};

enum ServerStatus {
  REQUESTING = 'requesting',
  NOT_UP = 'not up',
  UP = 'up',
};

function Routes () {
  const [isBackendUp, setIsBackendUp] = React.useState<ServerStatus>(ServerStatus.REQUESTING);
  const choosingProject = storage.getProject();
  const [location] = useLocation();
  const toast = useToast();

  React.useEffect(() => {
    (async function check () {
      const { status, data } = await healthCheckApi();
      if (data === 'Health check ok' && status === 200) {
        setIsBackendUp(ServerStatus.UP);
      } else {
        setIsBackendUp(ServerStatus.NOT_UP);
      }
    })();
  }, []);

  if (isBackendUp === ServerStatus.NOT_UP) {
    return <BackendNotUp />;
  }

  if (!choosingProject && location !== '/projects') {
    notify(toast, { statusCode: 500, data: '', error: 'You must choose project before doing anything else' });
    return <Redirect to='/projects' />;
  }
  return (
    <Switch>
      <Route path="/">
        <AppPage />
        <Footer />
      </Route>
      <Route path="/projects">
        <ProjectsPage />
        <Footer />
      </Route>
      <Route path="/projects/:projectName">
        {params =>
          <>
            <ConfigProjectPage projectName={params.projectName} />
            <Footer />
          </>
        }
      </Route>
      <Route path="/domains">
        <DomainsPage />
        <Footer />
      </Route>
      <Route path="/timeTravel">
        <TimeTravelPage />
        <Footer />
      </Route>
      <Route>
        <Page404 />
        <Footer />
      </Route>
    </Switch>
  );
}

export default Routes;
