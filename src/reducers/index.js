import { combineReducers } from "redux";
import userReducer from "./user.js"

const appReducer = combineReducers({userState: userReducer})

const rootReducer =  (state, action) => {
    if (action.type === "USER_LOGOUT") {
        state = undefined
    }
    return appReducer(state, action)
}


export default rootReducer