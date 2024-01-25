/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-plusplus */
/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { logoutUser } from "../lib/utils";

export const fetchHandler = (response: any): Promise<any> => {
  const defaultResp = {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  };
  if (response.ok) {
    return response
      .json()
      .then((data: any) => {
        // the status was ok and there is a json body
        return Promise.resolve({ data, rawResp: response, ...defaultResp });
      })
      .catch((err: any) => {
        // the status was ok but there is no json body
        return Promise.resolve({
          data: err,
          rawResp: response,
          ...defaultResp,
        });
      });
  } else {
    return response
      .json()
      .catch((err: any) => {
        // the status was not ok and there is no json body
        return Promise.resolve({
          rawResp: response,
          data: err,
          ...defaultResp,
        });
      })
      .then((json: any) => {
        // the status was not ok but there is a json body
        return Promise.resolve({
          rawResp: response,
          data: json,
          ...defaultResp,
        });
      });
  }
};

export const fetchHandlerText = (response: any): Promise<any> => {
  const defaultResp = {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  };
  if (response.ok) {
    return response
      .text()
      .then((data: any) => {
        // the status was ok and there is a data
        return Promise.resolve({ data, rawResp: response, ...defaultResp });
      })
      .catch((err: any) => {
        // the status was ok but there is no data
        return Promise.resolve({
          data: err,
          rawResp: response,
          ...defaultResp,
        });
      });
  } else {
    return response
      .text()
      .catch((err: any) => {
        // the status was not ok and there is no data
        return Promise.resolve({
          rawResp: response,
          data: err,
          ...defaultResp,
        });
      })
      .then((text: any) => {
        // the status was not ok but there is a data
        return Promise.resolve({
          rawResp: response,
          data: text,
          ...defaultResp,
        });
      });
  }
};

export const responseHelper = (response: any): Promise<any> => {
  const { statusCode } = response.data;
  console.log(response.data);
  if (statusCode >= 200 && statusCode < 300) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response.data);
  }
};

export enum ERROR_IDS {
  INVALID_NAME = "invalidName",
  INVALID_MOBILE = "invalidMobile",
  INVALID_CITY = "invalidCity",
  INVALID_STATE = "cycleState",
  INVALID_OTP = "invalidOtp",
  INVALID_ADDRESSONE = "invalidAddressOne",
  INVALID_ADDRESSTWO = "invalidAddressTwo",
  ALREADY_REGISTERED = "alreadyRegistered",
  INVALID_PIN = "invalidPincode",
}

// Default catch function when API fails
export const defaultCatch = (err: any): Promise<any> => {
  const ignoreMessageKeys = [
    "invalidMobile",
    "invalidOtpError",
    "alreadyRegistered",
    "alreadyReferred",
    "addedReferralCode",
    "invalidReferralCode",
    "invalidReferral",
    "agreeTnC",
  ];
  const { statusCode, message, messageId = "" } = err;
  if (typeof err === "string") {
    toast.error("Something went wrong, try again after some time");
  } else if (!ignoreMessageKeys.includes(messageId)) {
    if (message === "Failed to fetch") {
      toast.error("Please check your network and try again");
    } else if (statusCode === 401) {
      logoutUser();
      toast.info("Your session has been expired");
    } else {
      toast.error(message || "Something went wrong, try again after some time");
    }
  }
  return Promise.reject(err);
};