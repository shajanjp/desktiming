var httpRequest;
var time_left = document.getElementById('time_left');
var APIform = document.getElementById('api-form');
var save_api = document.getElementById('save-api');

var storingAPI;
var API_keey;
var is_menu_shown = false;

if (window.XMLHttpRequest) { 
  httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) { 
  httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
}

function onError(error) {
  alert(error);
}

function showForm(){
 APIform.style.display = 'block';
}

function getAPI_key(){
  var key_from_user = document.getElementById('input-api-key').value;
  storingAPI = browser.storage.local.set({ 'keey' : key_from_user });
  storingAPI.then(() => {
    // alert("store success");
  }, onError);
}

function alertContents() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      var user = JSON.parse(httpRequest.responseText);
      if(!user.error)
        {      var desktime = user.desktimeTime;
          var remaining = (28800 - user.desktimeTime) / 60;
          var can_leave = {};
          can_leave.minutes = Math.floor(remaining % 60);
          can_leave.hours =  Math.floor(remaining / 60);
          can_leave.message =  "<b>" + can_leave.hours + "</b> h <b>" + can_leave.minutes + "</b> m";
          time_left.innerHTML = can_leave.message;
        }
        else
         time_left.innerHTML = 'Invalid Key'; 
     } else {
      alert('There was a problem with the request.');
    }
  }
}


httpRequest.onreadystatechange = alertContents;

var gettingAPI = browser.storage.local.get(null);
gettingAPI.then((result) => {
  API_keey = result['keey'];
  httpRequest.open('GET', 'https://desktime.com/api/v2/json/employee?apiKey=' + API_keey);
  httpRequest.send();
}, onError);

time_left.addEventListener("click", showForm);
save_api.addEventListener("click", getAPI_key);