import React from 'react';
import { Route, Redirect } from 'wouter';

import AppPage from 'pages/App';
import ProjectsPage from 'pages/Projects';

import Footer from 'pages/footer';
import { getCookie } from 'libs/cookie';

function Routes () {
  const cookie = getCookie('project');
  console.log(cookie);
  if (!cookie) return <Redirect to='/projects' />;
  return (
    <>
      <Route path="/">
        <AppPage />
      </Route>
      <Route path="/projects">
        <ProjectsPage />
      </Route>
      <Footer />
    </>
  );
}

export default Routes;
