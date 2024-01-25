import {
    BaseResponse,
    CreateUserPayload,
    CreateUserResponse,
    RegisterPayload,
    RegisterResponse,
    VerifyOtpResponse,
    IpLookupData,
  } from "../interface/api";
  import {
    decryptData,
    sendEncrytedData,
    authorisedEncrytedApiCall,
  } from "./encrypt";
  import {
    defaultCatch,
    fetchHandlerText,
    responseHelper,
    fetchHandler,
  } from "./utils";
  import store from "../store/store";

  
  const jsonHeaders: { [key: string]: string } = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  
  class APIS {
    private showLoader = (loaderTitle?: string | undefined) => {};
    private hideLoader = (loaderTitle?: string | undefined) => {};
    private static instance: APIS | null = null;
    public instanceId = "TEST";
    private static activityTimer: NodeJS.Timer;
  
    constructor(instanceId: string) {
      this.instanceId = instanceId;
      // document.addEventListener("click", this.logActivity);
    }
  
    static getInstance() {
      return APIS.instance || (APIS.instance = new APIS("TEST NEW 1"));
    }
  
    initialize(
      showLoader: (loaderTitle?: string | undefined) => void,
      hideLoader: () => void
    ) {
      this.showLoader = showLoader;
      this.hideLoader = hideLoader;
    }
  
    // private logActivity() {
    //   // console.log("LOG", "ACTIVTY");
    //   clearTimeout(APIS.activityTimer);
    //   const auth = store.getState().authReducer;
    //   if (auth && auth.accessToken) {
    //     // console.log("LOG", "INACTIVITY TIMER STARTED", new Date());
    //     APIS.activityTimer = setTimeout(() => {
    //       // console.log("LOG", "LOGGING USER OUT", new Date());
    //       // logoutUser();
    //       toast.info("Your session has been expired");
    //     }, 20 * 60 * 1000);
    //   }
    // }
  
    async createUser(): Promise<CreateUserResponse> {
      const payload: CreateUserPayload = {};
      const state = store.getState();
      const { accessToken } = state.authReducer;
      let masterKey = localStorage.getItem("thumsup-tbh-user-id");
      if (masterKey) {
        payload.masterKey = masterKey;
      }
      const headers = jsonHeaders;
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("utm_source")) {
        payload.utm_source = urlParams.get("utm_source");
      }
      if (urlParams.get("utm_medium")) {
        payload.utm_medium = urlParams.get("utm_medium");
      }
      if (urlParams.get("utm_campaign")) {
        payload.utm_campaign = urlParams.get("utm_campaign");
      }
      if (urlParams.get("utm_content")) {
        payload.utm_content = urlParams.get("utm_content");
      }
      if (urlParams.get("utm_term")) {
        payload.utm_term = urlParams.get("utm_term");
      }
      const ipInfo = await this.ipLookup();
      if (ipInfo) {
        payload.ipInfo = ipInfo;
        // store.dispatch(setIpDetails(ipInfo));
      }
      this.showLoader("Starting session...");
      return fetch(`${process.env.REACT_APP_API_BASE_URL}users`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
        .then(fetchHandlerText)
        .then(decryptData)
        .then(responseHelper)
        .catch(defaultCatch)
        .finally(this.hideLoader);
    }
  
    private ipLookup(): Promise<IpLookupData> {
      this.showLoader("Setting up...");
      return fetch("https://pro.ip-api.com/json?key=W3uwTeHN4EN2hAd")
        .then(fetchHandler)
        .then((response) => response.data)
        .finally(this.hideLoader);
    }
  
    redeemNowClicked(): Promise<BaseResponse> {
      this.showLoader("redeemNowClicked");
      return authorisedEncrytedApiCall("users/redeemNowClicked/", {}, "GET")
        .then(fetchHandlerText)
        .then(decryptData)
        .then(responseHelper)
        .catch(defaultCatch)
        .finally(this.hideLoader);
    }
    logout(): Promise<BaseResponse> {
      this.showLoader("loging out");
      return authorisedEncrytedApiCall("users/logout/", {}, "GET")
        .then(fetchHandlerText)
        .then(decryptData)
        .then(responseHelper)
        .catch(defaultCatch)
        .finally(this.hideLoader);
    }
  
    getOTP(mobile: string): Promise<BaseResponse> {
      // this.logActivity();
      this.showLoader("Sending OTP...");
      return sendEncrytedData("users/getOTP/", { mobile })
        .then(fetchHandlerText)
        .then(decryptData)
        .then(responseHelper)
        .catch(defaultCatch)
        .finally(this.hideLoader);
    }
  
    verifyOTP(otp: string): Promise<VerifyOtpResponse> {
      // this.logActivity();
      this.showLoader("Verifying OTP...");
      return sendEncrytedData("users/verifyOTP/", { otp })
        .then(fetchHandlerText)
        .then(decryptData)
        .then(responseHelper)
        .catch(defaultCatch)
        .finally(this.hideLoader);
    }
  
    register(payload: RegisterPayload): Promise<RegisterResponse> {
      // this.logActivity();
      this.showLoader("Saving details...");
      return authorisedEncrytedApiCall("users/register/", { ...payload })
        .then(fetchHandlerText)
        .then(decryptData)
        .then(responseHelper)
        .catch(defaultCatch)
        .finally(this.hideLoader);
    }
  
    clickProceed(): Promise<BaseResponse> {
      // this.logActivity();
      this.showLoader("loading message...");
      return authorisedEncrytedApiCall("users/proceed/", {})
        .then(fetchHandlerText)
        .then(decryptData)
        .then(responseHelper)
        .catch(defaultCatch)
        .finally(this.hideLoader);
    }
  

    saveFeedback(feedback: string): Promise<BaseResponse> {
      this.showLoader("saving details...");
      return authorisedEncrytedApiCall("users/tellUsMore/", {
        feedback,
      })
        .then(fetchHandlerText)
        .then(decryptData)
        .then(responseHelper)
        .catch(defaultCatch)
        .finally(this.hideLoader);
    }
  }
  const API = APIS.getInstance();
  
  export default API;