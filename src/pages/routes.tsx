import React from 'react';
import { Route, Redirect, useLocation } from 'wouter';

import AppPage from 'pages/App';
import ProjectsPage from 'pages/Projects';

import Footer from 'pages/footer';
import DomainsPage from './Domains';
import storage from 'libs/storage';

function Routes () {
  const cookie = storage.getProject();
  const [location] = useLocation();
  if (!cookie && location !== '/projects') return <Redirect to='/projects' />;
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
      <Footer />
    </>
  );
}

export default Routes;
