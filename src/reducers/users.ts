import {Aquarium, UserResponse} from "../services/rest/interface";
import {createReducer} from "typesafe-actions";
import {AnyAction} from "redux";
import {loggedIn, loggedOut, registered} from "../services/actions/users";
import {clearUserData} from "../services/rest/security-helper";

const initialState: UserResponse = {
    init(_data?: any): void {
    }, toJSON(data?: any): any {
    },
    user: undefined,
    authenticationInformation: undefined

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
    .handleAction(registered, (state, action) => {
        return action.payload
    })

// export const currentAquarium = createReducer<Aquarium, AnyAction>(new Aquarium())
//     .handleAction(currentAquarium, (state, action) => {
//         return action.payload
//     })