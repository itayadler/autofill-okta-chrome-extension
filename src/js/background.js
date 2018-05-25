import '../img/icon-128.png'
import '../img/icon-34.png'
import secrets from "secrets";

const OKTA_SMS_CODE_REGEX = /[0-9]+/;

function initPushbulletWebSocket(pbAccessToken) {
  const pbSocket = new WebSocket(`wss://stream.pushbullet.com/websocket/${pbAccessToken}`);
  pbSocket.onmessage = (event)=> {
    const eventData = JSON.parse(event.data);
    if (isSMS(eventData)) {
      const sms = eventData.push.notifications[0];
      const code = extractCodeFromSMS(sms);
      sendMsgToActiveChromeTab({ action: "okta-sms-recieved", code});
    }
  };
}

function sendMsgToActiveChromeTab(msg, cb) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    if (tabs && tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, msg, cb);
    } else {
      // failed to find an activeTab, report to the popup?
    }
  });
}

function isSMS(eventData) {
  return eventData.type === "push" && eventData.push.type === "sms_changed";
}

function extractCodeFromSMS(sms) {
  return sms.body.match(OKTA_SMS_CODE_REGEX)[0];
}

initPushbulletWebSocket(secrets.PUSHBULLET_ACCESS_TOKEN);
