import React from 'react';
import * as Validator from '../../services/utils/validators';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonPage
} from '@ionic/react';
import {useDispatch} from 'react-redux';
import {BuildForm, FormDescription} from "../../services/utils/form-builder";
import {RouteComponentProps} from "react-router";
import {LoginRequest, UserClient, UserResponse} from "../../services/rest/interface";
import {loggedIn} from "../../services/actions/users";
import {executeDelayed} from "../../services/utils/async-helpers";
import {IConfig} from "../../services/rest/iconfig";
import config from '../../services/rest/server-config';
import {AppStorage} from "../../services/utils/appstorage";

type formData = Readonly<LoginRequest>;

const formDescription: FormDescription<formData> = {
    name: 'login',
    fields: [
        {
            name: 'username', label: 'Email', type: 'email',
            position: 'floating', color: 'primary', validators: [Validator.required, Validator.email]
        },
        {
            name: 'password', label: 'Password', type: 'password',
            position: 'floating', color: 'primary', validators: [Validator.required]
        }
    ],
    submitLabel: 'Login'
}

const {Form, loading, error} = BuildForm(formDescription);

export const Login: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

    const dispatch = useDispatch();

    const accessHeader = new IConfig();
    const userClient = new UserClient(accessHeader, config.host);
    const submit = (loginData: LoginRequest) => {
        dispatch(loading(true));
        userClient.login(loginData)
            .then((loginInfo) => {
                if (loginInfo.hasError) {
                    dispatch(error('Username or Password are incorrect'))
                    return;
                }
                const authresponse = loggedIn(loginInfo);
                dispatch(authresponse);

                const jwtStore = new AppStorage();

                Promise.all([
                    jwtStore.set('user',
                        JSON.stringify((loginInfo.data?.user && typeof loginInfo.data?.user === 'object'
                            ? loginInfo.data?.user : {}))),
                    jwtStore.set('authentication',
                        JSON.stringify((loginInfo.data?.authenticationInformation && typeof loginInfo.data?.authenticationInformation === 'object'
                            ? loginInfo.data?.authenticationInformation : {})))])
                    .then(() => {
                        executeDelayed(200, () => props.history.replace('/home'))
                    })

            })
            .catch((err: Error) => {
                dispatch(error('Error while logging in: ' + err.message));
            })
            .finally(() => dispatch(loading(false)))
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <Form handleSubmit={submit}/>
            </IonContent>
        </IonPage>
    );
}

export default Login