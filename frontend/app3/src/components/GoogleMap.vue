
<template>
  <div class="google-map" :id="mapName"></div>
</template>

<script>

var markerCoords = [{latitude: 10.762671, longitude: 106.681240}];
var markers = [];
var map = null;


export default {
  name: 'google-map',
  props: ['name'],
  data: function () {
    return {
      mapName: this.name + "-map",
    }
  },
  methods: {
      getRoute(requestAddress, driverAddress) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        var request = {
            origin: driverAddress,
            destination: requestAddress,
            travelMode: 'DRIVING'
        };

        directionsService.route(request, function(result, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(result);
            }
        });
      }
  },
  mounted: function () {
    const bounds = new google.maps.LatLngBounds();
    const element = document.getElementById(this.mapName)
    const mapCentre = markerCoords[0];
    const options = {
      center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
    }
    map = new google.maps.Map(element, options);
    markerCoords.forEach((coord) => {
        const position = new google.maps.LatLng(coord.latitude, coord.longitude);
        const marker = new google.maps.Marker({
            position,
            map
        });

        markers.push(marker);

        map.fitBounds(bounds.extend(position));
    });
  }
};
</script>

<style scoped>
.google-map {
  width: 600px;
  height: 400px;
  margin: 0 auto;
  background: gray;
}
</style>