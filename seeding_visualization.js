/* Requests race results data and converts to JavaScript object */
function getRaceResults() {
  var req = new XMLHttpRequest();
  req.open("GET", "race_results.json", false);
  req.send(null);
  return JSON.parse(req.responseText);
}

console.log(getRaceResults());
