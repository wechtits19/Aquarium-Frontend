import React, {Component, FunctionComponent} from "react";
import {Route, Redirect, RouteProps} from "react-router";
import {ConnectedComponent, useSelector} from "react-redux";
import {isNotExpired} from "../services/rest/security-helper";
import {RootState} from "../reducers";
import {AuthenticationInformation} from "../services/rest/interface";

export interface OwnProps extends RouteProps {
    extraArgs?: { [index: string]: any }
}

export const SecureRoute: FunctionComponent<OwnProps> = ({component, extraArgs, ...rest}: OwnProps) => {

    const token = useSelector<RootState, AuthenticationInformation | undefined>(state => state.user.authenticationInformation);

    return <Route {...rest} render={props => {
        if (isNotExpired(token)) {
            if (typeof component === 'function') {
                const FC = component as FunctionComponent<typeof props>
                return <FC {...props} {...extraArgs} />
            } else if (typeof component === 'object' && 'WrappedComponent' in component && typeof component['WrappedComponent'] === 'function') {
                const CC = component as ConnectedComponent<FunctionComponent, typeof props>
                return <CC {...props} {...extraArgs} />
            } else {
                return <Component {...props} {...extraArgs} />
            }
        } else {
            return <Redirect to="/login" from={props.location.pathname}/>
        }
    }
    }/>
}