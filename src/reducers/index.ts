import {combineReducers} from "@reduxjs/toolkit";
import {user} from "./users";
import {formBuilderReducer} from "../services/utils/form-builder";
import {items} from "./items";
import {item} from "./item";

const rootReducer = combineReducers({
    user,
    items,
    item,
    formBuilder: formBuilderReducer
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;