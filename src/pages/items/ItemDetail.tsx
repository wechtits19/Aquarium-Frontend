import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {RootState} from "../../reducers";
import {useDispatch, useSelector} from "react-redux";
import {AnimalsResult, CoralsResult, fetchAnimalsAction, fetchCoralsAction} from "../../services/actions/items";
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
import {Animal, Coral} from "../../services/rest/interface";

export default (mode: 'coral' | 'animal'): React.FC<RouteComponentProps<{ id: string; }>> => ({history, match}) => {

    const {coral, animal, isLoading, errorMessage} = useSelector((s: RootState) => s.item);
    const token = useSelector((s: RootState) => s.user.authenticationInformation!.token || '');
    const dispatch = useDispatch();
    const thunkDispatchCoral = dispatch as ThunkDispatch<RootState, null, CoralResult>;
    const thunkDispatchAnimal = dispatch as ThunkDispatch<RootState, null, AnimalResult>;
    const [item, setItem] = useState<Animal | Coral>();

    useEffect(() => {
        if (item?.id !== match.params.id) {
            if (mode == 'coral') {
                thunkDispatchCoral(fetchCoralAction(match.params.id)).then((result) => {
                    setItem(result.payload as Coral);
                })
            }
            if (mode == 'animal') {
                thunkDispatchAnimal(fetchAnimalAction(match.params.id)).then((result) => {
                    setItem(result.payload as Animal);
                })
            }
        }
    }, [])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonButtons slot="primary">
                        <IonButton onClick={() => history.push('/animal/add')}>
                            <IonIcon slot="icon-only" icon={fish}/>
                        </IonButton>
                        <IonButton onClick={() => history.push('/coral/add')}>
                            <IonIcon slot="icon-only" icon={flower}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{item?.name ?? 'Error showing item'}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {item && <IonCard>
                    <IonCardHeader>
                        <IonToolbar>
                            <IonCardTitle>{item?.name}</IonCardTitle>
                            <IonCardSubtitle>Species: {item?.species}</IonCardSubtitle>
                            <IonButton slot='primary'
                                       onClick={() => history.push(`/${item instanceof Coral ? 'coral' : 'animal'}/edit/${match.params.id}`)}>
                                <IonIcon slot="icon-only" icon={create}/>
                            </IonButton>
                        </IonToolbar>
                    </IonCardHeader>
                    <IonCardContent>
                        {item instanceof Coral && <p>Type: {coral?.coralType}</p>}
                        {item instanceof Animal &&
                            <p>{animal?.isAlive
                                ? 'Is alive'
                                : `Died on: ${new Date(animal?.deathDate ?? '').toLocaleDateString()}`
                            }</p>}
                        <p>Amount: {item.amount}</p>
                        <p>Inserted: {new Date(item.inserted ?? '').toLocaleDateString()}</p>
                        <p>Description: {item.description}</p>
                    </IonCardContent>
                </IonCard>}

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
}