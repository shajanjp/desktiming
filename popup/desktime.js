var httpRequest;
var dt = document.getElementById('dt');
var at = document.getElementById('at');
var APIform = document.getElementById('api-form');
var save_api = document.getElementById('save-api');
var key_input = document.getElementById('input-api-key');
var storingAPI;
var API_keey;
var is_menu_shown = false;

function TimeMachine(total_seconds) {
  this.hours = parseInt((total_seconds / 3600));
  this.minutes = parseInt((total_seconds % 3600) / 60);
  this.seconds = parseInt(total_seconds % 60);
  this.humanize = function() {
    return this;
  };
}

function normalizeTo100(num_array) {
  let numbers = num_array;
  let ratio = Math.max(...numbers) / 100;
  return numbers.map((v) => Math.round(v / ratio));
}

function onError(error) {
  at.innerHTML = 'Change API';
}

function showForm() {
 APIform.style.display = 'block';
}

function getAPI_key() {
  key_from_user = key_input.value;
  storingAPI = browser.storage.local.set({'keey': key_from_user});
  storingAPI.then(() => {
  })
  .catch(onError);
}

function alertContents() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      let user = JSON.parse(httpRequest.responseText);
      if (!user.error) {
       let normed_w = normalizeTo100([user.atWorkTime, 32400]);
       let normed_d = normalizeTo100([user.desktimeTime, 28800]);
       document.getElementById('work-time-graph').setAttribute('stroke-dasharray', '' + normed_w[0] + ' ' + (100 - normed_w[0]));
       document.getElementById('desk-time-graph').setAttribute('stroke-dasharray', '' + normed_d[0] + ' ' + (100 - normed_d[0]));
       let on_desk = new TimeMachine(user.desktimeTime);
       let at_work = new TimeMachine(user.atWorkTime);
       let on_desk_since = on_desk.humanize();
       let at_work_since = at_work.humanize();

       dt.innerHTML = '<b>' + on_desk_since.hours + ' : ' + on_desk_since.minutes + '</b>';
       at.innerHTML = '<b>' + at_work_since.hours + ' : ' + at_work_since.minutes + '</b>';
     } else {
time_left.innerHTML = 'Invalid Key';
}
   } else {
    alert('There was a problem with the request.');
  }
}
}

if (window.XMLHttpRequest) {
  httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) {
  httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
}

httpRequest.onreadystatechange = alertContents;

var gettingAPI = browser.storage.local.get(null);
gettingAPI.then((result) => {
  API_keey = result['keey'];
  if (API_keey == '' || API_keey == null || API_keey == undefined) {
dt.innerHTML = 'Change Key';
} else {
key_input.value = API_keey;
}
  httpRequest.open('GET', 'https://desktime.com/api/v2/json/employee?apiKey=' + API_keey);
  httpRequest.send();
})
.catch(onError);

dt.addEventListener('click', showForm);
save_api.addEventListener('click', getAPI_key);
