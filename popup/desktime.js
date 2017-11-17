var httpRequest;
var dt = document.getElementById('dt');
var at = document.getElementById('at');
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
  this.hours = parseInt((total_seconds / 3600));
  this.minutes = parseInt((total_seconds % 3600) / 60);
  this.seconds = parseInt(total_seconds % 60);
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
       var normed_w = normalizeTo100([user.atWorkTime, 32400]);
       var normed_d = normalizeTo100([user.desktimeTime, 28800]);
       document.getElementById("work-time-graph").setAttribute('stroke-dasharray',  '' + normed_w[0] + ' ' + (100 - normed_w[0]));
       document.getElementById("desk-time-graph").setAttribute('stroke-dasharray',  '' + normed_d[0] + ' ' + (100 - normed_d[0]));
       var on_desk = new TimeMachine(user.desktimeTime);
       var at_work = new TimeMachine(user.atWorkTime);
       var on_desk_since = on_desk.humanize();  
       var at_work_since = at_work.humanize();

       dt.innerHTML = "<b>" + on_desk_since.hours + " : " + on_desk_since.minutes + "</b>";
       at.innerHTML = "<b>" + at_work_since.hours + " : " + at_work_since.minutes + "</b>";
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

dt.addEventListener("click", showForm);
save_api.addEventListener("click", getAPI_key);