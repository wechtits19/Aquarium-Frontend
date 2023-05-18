import {createAction} from 'typesafe-actions';
import {Aquarium, User, UserResponse} from "../rest/interface";

export const loggedIn = createAction('user/loggedIn')<UserResponse>();
export const loggedOut = createAction('user/loggedOut')<void>();
export const registered = createAction('user/registered')<User>();
export const currentAquarium = createAction('user/currentAquarium')<Aquarium>();