import '../img/icon-128.png'
import '../img/icon-34.png'

const OKTA_SMS_CODE_REGEX = /[0-9]+/;
let pbSocket;

function initPushbulletWebSocket(pbAccessToken) {
  // note(itay): Skipping init if there's already an open socket in either
  // CONNECTING or OPEN state
  if (pbSocket && pbSocket.readyState < 2) {
    return;
  }

  pbSocket = new WebSocket(`wss://stream.pushbullet.com/websocket/${pbAccessToken}`);
  pbSocket.onmessage = (event)=> {
    const eventData = JSON.parse(event.data);
    if (isSMS(eventData)) {
      const sms = eventData.push.notifications[0];
      const code = extractCodeFromSMS(sms);
      sendMsgToActiveChromeTab({ action: "okta-sms-recieved", code}, function(err){
        // note(itay): We want to keep the socket open in case no form was filled.
        if (!err) {
          pbSocket.close();
          pbSocket = null;
        }
      });
    }
  };
}

function sendMsgToActiveChromeTab(msg, cb) {
  if (!cb) { cb = function(){} }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    if (tabs && tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, msg, function(e){
        if (!e) { return; }
        if(e.action === 'okta-mfa-form-submit-success') {
          cb(null);
        } else {
          cb({ error: 'no-okta-form-filled' });
        }
      });
    } else {
      cb({ error: 'no-okta-form-filled' });
    }
  });
}

function isSMS(eventData) {
  return eventData.type === "push" && eventData.push.type === "sms_changed";
}

function extractCodeFromSMS(sms) {
  return sms.body.match(OKTA_SMS_CODE_REGEX)[0];
}

chrome.webNavigation.onCompleted.addListener(function ( { tabId, url, processId, frameId, timeStamp }){
  sendMsgToActiveChromeTab({ action: "okta-sms-send" });
  chrome.storage.sync.get({pbAccessToken: ''}, function(items) {
    if (items.pbAccessToken) {
      initPushbulletWebSocket(items.pbAccessToken);
    } else {
      console.log("[Autofill-Okta]: Missing Pushbullet Access Token, visit extension options to fill it.");
    }
  });
}, { url: [{ hostSuffix: "okta.com" } ]});
