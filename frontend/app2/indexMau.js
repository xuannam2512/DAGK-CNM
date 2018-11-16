
var map;
var markerIndex;
var CurrentPosition;
var mapObject ;
var locationObject;


function initMap() {

    var promise1 = new Promise(function(resolve, reject) {
      
            var latlng ;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition,errorHandler);
            } 
        
        function showPosition(position) {
            console.log('non error');
            resolve({lat: position.coords.latitude, lng: position.coords.longitude});
          
            }
            function errorHandler(err) {
                resolve(null);
             }
        
        
    })
      promise1.then(function(value) {
        console.log(' buoc 2 ' );
        //function getLocation() {
        if(value == null) {
            // set mặc định là địa điểm của trường cơ sở I
         value = { lat: 10.7624165, lng: 106.6790126};
        } 

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: { lat: 10.7624165, lng: 106.6790126}
        });
        var geocoder = new google.maps.Geocoder();
    
        //console.log('CurrentPosition',CurrentPosition);
       // "lat":10.8142,"lon":106.6438
        //console.log('latlng',value);
       
        geocoder.geocode({ 'location': value }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                markerIndex = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            }
            else  {
                console.log('err bi loi');
            }
        });
      })
      .catch(function(){
        console.log(' buoc 3 ' );
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: { lat: 10.814200401306152, lng: 106.643798828125}
        });
        var geocoder = new google.maps.Geocoder();
    
        //console.log('CurrentPosition',CurrentPosition);
       // "lat":10.8142,"lon":106.6438
        //console.log('latlng',value);
        geocoder.geocode({ 'location': map.center }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                markerIndex = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            }
            else  {
                console.log('err bi loi');
            }
        });
      });

    // $.getJSON('https://ipinfo.io/geo', function (response) {
    //     var loc = response.loc.split(',');
    //     var coords = {
    //         latitude: loc[0],
    //         longitude: loc[1]
    //     };
    //     CurrentPosition = coords;
    // });

    // map = new google.maps.Map(document.getElementById('map'), {
    //     zoom: 16,
    //     center: { lat: 10.8230989, lng: 106.6296638 }
    // });
    // var geocoder = new google.maps.Geocoder();

    // console.log(CurrentPosition);
    // geocoder.geocode({ 'location': CurrentPosition }, function (results, status) {
    //     if (status === 'OK') {
    //         map.setCenter(results[0].geometry.location);
    //         markerIndex = new google.maps.Marker({
    //             map: map,
    //             position: results[0].geometry.location
    //         });
    //     }
    // });
    // This event listener calls addMarker() when the map is clicked.
    // google.maps.event.addListener(map, 'click', function (event) {
    //     // addMarker(event.latLng, map);
    //     alert('hello1');
    // });
   

   // geocodeAddress(geocoder, map);
    //geoCode();
    // });
   
}




function loadMap(address) {
    //console.log('da vao day');
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: { lat: 10.8230989, lng: 106.6296638 }
    });
    var geocoder = new google.maps.Geocoder();


    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            $(mapObject).closest('tr').find('td:eq(2)').text(results[0].formatted_address)  ;
            locationObject = results[0].geometry.location;
            console.log(results[0].geometry.location);
            map.setCenter(results[0].geometry.location);
            markerIndex = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
    });
    google.maps.event.addListener(map, 'click', function (event) {
         //addMarker(event.latLng, map);
        markerIndex.setMap(null);
        //console.log(results);

        //addMarker(event.latLng);
        geocoder.geocode({ 'location': event.latLng }, function (results, status) {
            if (status === 'OK') {
                // set addressString
                $(mapObject).closest('tr').find('td:eq(2)').text(results[0].formatted_address)  ;
                locationObject = results[0].geometry.location;
                map.setCenter(results[0].geometry.location);
                markerIndex = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                console.log(results);
                console.log(`vi tri: ${results[0].geometry.location} || ten dia chi : ${results[0].formatted_address}`);
                console.log(results[0].geometry.location.toJSON());
            }
        });
    });
}




function addMarker(location) {
    markerIndex = new google.maps.Marker({
        position: location,
        map: map
    });
    //markers.push(marker);
}
//     function initMap() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 4,
//       center: {lat: -25.363882, lng: 131.044922 }
//     });

//     map.addListener('click', function(e) {
//       placeMarkerAndPanTo(e.latLng, map);
//     });
//   }

//   function placeMarkerAndPanTo(latLng, map) {
//     var marker = new google.maps.Marker({
//       position: latLng,
//       map: map
//     });
//     map.panTo(latLng);
//   }

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function geoCode() {
    let url = 'https://maps.googleapis.com/maps/api/geocode/json';
    let location = document.getElementById('address').value;
    axios.get(url, {
        params: {
            address: location,
            key: 'AIzaSyCkaoeBsFCyOhAMeC093vojdqv5KayRDiM'
        }
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
}


////////////////////////////////
    window.onload = function () {
        //console.log('xin chao');

        setupSSE();
        loadCategories();
    }


var setupSSE = function () {
    if (typeof (EventSource) === 'undefined') {
        console.log('not support');
        return;
    }

    var src = new EventSource('http://localhost:3000/categoryAddedEvent');

    src.onerror = function (e) {
        console.log('error: ' + e);
    }

    src.addEventListener('CATEGORY_ADDED', function (e) {
        var data = JSON.parse(e.data);
        var arr = [data];

        var source = document.getElementById('template').innerHTML;
        var template = Handlebars.compile(source);
        var html = template(arr);
        console.log(html);

        document.getElementById('list').innerHTML += html;
    }, false);
}

var loadCategories = function () {
    var url = 'http://localhost:3000/api/requests?ts=0';
    axios.get(url)
        .then(function (res) {
            var source = document.getElementById('template').innerHTML;
            var template = Handlebars.compile(source);
            var html = template(res.data.rows);
            console.log(html);
            document.getElementById('list').innerHTML += html;
        }).catch(function (err) {
            console.log(err);
        }).then(function () {

        })
}

///////////////////////////////
        // lấy 1 địa (x,y) CurrentLocation của trang web
      
        //Xóa dữ liệu 
        $('#table').on('click', '#click', function () {
            mapObject = this;

            // console.log({
            //     id: parseInt($(mapObject).closest('tr').find('td:eq(6)').text()) ,
            //     addressString : `${$(mapObject).closest('tr').find('td:eq(2)').text()}`,
            //     x : locationObject.toJSON().lat,
            //     y : locationObject.toJSON().lng,
            // });
            var url = 'http://localhost:3000/api/requests';
            axios.put(url, {
                id: parseInt($(mapObject).closest('tr').find('td:eq(6)').text()) ,
                addressString : `${$(mapObject).closest('tr').find('td:eq(2)').text()}`,
                x : locationObject.toJSON().lat,
                y : locationObject.toJSON().lng,
            })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
        });
        $('#table').on('dblclick', '#row', function () {
            //alert($(this).closest('tr').find('td:eq(6)').text());
            mapObject = this;
            var addressString = $(mapObject).closest('tr').find('td:eq(2)').text();
             loadMap(addressString);
        });

   
    