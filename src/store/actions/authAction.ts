import { Dispatch } from "redux";
import { CLEAR_ACCESS_DETAILS, SET_ACCESS_TOKEN, SET_USER_ID } from "../types";

export const setUserIdentification =
  (payload: any): any =>
  async (dispatch: Dispatch) => {
    dispatch({
      type: SET_USER_ID,
      payload,
    });
  };

export const setAccessToken =
  (payload = ""): any =>
  async (dispatch: Dispatch) => {
    dispatch({
      type: SET_ACCESS_TOKEN,
      payload,
    });
  };

export const clearAccessDetails = () => async (dispatch: Dispatch) => {
  dispatch({
    type: CLEAR_ACCESS_DETAILS,
  });
};