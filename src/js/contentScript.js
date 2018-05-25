chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === 'okta-sms-recieved') {
    const oktaCodeInput = document.querySelector('.okta-container input[type="tel"]');
    if (oktaCodeInput) {
      oktaCodeInput.value = msg.code;
      const evt = document.createEvent("Events");
      evt.initEvent("change", true, true);
      oktaCodeInput.dispatchEvent(evt);
      const oktaSubmit = document.querySelector('.okta-container input[type="submit"]');
      oktaSubmit.click();
      sendResponse({ action: 'okta-mfa-form-submit-success' });
    }
    sendResponse({ action: 'okta-mfa-form-submit-failure', reason: 'Couldn\'t find Input field in active tab' });
  }
});
