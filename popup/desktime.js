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

function TimeMachine(total_seconds) {
  this.hours = (total_seconds / 3600).toFixed(0) ;
  this.minutes = ((total_seconds % 3600) / 60).toFixed(0);
  this.seconds = (total_seconds % 60).toFixed(0);
  this.humanize = function() {
    return this;
  };
}

function normalizeTo100(num_array){
  var numbers = num_array;
  var ratio = Math.max(...numbers) / 100;
  return numbers.map(v => Math.round(v / ratio));
}

var myTime = new TimeMachine(3769);
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
        { 
          var desktime = user.desktimeTime;
          var on_desk_since = user.desktimeTime;
          var desk_time = {};
          desk_time.hours =  Math.floor(on_desk_since / 3600);
          desk_time.minutes = Math.floor((on_desk_since / 60) % 60);
          desk_time.message =  "<b>" + desk_time.hours + "</b> hours <b>" + desk_time.minutes + "</b> minutes";
          time_left.innerHTML = desk_time.message;
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