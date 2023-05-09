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
import {LoginRequest, User, UserClient, UserResponse} from "../../services/rest/interface";
import {loggedIn} from "../../actions/users";
import {executeDelayed} from "../../services/utils/async-helpers";
import {IConfig} from "../../services/rest/iconfig";
import config from '../../services/rest/server-config';
import {AppStorage} from "../../services/utils/appstorage";

type formData = Readonly<User>;

const formDescription: FormDescription<formData> = {
    name: 'register',
    fields: [
        {
            name: 'email', label: 'Email', type: 'email',
            position: 'floating', color: 'primary', validators: [Validator.required, Validator.email]
        },
        {
            name: 'password', label: 'Password', type: 'password',
            position: 'floating', color: 'primary', validators: [Validator.required]
        },
        {
            name: 'firstname', label: 'Firstname', type: 'text',
            position: 'floating', color: 'primary', validators: [Validator.required]
        },
        {
            name: 'lastname', label: 'Lastname', type: 'text',
            position: 'floating', color: 'primary', validators: [Validator.required]
        }
    ],
    submitLabel: 'Register'
}

const {Form, loading, error} = BuildForm(formDescription);

export const Register: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

    const dispatch = useDispatch();

    const accessHeader = new IConfig();
    const userClient = new UserClient(accessHeader, config.host);
    const submit = (registerData: User) => {
        dispatch(loading(true));
        registerData.active = true;
        userClient.register(registerData)
            .then((registerResponse) => {
                if (registerResponse.hasError) {
                    // console.log('Register data:', registerData);
                    // console.log('Registered user:', registerResponse);
                    const errorKey = Object.keys(registerResponse.errorMessages!)[0];
                    dispatch(error(`${errorKey}: ${registerResponse.errorMessages![errorKey]}`))
                    return;
                }

                // ToDo: comment out following line to not expose user data in console
                console.log('Register successful:', registerResponse)

                executeDelayed(200, () => props.history.replace('/login'))
                // Note: instead of redirecting, we could also login the user automatically

            })
            .catch((err: Error) => {
                dispatch(error('Error while registering: ' + err.message));
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
                    <IonTitle>Register</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <Form handleSubmit={submit}/>
            </IonContent>
        </IonPage>
    );
}

export default Register