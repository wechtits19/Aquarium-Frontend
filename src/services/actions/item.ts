import {Animal, AquariumClient, Coral} from "../rest/interface";
import {createAsyncAction} from "typesafe-actions";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../reducers";
import {AnyAction} from "redux";
import {IConfig} from "../rest/iconfig";
import config from "../rest/server-config";

export const fetchCoralActions = createAsyncAction(
    'FETCH_CORAL_REQUEST',
    'FETCH_CORAL_SUCCESS',
    'FETCH_CORAL_FAILURE')<void, Coral, Error>();
export const fetchAnimalActions = createAsyncAction(
    'FETCH_ANIMAL_REQUEST',
    'FETCH_ANIMAL_SUCCESS',
    'FETCH_ANIMAL_FAILURE')<void, Animal, Error>();

export type CoralResult = ReturnType<typeof fetchCoralActions.success | typeof fetchCoralActions.failure>;
export type AnimalResult = ReturnType<typeof fetchAnimalActions.success | typeof fetchAnimalActions.failure>;

export const fetchCoralAction = (/*aquariumId: string, */coralId: string): ThunkAction<Promise<CoralResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {

        dispatch(fetchCoralActions.request());
        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();
        accessheader.setToken(token);
        // accessheader.getAuthorization()
        const aquariumClient = new AquariumClient(accessheader, config.host);

        // return aquariumClient.getCorals(getState().currentaquarium.name!)
        return aquariumClient.getCoral('SchiScho', coralId)
            .then(
                coral => dispatch(fetchCoralActions.success(coral))
            )
            .catch(
                err => dispatch(fetchCoralActions.failure(err))
            )
    };

export const fetchAnimalAction = (/*aquariumId: string, */animalId: string): ThunkAction<Promise<AnimalResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {

        dispatch(fetchAnimalActions.request());
        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();
        accessheader.setToken(token);
        // accessheader.getAuthorization()
        const aquariumClient = new AquariumClient(accessheader, config.host);

        return aquariumClient.getAnimal('SchiScho', animalId)
            .then(
                animal => dispatch(fetchAnimalActions.success(animal))
            )
            .catch(
                err => dispatch(fetchAnimalActions.failure(err))
            )
    };