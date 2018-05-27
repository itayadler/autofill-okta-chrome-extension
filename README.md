# Autofill Okta

A Chrome Extension that once setup, autofills your Okta 2FA forms.

## Requirements

* Pushbullet installed on your phone & a Pushbullet access token
* Okta setup with Phone SMS 2FA (No Google Authenticator support)

## Setup

* Install the extension (https://chrome.google.com/webstore/detail/autofill-okta/ipdfjcnfefckiklebipldggmconhpkia)
* Install Pushbullet on your phone in case you don't have it yet
* Visit https://www.pushbullet.com/#settings

Scroll down until you see the "Create Access Token" button, click it

then copy the access token

* Visit chrome-extension://ipdfjcnfefckiklebipldggmconhpkia/options.html

then paste and "Save" the settings.

* Try to access a 2FA form, assuming everything is setup, and your phone

is on, the extension should fill for you the code from now on
