var graph = document.querySelector("#graph");

/** 
 * Gets race results data from json file, converts to JavaScript object, 
 * and adds startOrder to each result 
 **/
function getRaceResults() {
  var req = new XMLHttpRequest();
  req.open("GET", "race_results.json", false);
  req.send(null);
  var results = JSON.parse(req.responseText);

  var startTimes = [];
  results.forEach(function(result) {
    if (result.gunTime.match(/\d*\:\d*\:\d*/)) {
      var gunTimeRegex = result.gunTime.match(/(\d*)\:(\d*)\:(\d*)/)
      var gunTimeHours = parseInt(gunTimeRegex[1]);
      var gunTimeMinutes = parseInt(gunTimeRegex[2]);
      var gunTimeSeconds = parseInt(gunTimeRegex[3]);
    } else {
      var gunTimeRegex = result.gunTime.match(/(\d*)\:(\d*)/)
      var gunTimeHours = 0;
      var gunTimeMinutes = parseInt(gunTimeRegex[1]);
      var gunTimeSeconds = parseInt(gunTimeRegex[2]);
    }
    var gunTime = gunTimeHours * 3600 + gunTimeMinutes * 60 + gunTimeSeconds;

    if (result.chipTime.match(/\d*\:\d*\:\d*/)) {
      var chipTimeRegex = result.chipTime.match(/(\d*)\:(\d*)\:(\d*)/)
      var chipTimeHours = parseInt(chipTimeRegex[1]);
      var chipTimeMinutes = parseInt(chipTimeRegex[2]);
      var chipTimeSeconds = parseInt(chipTimeRegex[3]);
    } else {
      var chipTimeRegex = result.chipTime.match(/(\d*)\:(\d*)/)
      var chipTimeHours = 0;
      var chipTimeMinutes = parseInt(chipTimeRegex[1]);
      var chipTimeSeconds = parseInt(chipTimeRegex[2]);
    }
    var chipTime = chipTimeHours * 3600 + chipTimeMinutes * 60 + chipTimeSeconds;

    startTimes.push(gunTime-chipTime);
  });
 
  var sortedStartTimes = startTimes.slice();
  sortedStartTimes.sort(function(a, b) { return a-b; });
  console.log(sortedStartTimes);
  results.forEach(function(result, index) {
    result.startOrder = sortedStartTimes.indexOf(startTimes[index]) + 1;
  });

  return results;
}

/** 
 * Given a result and number of entrants, calculates 
 * vertical postion of that result on page in percent 
 **/
function verticalPosition(result, entrants) {
  return (((parseInt(result.startOrder) - parseInt(result.rank))/entrants) * 50) + 50;
}

/* Creates circle for each result */
function drawResults() {
  var results = getRaceResults();
  results.forEach(function(result) {
    var resultDiv = document.createElement("div");
    resultDiv.className = "result";
    resultDiv.style.top = verticalPosition(result, results.length).toString() + "%";
    resultDiv.style.left = ((result.rank/results.length)*100).toString() + "%";
    graph.appendChild(resultDiv);

    var runnerDetailsP = document.querySelector("#runnerDetails");
    var nameSpan = document.querySelector("#name");
    var citySpan = document.querySelector("#city");
    var gunTimeSpan = document.querySelector("#gunTime");
    var chipTimeSpan = document.querySelector("#chipTime");
    var rankSpan = document.querySelector("#rank");
    var startOrderSpan = document.querySelector("#startOrder");

    resultDiv.addEventListener("mouseenter", function(event) {
      event.target.style.backgroundColor = "#92982E";
      runnerDetailsP.style.display = "block";
      nameSpan.textContent = result.name;
      citySpan.textContent = result.city;
      gunTimeSpan.textContent = result.gunTime;
      chipTimeSpan.textContent = result.chipTime;
      rankSpan.textContent = result.rank;
      startOrderSpan.textContent = result.startOrder;
    });

    resultDiv.addEventListener("mouseleave", function(event) {
      event.target.style.backgroundColor = "#ebc483";
      runnerDetailsP.style.display = "none";
    });
  });
}

drawResults();
