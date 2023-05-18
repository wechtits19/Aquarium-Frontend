import {Animal, AquariumClient, Coral} from "../rest/interface";
import {createAsyncAction} from "typesafe-actions";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../reducers";
import {AnyAction} from "redux";
import {IConfig} from "../rest/iconfig";
import config from "../rest/server-config";
import {currentaquarium} from "../../reducers/users";

export const fetchCoralsActions = createAsyncAction(
    'FETCH_CORALS_REQUEST',
    'FETCH_CORALS_SUCCESS',
    'FETCH_CORALS_FAILURE')<void, Coral[], Error>();
export const fetchAnimalsActions = createAsyncAction(
    'FETCH_ANIMALS_REQUEST',
    'FETCH_ANIMALS_SUCCESS',
    'FETCH_ANIMALS_FAILURE')<void, Animal[], Error>();

export type CoralsResult = ReturnType<typeof fetchCoralsActions.success | typeof fetchCoralsActions.failure>;
export type AnimalsResult = ReturnType<typeof fetchAnimalsActions.success | typeof fetchAnimalsActions.failure>;

export const fetchCoralsAction = (): ThunkAction<Promise<CoralsResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {

        dispatch(fetchCoralsActions.request());
        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();
        accessheader.setToken(token);
        // accessheader.getAuthorization()
        const aquariumClient = new AquariumClient(accessheader, config.host);

        //ToDo: Remove the default SchiScho aquarium and implement something better
        return aquariumClient.getCorals('SchiScho')
            // return aquariumClient.getCorals(currentaquarium.name ?? 'SchiScho')
            .then(
                corals => dispatch(fetchCoralsActions.success(corals))
            )
            .catch(
                err => dispatch(fetchCoralsActions.failure(err))
            )
    };

export const fetchAnimalsAction = (): ThunkAction<Promise<AnimalsResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {

        dispatch(fetchAnimalsActions.request());
        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();
        accessheader.setToken(token);
        // accessheader.getAuthorization()
        const aquariumClient = new AquariumClient(accessheader, config.host);

        return aquariumClient.getAnimals('SchiScho')
            .then(
                animals => dispatch(fetchAnimalsActions.success(animals))
            )
            .catch(
                err => dispatch(fetchAnimalsActions.failure(err))
            )
    };