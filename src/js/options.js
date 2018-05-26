import "../css/options.css";

function saveOptions() {
  var pbAccessToken = document.getElementById('pbAccessToken').value;
  chrome.storage.sync.set({
    pbAccessToken: pbAccessToken
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.style = "opacity: 1";
    setTimeout(function() {
      status.style = "opacity: 0";
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({pbAccessToken: ''}, function(items) {
    document.getElementById('pbAccessToken').value = items.pbAccessToken || '';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
