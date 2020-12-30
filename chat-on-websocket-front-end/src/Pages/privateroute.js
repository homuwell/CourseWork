import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component = null, Render = null, ...rest }) => {
    const isAuthenticated = () => {
        return localStorage.getItem('CC_Token') !== null
    }
    return (
        <Route
            {...rest} render={props =>
            (isAuthenticated() ?
                Component ? <Component {...props} /> : rest.render(props) : <Redirect to ='/login' />)} />
    );
};

export default PrivateRoute;