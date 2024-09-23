import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

// pages
import test from "./test";
import Dashboard from "./Dashboard";
import Cameras from "./Cameras";
import Lands from "./Lands";
import TasksScenarios from "./TasksScenarios";
import Log from "./Log";
import Settings from "./Settings";
import Mapping from "./Mapping";

import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// components
import Sidebar from "../components/Sidebar";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (<><Component {...props} /> </>)} />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => (
      <>
        {/*<Preloader show={loaded ? false : true} />*/}
        <Sidebar />
        <main className="content">
          <Component {...props} />
        </main>
      </>
    )}
    />
  );
};

export default () => (
  <Switch>
    <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
    <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
    <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />
    <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} />
    <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} />

    {/* pages */}
    <RouteWithSidebar exact path={Routes.test.path} component={test} />
    <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={Dashboard} />
    <RouteWithSidebar exact path={Routes.Cameras.path} component={Cameras} />
    <RouteWithSidebar exact path={Routes.Lands.path} component={Lands} />
    <RouteWithSidebar exact path={Routes.TasksScenarios.path} component={TasksScenarios} />
    <RouteWithSidebar exact path={Routes.Log.path} component={Log} />
    <RouteWithSidebar exact path={Routes.Settings.path} component={Settings} />
    <RouteWithSidebar exact path={Routes.Mapping.path} component={Mapping} />

    <Redirect to={Routes.NotFound.path} />
  </Switch>
);
