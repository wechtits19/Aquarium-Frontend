import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {RootState} from "../../reducers";
import {useDispatch, useSelector} from "react-redux";
import {
    AnimalsResult,
    CoralsResult,
    fetchAnimalsAction,
    fetchCoralsAction,
    fetchCoralsActions
} from "../../services/actions/items";
import {ThunkDispatch} from "redux-thunk";
import {AnimalResult, CoralResult, fetchAnimalAction, fetchCoralAction} from "../../services/actions/item";
import {
    IonButton,
    IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem, IonLabel,
    IonMenuButton, IonPage, IonSpinner,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import {create, fish, flower} from "ionicons/icons";
import {
    Animal,
    Aquarium,
    AquariumClient, AquariumItem,
    Coral,
    CoralType,
    User,
    UserClient,
    UserResponse
} from "../../services/rest/interface";
import {BuildForm, FormDescription} from "../../services/utils/form-builder";
import * as Validator from "../../services/utils/validators";
import {aquariums, currentaquarium} from "../../reducers/users";
import {IConfig} from "../../services/rest/iconfig";
import config from "../../services/rest/server-config";
import {
    AquariumResult,
    AquariumsResult, currentAqaurium,
    fetchAquariumAction,
    fetchAquariumsAction,
    loggedIn
} from "../../services/actions/users";
import {AppStorage} from "../../services/utils/appstorage";
import store from "../../services/store";
import {executeDelayed} from "../../services/utils/async-helpers";


type coralFormData = Readonly<Coral>;

const coralFormDescription: FormDescription<coralFormData> = {
    name: 'coralForm',
    fields: [
        {
            name: 'name', label: 'Name', type: 'text',
            position: 'floating', color: 'primary', validators: [Validator.required]
        },
        {
            name: 'coralType',
            label: 'Coral type',
            type: 'select',
            options: Object.values(CoralType).map((value) => ({value, key: value})),
            position: 'floating',
            color: 'primary',
            validators: [Validator.required]
        },
        {
            name: 'species',
            label: 'Species',
            type: 'text',
            position: 'floating',
            color: 'primary',
            validators: [Validator.required]
        },
        {
            name: 'inserted', label: 'Inserted', type: 'datetime-local',
            position: 'floating', color: 'primary', validators: [Validator.required]
        },
        {
            name: 'amount', label: 'Amount', type: 'number',
            position: 'floating', color: 'primary', validators: [Validator.required]
        },
        {
            name: 'description', label: 'Description', type: 'text',
            position: 'floating', color: 'primary'
        },
        // {
        //     name: 'aquarium',
        //     label: 'Aquarium',
        //     type: 'select',
        //     options: aquariums().aquariumlist?.map(listItem => listItem.aquarium?.id).filter((id => id !== undefined)).map((id) => ({
        //         value: id,
        //         key: id
        //     })) ?? ['SchiScho'],
        //     position: 'floating',
        //     color: 'primary'
        // }
    ],
    submitLabel: 'Update'
}


type animalFormData = Readonly<Animal>;

const animalFormDescription: FormDescription<animalFormData> = {
    name: 'animalForm',
    fields: [
        {
            name: 'isAlive',
            label: 'Alive',
            type: 'select',
            options: [{key: '0', value: '0'}, {key: '1', value: '1'}],
            position: 'floating',
            color: 'primary',
            validators: [Validator.required]
        },
        {
            name: 'name', label: 'Name', type: 'text',
            position: 'floating', color: 'primary', validators: [Validator.required]
        },
        {
            name: 'deathDate', label: 'Death date (if dead)', type: 'datetime-local',
            position: 'floating', color: 'primary'
        },
        {
            name: 'species',
            label: 'Species',
            type: 'text',
            position: 'floating',
            color: 'primary',
            validators: [Validator.required]
        },
        {
            name: 'inserted', label: 'Inserted', type: 'datetime-local',
            position: 'floating', color: 'primary', validators: [Validator.required]
        },
        {
            name: 'amount', label: 'Amount', type: 'number',
            position: 'floating', color: 'primary', validators: [Validator.required]
        },
        {
            name: 'description', label: 'Description', type: 'text',
            position: 'floating', color: 'primary'
        }
    ],
    submitLabel: 'Update'
}


export default (mode: 'coral' | 'animal'): React.FC<RouteComponentProps<{ id: string; }>> => ({history, match}) => {
    const {Form, loading, error} = BuildForm(mode === 'animal' ? animalFormDescription : coralFormDescription);

    const {coral, animal, isLoading, errorMessage} = useSelector((s: RootState) => s.item);
    const token = useSelector((s: RootState) => s.user.authenticationInformation!.token || '');
    const dispatch = useDispatch();
    const thunkDispatchCoral = dispatch as ThunkDispatch<RootState, null, CoralResult>;
    const thunkDispatchAnimal = dispatch as ThunkDispatch<RootState, null, AnimalResult>;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>Edit {mode}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Form initialState={mode === 'coral' ? coral : animal} handleSubmit={handleSubmit}/>
                <IonToast
                    isOpen={errorMessage ? errorMessage.length > 0 : false}
                    onDidDismiss={() => false}
                    message={errorMessage}
                    duration={5000}
                    color='danger'
                />

            </IonContent>
        </IonPage>
    )

    function handleSubmit(data: Coral | Animal) {
        dispatch(loading(true));
        const accessheader = new IConfig();
        accessheader.setToken(token);

        const aquariumClient = new AquariumClient(accessheader, config.host);
        // const animalThunkDispatch = dispatch as ThunkDispatch<RootState, null, AnimalResult>;
        // const coralThunkDispatch = dispatch as ThunkDispatch<RootState, null, CoralResult>;

        if (!data.id) {
            dispatch(error('Something went wrong: No id found'));
        }

        if (mode === 'animal') {
            aquariumClient.animalPUT(data.aquarium, data.id!, data).then((result) => {
                if (result.hasError == false) {
                    if (result.data instanceof Animal) {
                        // animalThunkDispatch();
                        history.replace('/animal/show/' + result.data.id);
                    }
                }
            })
                .catch((err: Error) => {
                    dispatch(error('Error while updating animal: ' + err.message));
                })
                .finally(() => dispatch(loading(false)))
        }

        if (mode === 'coral') {
            aquariumClient.coralPUT(data.aquarium, data.id!, data).then((result) => {
                if (result.hasError == false) {
                    if (result.data instanceof Coral) {
                        // coralThunkDispatch();
                        history.replace('/coral/show/' + result.data.id);
                    }
                }
            })
                .catch((err: Error) => {
                    dispatch(error('Error while updating coral: ' + err.message));
                })
                .finally(() => dispatch(loading(false)))
        }
    }
}