function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Route')
    .addItem('Plan Nearest Neighbor Route', 'calculateNearestNeighborRoute')
    .addToUi();
}

function calculateNearestNeighborRoute() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();

  var origin = data[0][1]; // Başlangıç noktası (B1 hücresinden)
  var destinations = data.slice(1).map(row => row[1]).filter(Boolean); // Diğer noktalar

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var existingSheet = spreadsheet.getSheetByName("Optimized Route");
  if (existingSheet) {
    spreadsheet.deleteSheet(existingSheet);
  }
  var optimizedSheet = spreadsheet.insertSheet("Optimized Route");
  optimizedSheet.appendRow(["Sıra", "Nokta", "Mesafe (km)", "Süre"]);

  var route = [origin];
  var currentPoint = origin;
  var totalDistance = 0;
  var order = 1;

  while (destinations.length > 0) {
    var closestPointData = getClosestPoint(currentPoint, destinations);
    
    if (!closestPointData) break; // Eğer mesafe hesaplanamazsa çık

    var closestPoint = closestPointData.destination;
    var shortestDistance = closestPointData.distance;
    var duration = closestPointData.duration;

    optimizedSheet.appendRow([order, closestPoint, shortestDistance.toFixed(2), duration]);

    totalDistance += shortestDistance;
    currentPoint = closestPoint;
    destinations = destinations.filter(point => point !== closestPoint);
    order++;
  }

  optimizedSheet.appendRow(["", "Toplam Mesafe", totalDistance.toFixed(2) + " km"]);
}

// 🔥 En yakın noktayı bulan fonksiyon
function getClosestPoint(origin, destinations) {
  var shortestDistance = Number.MAX_VALUE;
  var closestPoint = null;
  var bestDuration = "";

  for (var i = 0; i < destinations.length; i++) {
    var destination = destinations[i];

    // Google Maps API ile mesafeyi hesapla
    var directions = Maps.newDirectionFinder()
      .setOrigin(origin)
      .setDestination(destination)
      .getDirections();

    var routeInfo = directions.routes[0];
    if (routeInfo && routeInfo.legs && routeInfo.legs[0]) {
      var distance = routeInfo.legs[0].distance.value / 1000; // Metreyi km'ye çevir
      var duration = routeInfo.legs[0].duration.text;

      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestPoint = destination;
        bestDuration = duration;
      }
    }
  }

  return closestPoint ? { destination: closestPoint, distance: shortestDistance, duration: bestDuration } : null;
}
