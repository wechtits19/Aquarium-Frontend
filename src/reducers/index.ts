import {combineReducers} from "@reduxjs/toolkit";
import {user} from "./users";
import {formBuilderReducer} from "../services/utils/form-builder";

const rootReducer = combineReducers({
    user,
    formBuilder: formBuilderReducer
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;