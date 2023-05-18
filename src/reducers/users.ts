import {AnyAction} from "redux";
import {
    currentAqaurium,
    fetchAquariumActions,
    fetchAquariumsActions,
    loggedIn,
    loggedOut
} from "../services/actions/users";
import {createReducer} from "typesafe-actions";
import {Aquarium, AquariumUserResponse, UserResponse} from "../services/rest/interface";
import {clearUserData} from "../services/rest/security-helper";


const initialState: UserResponse = {
    init(_data?: any): void {
    }, toJSON(data?: any): any {
    },
    user: undefined,
    authenticationInformation: undefined

}

const initialAquariumState: AquariumState =
    {
        isLoading: false,
        errorMessage: "",
        //aquariumuserresponse: null,
        aquariumlist: []
    }


export interface AquariumState {
    isLoading: boolean;
    errorMessage: string;
    // aquariumuserresponse : Aquarium | null;
    aquariumlist: AquariumUserResponse[] | null;
}


export const user = createReducer<UserResponse, AnyAction>(initialState)
    .handleAction(loggedIn, (state, action) => {

        return action.payload
    })
    .handleAction(loggedOut,
        (state, action) => {
            clearUserData();
            return initialState;
        }
    )


export const currentaquarium = createReducer<Aquarium, AnyAction>(new Aquarium())
    .handleAction(currentAqaurium, (state, action) => {
        return action.payload
    })
    .handleAction(loggedOut,
        (state, action) => {
            clearUserData();
            return initialState;
        }
    )


export const aquariums = createReducer<AquariumState, AnyAction>(initialAquariumState)
    .handleAction(fetchAquariumsActions.request, (state, action) =>
        ({...state, isLoading: true, errorMessage: ''}))
    .handleAction(fetchAquariumActions.request, (state, action) =>
        ({...state, isLoading: true, errorMessage: ''}))
    .handleAction(fetchAquariumActions.failure, (state, action) =>
        ({...state, isLoading: false, errorMessage: action.payload.message}))
    .handleAction(fetchAquariumActions.success, (state, action) =>
        ({...state, isLoading: false, aquariumuserresponse: action.payload}))
    .handleAction(fetchAquariumsActions.failure, (state, action) =>
        ({...state, isLoading: false, errorMessage: action.payload.message}))
    .handleAction(fetchAquariumsActions.success, (state, action) =>
        ({...state, isLoading: false, aquariumlist: action.payload}))


// import {Aquarium, UserResponse} from "../services/rest/interface";
// import {createReducer} from "typesafe-actions";
// import {AnyAction} from "redux";
// import {loggedIn, loggedOut, registered} from "../services/actions/users";
// import {clearUserData} from "../services/rest/security-helper";
//
// const initialState: UserResponse = {
//     init(_data?: any): void {
//     }, toJSON(data?: any): any {
//     },
//     user: undefined,
//     authenticationInformation: undefined
//
// }
//
//
// export const user = createReducer<UserResponse, AnyAction>(initialState)
//     .handleAction(loggedIn, (state, action) => {
//         return action.payload
//     })
//     .handleAction(loggedOut,
//         (state, action) => {
//             clearUserData();
//             return initialState;
//         }
//     )
//     .handleAction(registered, (state, action) => {
//         return action.payload
//     })
//
// // export const currentAquarium = createReducer<Aquarium, AnyAction>(new Aquarium())
// //     .handleAction(currentAquarium, (state, action) => {
// //         return action.payload
// //     })