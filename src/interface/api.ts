export interface BaseResponse {
    statusCode: number;
    message: string;
  }
  export interface CreateUserPayload {
    masterKey?: string;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
    ipInfo?: IpLookupData;
  }
  export interface CreateUserResponse extends BaseResponse {
    dataKey: string;
    userKey: string;
    isLoggedIn: boolean;
    fromBhutan: boolean;
  }
  
  export interface IpLookupData {
    // continent: string;
    // continent_code: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    isFromTn: boolean;
    zip: string;
    [key: string]: any;
  }
  
  export interface RegisterPayload {
    code: string;
    name: string;
    operator: string;
    mobile: string;
    agreeTnc: boolean;
    token: string;
  }
  
  export interface VerifyOtpResponse extends BaseResponse {
    accessToken: string;
    userStatus: string;
  }
  
  export interface RegisterResponse extends BaseResponse {
    accessToken: string;
    rewardCode: string;
    secret: string;
    pin: string;
    value: string;
  }