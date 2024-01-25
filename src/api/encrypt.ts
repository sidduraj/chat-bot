import store from "../store/store";
import * as CryptoJS from "crypto-js";
import jsSHA from "jssha";
import { getCookie } from "../lib/utils";
const defaultHeaders: { [key: string]: string } = {
  Accept: "*/*",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  "cds-pixel-id": getCookie("__cds_pixel_id"),
};

export async function sendEncrytedData(
  url: string,
  data?: any,
  method = "POST",
  headers = defaultHeaders
) {
  const accessDetails: any = await store.getState().authReducer;
  if (accessDetails && accessDetails.userKey && accessDetails.dataKey) {
    const userKey = accessDetails.userKey;
    const dataKey = accessDetails.dataKey;
    data = data || {};
    data.userKey = userKey;
    // fun = fun || function() {};

    const t = new Date().getTime();
    data.t = t;
    const dAr = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const dr = CryptoJS.enc.Base64.stringify(dAr);
    const hd = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(t.toString())
    );

    const shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.setHMACKey(dataKey.substr(4, 14), "TEXT");
    shaObj.update(hd + "." + dr);
    const hmac = shaObj.getHMAC("HEX");
    const k1 = CryptoJS.enc.Utf8.parse(hmac);
    const k2 = CryptoJS.enc.Base64.stringify(k1);
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const r1 = Math.floor(Math.random() * 6) + 1;
    const r2 = Math.floor(Math.random() * 7) + 2;
    for (let i = 0; i < r2; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    const f_str =
      String(r2) + String(r1) + k2.slice(0, r1) + text + k2.slice(r1);
    const out = hd + "." + dr + "." + f_str;
    const obj = {
      userKey: userKey,
      data: out,
    };
    const options: any = {
      method,
      headers: headers,
    };
    if (method !== "GET") {
      options.body = new URLSearchParams(obj);
    }
    let fullUrl = `${process.env.REACT_APP_API_BASE_URL}${url}`;
    if (
      url.includes("users") ||
      url.includes("video/") ||
      url.includes("outlet/")
    ) {
      fullUrl += userKey;
    }
    fullUrl += "?t=" + new Date().getTime().toString();
    return fetch(fullUrl, options);
  }
  return Promise.reject({ code: 401, message: "Session not found!" });
}

export function decryptData(response: any) {
  const data = JSON.parse(response.data);
  return Promise.resolve({
    ...response,
    data:
      typeof data.resp === "string" ? JSON.parse(atob(data.resp)) : data.resp,
    rawResp: response,
  });
}

export async function authorisedEncrytedApiCall(
  url: string,
  data?: any,
  method = "POST"
) {
  const accessDetails: any = await store.getState().authReducer;
  const headers = {
    Authorization: `Bearer ${accessDetails.accessToken}`,
    ...defaultHeaders,
  };
  return sendEncrytedData(url, data, method, headers);
}