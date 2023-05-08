import {
    IonButtons, IonCard, IonButton, IonIcon, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import React from 'react';
import './Home.css';


const Home = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard class="welcome-card">
                    <IonCardHeader>

                        <IonCardTitle>Welcome to our Homeautomation</IonCardTitle>
                        <IonCardSubtitle></IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <p>

                        </p>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Home;