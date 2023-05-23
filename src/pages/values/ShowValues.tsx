import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonAlert,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonRefresher,
    IonRefresherContent,
    IonToast,
    IonButton,
    RefresherEventDetail, IonLabel
} from '@ionic/react';
import {
    train,
    add,
    trash,
    create,
    beer,
    boat,
    information,
    water,
    sunnySharp,
    flash,
    car,
    power,
    shieldCheckmark, alarm, bed
} from 'ionicons/icons';
import React, {useEffect} from 'react';
import {personCircle, search, star, ellipsisHorizontal, ellipsisVertical} from 'ionicons/icons';
import {RouteComponentProps} from "react-router";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {fetchValuesAction, fetchValuesActions, ValuesResult} from "../../services/actions/values";
import {RootState} from "../../reducers";
import {ValueClient, VisualsBinaryReturnModel, VisualsNumericReturnModel} from "../../services/rest/data";
import {IconConverter} from "../../services/utils/iconConverter";
import {IConfig} from "../../services/rest/iconfig";
import config from "../../services/rest/server-config";


const ValueList: React.FC<RouteComponentProps> = ({history}) => {

    const {values, isLoading, errorMessage} = useSelector((s: RootState) => s.values);
    const current = 'SchiScho'; //useSelector((s: RootState) => s.currentaquarium);
    const token = useSelector((s: RootState) => s.user.authenticationInformation!.token || '');
    const dispatch = useDispatch();

    const thunkDispatch = dispatch as ThunkDispatch<RootState, null, ValuesResult>;

    useEffect(() => {
        if (values.length === 0) thunkDispatch(fetchValuesAction()).then(x => console.log(x));
    }, []);

    const NoValuesInfo = () => !isLoading && values.length == 0 ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No Values found...</IonCardTitle>
            </IonCardHeader>


        </IonCard>) : (<></>)

    const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        const accessheader = new IConfig();
        accessheader.setToken(token);

        const dataClient = new ValueClient(accessheader, config.datahost);

        dataClient.getLastValues('SchiScho')
            .then(values => {
                dispatch(fetchValuesActions.success(values));
            }).then(() => event.detail.complete())
            .catch(error => {
                dispatch(fetchValuesActions.failure(error));
                event.detail.complete();
            });

        thunkDispatch(fetchValuesAction()).then(x => event.detail.complete());
    }

    const ListValues = () => {

        const items = values.map(value => {

            let icon = train;
            let unit = '';

            if (value.visuals != null) {
                if (value.visuals instanceof VisualsNumericReturnModel) {
                    let visual = value.visuals as VisualsNumericReturnModel;
                    unit = " " + visual.unit;
                }
            }

            if (value.sample != null) {

                let valuetext = value.sample.value + unit;

                if (value.visuals != null) {
                    if (value.visuals.icon != null) {
                        icon = IconConverter(value.visuals.icon);
                    }
                    if (value.visuals instanceof VisualsBinaryReturnModel) {
                        let binaryVal = value.visuals as VisualsBinaryReturnModel;
                        valuetext = binaryVal.finalText;
                    }
                }

                return (
                    <IonItemSliding key={value.dataPoint.id}>
                        <IonItem key={value.dataPoint.id}>
                            <IonIcon icon={icon}/>
                            {value.dataPoint.dataPointVisual == '' ? value.dataPoint.name : value.dataPoint.dataPointVisual}
                            <div className="item-note" slot="end">
                                {valuetext}
                            </div>
                        </IonItem>
                    </IonItemSliding>
                );
            }
        });
        return items.length > 0 ? <IonList>{items}</IonList> : <NoValuesInfo/>;
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>Value List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent/>
                </IonRefresher>
                {isLoading ? <IonItem><IonSpinner/>Loading Values...</IonItem> : <ListValues/>}
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
        ;
};

export default ValueList;