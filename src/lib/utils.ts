/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { setAccessToken } from "../store/actions/authAction";
// import { clearUserDetails } from "../store/actions/userAction";
import store from "../store/store";

export function addCaptchaScript(cb?: () => void): void {
  const script = document.getElementById("grecaptcha-script");
  if (script) {
    if (cb) cb();
  } else {
    const newScript = document.createElement("script");
    newScript.src =
      "https://www.google.com/recaptcha/api.js?render=" +
      process.env.REACT_APP_CAPTCHA_SITE_KEY;
    newScript.id = "grecaptcha-script";
    document.body.append(newScript);
    newScript.onload = () => {
      if (cb) cb();
    };
  }
}

export function showCaptchaBadge(): void {
  const badge: HTMLDivElement | null =
    document.querySelector(".grecaptcha-badge");
  if (badge) {
    badge.style.display = "block";
  } else {
    addCaptchaScript();
  }
}

export function hideCaptchaBadge(): void {
  const badge: HTMLDivElement | null =
    document.querySelector(".grecaptcha-badge");
  if (badge) {
    badge.style.display = "none";
  }
}

/**
 * Opens given url url in a new tab
 * @param {string} url
 * @return {void}
 */
export function openInNewTab(url: string): void {
  Object.assign(document.createElement("a"), {
    target: "_blank",
    href: url,
  }).click();
}

/**
 * Copy given text to clipboard
 * @param {string} text
 * @return {void}
 */
export function copyToClipboard(text: string): void {
  const inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.value = text;
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) {
    return (parts.pop() as string).split(";").shift() || "";
  }
  return "";
}

export function dataURItoBlob(dataURI: string) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

export async function shareImage(
  link: string,
  text: string,
  fallback?: (text: string, link: string) => void
) {
  if (
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i)
  ) {
    const shareData = {
      title: "Thumsup",
      text: text,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {
          // recordAction(ApiRecordActions.INSTA_SHARE);
          // gaDataPush({
          //   event: "customEvent",
          //   eventCategory: "redeem prize social link",
          //   eventAction: "instagram",
          // });
        })
        .catch(() => {
          if (fallback) fallback(text, link);
        });
    } else {
      if (fallback) fallback(text, link);
    }
  } else {
    const blob = await fetch(link, { mode: "no-cors" }).then((r) => r.blob());
    const file = new File([blob], "Share.jpg", { type: "image/jpeg" });
    const nav: any = navigator;
    if (nav.canShare && nav.canShare({ files: [file] })) {
      nav
        .share({
          files: [file],
          title: "Thumsup",
          text: text,
          // url: `${location.origin}${process.env.VUE_APP_PUBLIC_PATH}`,
        })
        .then(() => {
          // recordAction(ApiRecordActions.INSTA_SHARE);
          // gaDataPush({
          //   event: "customEvent",
          //   eventCategory: "redeem prize social link",
          //   eventAction: "instagram",
          // });
        })
        .catch(() => {
          if (fallback) fallback(text, link);
        });
    } else {
      if (fallback) fallback(text, link);
    }
  }
}

export function nativeShareText(
  text: string,
  fallback?: (text: string) => void
) {
  const shareData = {
    title: "Thumsup",
    text: text,
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {
      if (fallback) fallback(text);
    });
  } else {
    if (fallback) fallback(text);
  }
}

export function shareOnTwitter(text: string, url: string) {
  openInNewTab(`http://twitter.com/share?text=${encodeURIComponent(text)}`);
}
export function shareOnSMS(text: string, url: string) {
  openInNewTab(`sms:;?&body=${encodeURIComponent(text)}`);
}
export function shareOnWhatsapp(text: string, url?: string) {
  openInNewTab(`https://wa.me/?text=${encodeURIComponent(text)}`);
}
export function shareOnInstagram(text: string, url: string) {
  openInNewTab(`https://instagram.com`);
}
export function shareOnFacebook(text: string, url: string) {
  openInNewTab(
    `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(
      text
    )}`
  );
}

export function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function logoutUser() {
  store.dispatch(setAccessToken());
//   store.dispatch(clearUserDetails());
}

export function cdsPixelTrackEvent(payload: any, addUserId = false): void {
  if (addUserId) {
    payload.user_identifier = getCookie("__cds_pixel_id");
    payload.user_identifier_type = "COKE_COOKIE";
    payload.user_identifier_sub_type = "CDS_PIXEL_COOKIE";
  }
  (window as any).cds_pixel(process.env.REACT_APP_CDP_CLIENT_ID, payload);
}

// export enum FLOODLIGHT_EVENTS {
//   HOME_PAGE_LOAD = "DC-12665261/thums0/thums00y+unique",
//   GET_OTP = "DC-12665261/thums0/thums00z+unique",
//   VERIFY_OTP = "DC-12665261/thums0/thums00_+unique",
// }

// export function trackFloodLightEvent(event: FLOODLIGHT_EVENTS) {
//   (window as any).gtag("event", "conversion", {
//     allow_custom_scripts: true,
//     send_to: event,
//   });
// }

// export enum FB_PIXEL_EVENTS {
//   REGISTER = "RegisterTUHunt23",
// }
// export function trackFbPixelEvent(event: FB_PIXEL_EVENTS) {
//   (window as any).fbq("track", event);
// }

export enum GA_EVENTS {
  Registered = "Registered",
  B_Telecom = "B-Telecom",
  Tashi = "Tashi",
  Submit = "Submit",
  Thank_You = "Thank_You",
}
export function gtagTrackEvent(event: GA_EVENTS) {
  (window as any).gtag("event", event);
}