function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Route')
    .addItem('Plan Route', 'calculateRoute')
    .addToUi();
}

function calculateRoute() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var addresses = sheet.getRange("B1:B" + sheet.getLastRow()).getValues().flat().filter(String); // Boş değerleri filtrele

  var resultSheet = prepareResultSheet();

  var current = addresses[0]; // Başlangıç noktası
  var remaining = addresses.slice(1); // İlk nokta dışındaki tüm adresler

  while (remaining.length > 0) {
    var next = findClosestDestination(current, remaining);
    if (next.destination === "") { // Eğer geçerli bir sonraki adres bulunamazsa döngüyü bitir
      break;
    }
    var directions = Maps.newDirectionFinder()
                         .setOrigin(current)
                         .setDestination(next.destination)
                         .getDirections();
    var route = directions.routes[0];
    var legs = route.legs[0];
    var distance = legs.distance.text; // Metin olarak mesafe
    var duration = legs.duration.text; // Metin olarak süre

    resultSheet.appendRow([current, next.destination, distance, duration]);

    current = next.destination;
    remaining.splice(next.index, 1);
  }
}

function prepareResultSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var resultSheet = ss.getSheetByName("Distances");
  if (resultSheet) ss.deleteSheet(resultSheet);
  resultSheet = ss.insertSheet("Distances");
  resultSheet.appendRow(["From", "To", "Distance (meters)", "Duration (minutes)"]);
  return resultSheet;
}

function findClosestDestination(current, destinations) {
  var minDistance = Infinity;
  var closestIndex = -1;
  var closestDestination = "";

  for (var i = 0; i < destinations.length; i++) {
    try {
      var directions = Maps.newDirectionFinder()
                           .setOrigin(current)
                           .setDestination(destinations[i])
                           .getDirections();
      var route = directions.routes[0];
      var legs = route.legs[0];
      var distanceValue = legs.distance.value; // Sayısal değer

      if (distanceValue < minDistance) {
        minDistance = distanceValue;
        closestIndex = i;
        closestDestination = destinations[i];
      }
    } catch(e) {
      // Adres geçersizse bu blok çalışacak
      console.log("Geçersiz adres: " + destinations[i]);
    }
  }

  return { index: closestIndex, destination: closestDestination };
}
