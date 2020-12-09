import { Redirect, Route } from 'react-router-dom';
import React from 'react';
import { Loader } from './Loader';

export function PrivateRoute({
  component: Component, authed, redirectTo, loading, ...rest
}: {
  component: any;
  authed: any;
  loading: boolean;
  redirectTo: string;
  [prop: string]: any;
}) {
  return (
    <Route
      {...rest}
      render={(props: any) => (
        loading ? (
          <Loader />
        ) : authed ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: redirectTo,
            state: {
              from: props.location,
            },
          }}
          />
        )
      )}
    />
  );
}
