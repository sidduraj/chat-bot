import { SET_USER_ID, CLEAR_ACCESS_DETAILS, SET_ACCESS_TOKEN } from "../types";

const initialState = {
  userKey: "",
  dataKey: "",
  accessToken: "",
  fromBhutan: "",
};

type ActionType =
  | {
      type: "SET_USER_ID";
      payload: {
        userKey: string;
        dataKey: string;
        fromBhutan: string;
      };
    }
  | {
      type: "SET_ACCESS_TOKEN";
      payload: string;
    }
  | {
      type: "CLEAR_ACCESS_DETAILS";
    };
export default function authReducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case SET_USER_ID:
      let masterKey = localStorage.getItem("thumsup-tbh-user-id");
      if (!masterKey) {
        localStorage.setItem("thumsup-tbh-user-id", action.payload.userKey);
      }
      return {
        ...state,
        userKey: action.payload.userKey,
        dataKey: action.payload.dataKey,
        fromBhutan: action.payload.fromBhutan,
      };
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload,
      };
    case CLEAR_ACCESS_DETAILS:
      return {
        ...state,
        userKey: "",
        dataKey: "",
        accessToken: "",
        fromBhutan: "",
      };
    default:
      return state;
  }
}