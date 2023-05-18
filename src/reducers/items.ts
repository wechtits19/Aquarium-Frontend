import {AnyAction} from "redux";
import {createReducer} from "typesafe-actions";
import {Animal, Coral} from "../services/rest/interface";
import {fetchAnimalsActions, fetchCoralsActions} from "../services/actions/items";

const initialState: AquariumItemsState = {
    isLoading: false,
    corals: [],
    animals: [],
    errorMessage: '',

}


export interface AquariumItemsState {
    isLoading: boolean;
    corals: Coral[];
    animals: Animal[];
    errorMessage: string;
}

export const items = createReducer<AquariumItemsState, AnyAction>(initialState)
    .handleAction(fetchCoralsActions.request, (state, action) =>
        ({...state, isLoading: true, errorMessage: ''}))
    .handleAction(fetchCoralsActions.success, (state, action) =>
        ({...state, isLoading: false, corals: action.payload}))
    .handleAction(fetchCoralsActions.failure, (state, action) =>
        ({...state, isLoading: false, errorMessage: action.payload.message}))
    .handleAction(fetchAnimalsActions.request, (state, action) =>
        ({...state, isLoading: true, errorMessage: ''}))
    .handleAction(fetchAnimalsActions.success, (state, action) =>
        ({...state, isLoading: false, animals: action.payload}))
    .handleAction(fetchAnimalsActions.failure, (state, action) =>
        ({...state, isLoading: false, errorMessage: action.payload.message}))