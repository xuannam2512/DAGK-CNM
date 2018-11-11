
var map;
var markerIndex;
var CurrentPosition;




function initMap() {

    var promise1 = new Promise(function(resolve, reject) {
        
        $.getJSON('https://ipinfo.io/geo', function (response) {
            var loc = response.loc.split(',');
            var coords = {
                lat: loc[0],
                lng: loc[1]
            };
            console.log(' buoc 1 ',coords );
            CurrentPosition = coords;
            resolve(CurrentPosition);
        });
      });
      
      promise1.then(function(value) {
        console.log(' buoc 2 ' );
        //function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else { 
                //x.innerHTML = "Geolocation is not supported by this browser.";
            }
       // }
        
        function showPosition(position) {
            console.log("1111,Latitude: " + position.coords.latitude + 
            "Longitude: " + position.coords.longitude)  ;
        }

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: { lat: 10.814200401306152, lng: 106.643798828125}
        });
        var geocoder = new google.maps.Geocoder();
    
        console.log('CurrentPosition',CurrentPosition);
       // "lat":10.8142,"lon":106.6438
        console.log('value',value);
        var latlng = {lat: 10.814200401306152, lng: 106.643798828125};
        console.log('latlng',latlng);
        geocoder.geocode({ 'location': latlng }, function (results, status) {
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
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: { lat: 10.8230989, lng: 106.6296638 }
    });
    var geocoder = new google.maps.Geocoder();


    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            markerIndex = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
    });
    google.maps.event.addListener(map, 'click', function (event) {
        // addMarker(event.latLng, map);
        markerIndex.setMap(null);
        //console.log(results);

        //addMarker(event.latLng);
        geocoder.geocode({ 'location': event.latLng }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                markerIndex = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                console.log(`vi tri: ${results[0].geometry.location} || ten dia chi : ${results[0].formatted_address}`);

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
            var nameString = $(this).closest('tr').find('td:eq(0)').text();
            var phone = $(this).closest('tr').find('td:eq(1)').text();
            var addressString = $(this).closest('tr').find('td:eq(2)').text();
            var activeDate = $(this).closest('tr').find('td:eq(3)').text();

            console.log(`${nameString} , ${phone} , ${addressString} , ${activeDate}`);
        });
        $('#table').on('dblclick', '#row', function () {
            alert($(this).closest('tr').find('td:eq(6)').text());

            //var addressString = $(this).closest('tr').find('td:eq(2)').text();
            // loadMap(addressString);
        });

   
    