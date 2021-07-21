import React from 'react';
import { Route, Redirect, useLocation } from 'wouter';

import AppPage from 'pages/App';
import ProjectsPage from 'pages/Projects';

import Footer from 'pages/footer';
import DomainsPage from './Domains';
import TimeTravelPage from './TimeTravel';
import storage from 'libs/storage';

function Routes () {
  const choosingProject = storage.getProject();
  const [location] = useLocation();
  if (!choosingProject && location !== '/projects') return <Redirect to='/projects' />;
  return (
    <>
      <Route path="/">
        <AppPage />
      </Route>
      <Route path="/projects">
        <ProjectsPage />
      </Route>
      <Route path="/domains">
        <DomainsPage />
      </Route>
      <Route path="/timeTravel">
        <TimeTravelPage />
      </Route>
      <Footer />
    </>
  );
}

export default Routes;
