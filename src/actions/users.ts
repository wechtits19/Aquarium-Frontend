import {createAction} from 'typesafe-actions';
import {UserResponse} from "../services/rest/interface";

export const loggedIn = createAction('user/loggedIn')<UserResponse>();
export const loggedOut = createAction('user/loggedOut')<void>();