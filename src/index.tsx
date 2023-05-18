import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import {Provider} from "react-redux";
import {combineReducers} from "redux";
import store from "./services/store";
import {loadUserData} from "./services/rest/security-helper";
import {loggedIn} from "./services/actions/users";
import rootReducer from "./reducers";

const AppReducer = combineReducers({
    rootReducer,

})

loadUserData()
    .then(info => {
        console.log('Loaded data: ' + JSON.stringify(info));
        return info.user && info.authentication ? store.dispatch(loggedIn({
            init(_data?: any): void {
            }, toJSON(data?: any): any {
            },
            user: info.user,
            authenticationInformation: info.authentication
        })) : false
    })
    .catch(e => console.log(e))

const render = () => {
    const App = require("./App").default;
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById("root")
    );
};


render();

serviceWorkerRegistration.unregister();