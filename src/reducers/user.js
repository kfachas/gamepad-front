
const INITIAL_STATE = {
  //currentUser: null,
  //currentClient: null,
};

const applySetUser = (state, action) => {
  // set default values
  const userData = {...action.user, uid: action.uid}

  return {
    ...state,
    currentUser: userData,
  };
};

const applySetClient = (state, action) => {
  // set default values

  return {
    ...state,
    clientData: action.client,
  };
};

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "USER_SET": {
      return applySetUser(state, action);
    }
    case "CLIENT_SET": {
      return applySetClient(state, action);
    }
    default:
      return state;
  }
}
export default userReducer;
