

<template>
    <div id='app1'>
    <div id='header'>
      <div id='logo-img'></div>
      <div id='title'>
          <div class="logout">
              <button @click="logout()">
                  <i class="fas fa-sign-out-alt"></i>
              </button>
          </div>
        <h1>
          MY APP#01
        </h1>        
      </div>
    </div>    
    <div class="container">
        <br>        
        <div class="button-list">
            <div class="dropdown">
                <button :class="classObject" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                   {{status}}
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#" @click="chooseStatus(1)">Active</a>
                    <a class="dropdown-item" href="#" @click="chooseStatus(2)">Stand by</a>
                    <a class="dropdown-item" href="#" @click="chooseStatus(3)">Busy</a>
                </div>
            </div>
            <button class="btn-success btn" @click="locateMyLocation">Vị trí của tôi</button>            
            <button class="btn-success btn" @click="startOrFinish" :disabled="disabled == 1 ? true : false">{{actionStr}}</button>            
            <button class="btn-danger btn" @click="save">Lưu</button>
        </div>       
        <!-- Content here -->        
        <div class="google-map" :id="mapName"></div>
    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title font-weight-bold" id="exampleModalLabel">Bạn có muốn nhận yêu cầu này không?</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="request">
                    <div class="label">
                        <span>Tên: </span>
                    </div>
                    <input v-model="nameString" class="inputrequest" type=text disabled/>
                </div>
                <div id="request">
                    <div class="label">
                        <span>SDT: </span>
                    </div>
                    <input v-model="phone" class="inputrequest" type=text disabled/>
                </div>
                <div id="request">
                    <div class="label">
                        <span>Địa chỉ: </span>
                    </div>
                    <input v-model="address" class="inputrequest" type=text disabled/>
                </div>
                <div id="request">
                    <div class="label">
                        <span>Ghi chú: </span>
                    </div>
                    <input v-model="note" class="inputrequest" type=text disabled/>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" @click="accept">Đồng ý</button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
var requests = [];
let msgServer;
var map;
var markerIndex;
var locationObject;
var ws;

//install vue-sse package (search vue-sse package)
import VueSSE from "vue-sse";
import Vue from "vue";

Vue.use(VueSSE);

export default {
  name: "Home",
  props: ["name"],
  data() {
    var x = 0,
      y = 0;
    var request;

    return {
      mapName: this.name + "-map",
      classObject: {
        btn: true,
        "btn-secondary": false,
        "btn-success": true,
        "btn-danger": false,
        "dropdown-toggle": true
      },
      status: "Active",
      message: "",
      nameString: "",
      phone: "",
      address: "",
      note: "",
      actionStr: "Bắt đầu",
      action: 0,
      disabled: 1
    };
  },
  methods: {
    accept() {
      let self = this;
      console.log(self.request);
      ws.send("YES");
      $("#exampleModal").modal("hide");
      //init map
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsService = new google.maps.DirectionsService();
      var map = new google.maps.Map(document.getElementById(this.mapName), {
        zoom: 14,
        center: { lat: 37.77, lng: -122.447 }
      });
      directionsDisplay.setMap(map);
      console.log(self.x);
      console.log(self.y);

      //caculate and display route
      directionsService.route(
        {
          origin: {
            lat: parseFloat(self.request.x),
            lng: parseFloat(self.request.y)
          }, // Haight.
          destination: { lat: parseFloat(self.x), lng: parseFloat(self.y) }, // Ocean Beach.
          travelMode: google.maps.TravelMode["DRIVING"]
        },
        function(response, status) {
          if (status == "OK") {
            alert("Show route");
            directionsDisplay.setDirections(response);
            self.chooseStatus(3);
            self.disabled = 0;
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    },
    updateDrivers(x, y, status) {
      let self = this;

      return new Promise((resolve, reject) => {
        axios({
          method: "put",
          url: `http://localhost:3000/api/drivers`,
          data: {
            x: x,
            y: y,
            status: status,
            userId: localStorage.getItem("userId")
          },
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken")
          }
        })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    updateAccessToken() {
      return new Promise((resolve, reject) => {
        let token = localStorage.getItem("refreshToken");
        alert("err: " + err);
        axios({
          method: "post",
          url: `http://localhost:3000/api/authen/accesstoken`,
          data: {
            refeshToken: token
          },
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => {
            if (response.status === 200) {
              let accesstoken = response.data.accesToken;
              console.log(accesstoken);
              localStorage.setItem("accessToken", accesstoken);
              resolve(accesstoken);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    startOrFinish() {
      let self = this;
      alert(self.actionStr);

      if (self.action == 0) {
        console.log(self.action);
        self.actionStr = "Kết thúc";
        self.action = 1;
      } else {
        self.actionStr = "Bắt đầu";
        self.action = 0;
        self.disabled = 1;

        axios({
          method: "put",
          url: `http://localhost:3000/api/requests`,
          data: {
            id: self.request.id,
            nameString: self.request.nameString,
            phone: self.request.phone,
            addressString: self.request.addressString,
            x: self.request.x,
            y: self.request.y,
            status: "Dang xong",
            noteString: self.request.noteString,
            isFindDriver: false
          },
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken")
          }
        })
          .then(res => {
            if (res.status === 200) {
              console.log("jump here");
            }
          })
          .catch(err => {
            alert("error: " + err);
            if (err.response.status === 401) {
              let token = localStorage.getItem("refreshToken");
              axios({
                method: "post",
                url: `http://localhost:3000/api/authen/accesstoken`,
                data: {
                  refeshToken: token
                },
                headers: {
                  "Content-Type": "application/json"
                }
              })
                .then(response => {
                  if (response.status === 200) {
                    let accesstoken = response.data.accesToken;
                    localStorage.setItem("accessToken", accesstoken);
                    this.locate(index);
                  }
                })
                .catch(err => {
                  console.log("error: " + err);
                });
            }
          });
      }
    },
    chooseStatus(index) {
      let self = this;

      switch (index) {
        case 1:
          self
            .updateDrivers(self.x, self.y, "Active")
            .then(res => {
              let classObjectSuccess = {
                btn: true,
                "btn-warning": false,
                "btn-success": true,
                "btn-danger": false,
                "dropdown-toggle": true
              };
              self.classObject = classObjectSuccess;
              self.status = "Active";
              alert("update status thanh cong!");
            })
            .catch(err => {
              if (err.response.status === 401) {
                let token = localStorage.getItem("refreshToken");
                alert("err: " + err);
                axios({
                  method: "post",
                  url: `http://localhost:3000/api/authen/accesstoken`,
                  data: {
                    refeshToken: token
                  },
                  headers: {
                    "Content-Type": "application/json"
                  }
                })
                  .then(response => {
                    if (response.status === 200) {
                      let accesstoken = response.data.accesToken;
                      console.log(accesstoken);
                      localStorage.setItem("accessToken", accesstoken);
                      self.chooseStatus(index);
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            });

          break;
        case 2:
          self
            .updateDrivers(self.x, self.y, "Stand by")
            .then(res => {
              console.log(res);
              let classObjectWarning = {
                btn: true,
                "btn-warning": true,
                "btn-success": false,
                "btn-danger": false,
                "dropdown-toggle": true
              };
              self.classObject = classObjectWarning;
              self.status = "Stand by";
              alert("Update status thanh cong");
            })
            .catch(err => {
              if (err.response.status === 401) {
                let token = localStorage.getItem("refreshToken");
                alert("err: " + err);
                axios({
                  method: "post",
                  url: `http://localhost:3000/api/authen/accesstoken`,
                  data: {
                    refeshToken: token
                  },
                  headers: {
                    "Content-Type": "application/json"
                  }
                })
                  .then(response => {
                    if (response.status === 200) {
                      let accesstoken = response.data.accesToken;
                      console.log(accesstoken);
                      localStorage.setItem("accessToken", accesstoken);
                      self.chooseStatus(index);
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            });

          break;
        case 3:
          self
            .updateDrivers(self.x, self.y, "Busy")
            .then(res => {
              console.log(res);
              let classObjectDanger = {
                btn: true,
                "btn-warning": false,
                "btn-success": false,
                "btn-danger": true,
                "dropdown-toggle": true
              };
              self.classObject = classObjectDanger;
              self.status = "Busy";
              alert("update status thanh cong!");
            })
            .catch(err => {
              if (err.response.status === 401) {
                let token = localStorage.getItem("refreshToken");
                alert("err: " + err);
                axios({
                  method: "post",
                  url: `http://localhost:3000/api/authen/accesstoken`,
                  data: {
                    refeshToken: token
                  },
                  headers: {
                    "Content-Type": "application/json"
                  }
                })
                  .then(response => {
                    if (response.status === 200) {
                      let accesstoken = response.data.accesToken;
                      console.log(accesstoken);
                      localStorage.setItem("accessToken", accesstoken);
                      self.chooseStatus(index);
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            });

          break;
        default:
          break;
      }
    },
    logout() {
      let user = {
        userId: localStorage.getItem("userId")
      };

      let formBody = [];
      for (let property in user) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(user[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      axios({
        method: "post",
        url: "http://localhost:3000/api/users/logout",
        data: formBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-access-token": localStorage.getItem("accessToken")
        }
      })
        .then(response => {
          if (response.status === 200) {
            alert("logout is successful");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");
            ws.close = function() {
              console.log("disconnected");
            };
            this.$router.push("/login");
          }
        })
        .catch(err => {
          alert("error: " + err);
          if (err.response.status === 401) {
            let token = localStorage.getItem("refreshToken");
            alert("err: " + err);
            axios({
              method: "post",
              url: `http://localhost:3000/api/authen/accesstoken`,
              data: {
                refeshToken: token
              },
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(response => {
                if (response.status === 200) {
                  let accesstoken = response.data.accesToken;
                  console.log(accesstoken);
                  localStorage.setItem("accessToken", accesstoken);
                  this.logout();
                }
              })
              .catch(err => {
                console.log("error: " + err);
              });
          }
        });
    },
    save() {
      let self = this;

      axios({
        method: "put",
        url: `http://localhost:3000/api/drivers`,
        data: {
          x: self.x,
          y: self.y,
          status: self.status,
          userId: localStorage.getItem("userId")
        },
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken")
        }
      })
        .then(res => {
          if (res.status === 200) {
            console.log(res);
            alert("Đa lưu vị trị mới!");
          }
        })
        .catch(err => {
          if (err.response.status === 401) {
            let token = localStorage.getItem("refreshToken");
            alert("err: " + err);
            axios({
              method: "post",
              url: `http://localhost:3000/api/authen/accesstoken`,
              data: {
                refeshToken: token
              },
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(response => {
                if (response.status === 200) {
                  let accesstoken = response.data.accesToken;
                  console.log(accesstoken);
                  localStorage.setItem("accessToken", accesstoken);
                  self.chooseStatus(index);
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    locate() {
      alert("Locate location");
      let self = this;

      map = new google.maps.Map(document.getElementById(this.mapName), {
        zoom: 18,
        center: { lat: 10.8230989, lng: 106.6296638 }
      });
      var geocoder = new google.maps.Geocoder();

      //load map and set maker with address
      geocoder.geocode({ address: address }, function(results, status) {
        if (status === "OK") {
          locationObject = results[0].geometry.location;
          map.setCenter(results[0].geometry.location);
          markerIndex = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
        }
      });

      //load map and set maker when choose any position on map by left click mouse on map
      google.maps.event.addListener(map, "click", function(event) {
        markerIndex.setMap(null);
        geocoder.geocode({ location: event.latLng }, function(results, status) {
          if (status === "OK") {
            locationObject = results[0].geometry.location;
            map.setCenter(results[0].geometry.location);
            markerIndex = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });
            console.log(results[0].geometry.location.toJSON());
          }
        });
      });
    },
    locateMyLocation() {
      alert("Vi tri cua toi");
      var self = this;
      var promise1 = new Promise(function(resolve, reject) {
        var latlng;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, errorHandler);
        }

        function showPosition(position) {
          console.log("non error");
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
        function errorHandler(err) {
          reject(null);
        }
      });
      promise1
        .then(function(value) {
          console.log(" buoc 2 ");
          //function getLocation() {
          if (value == null) {
            // set mặc định là địa điểm của trường cơ sở I
            value = { lat: 10.7624165, lng: 106.6790126 };
          }

          map = new google.maps.Map(document.getElementById(self.mapName), {
            zoom: 18,
            center: { lat: 10.7624165, lng: 106.6790126 }
          });
          var geocoder = new google.maps.Geocoder();

          geocoder.geocode({ location: value }, function(results, status) {
            if (status === "OK") {
              map.setCenter(results[0].geometry.location);
              markerIndex = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
              });
              self.x = results[0].geometry.location.toJSON().lat;
              self.y = results[0].geometry.location.toJSON().lng;
              self.save();
            } else {
              console.log("err bi loi");
            }
          });

          google.maps.event.addListener(map, "click", function(event) {
            //addMarker(event.latLng, map);
            markerIndex.setMap(null);
            //console.log(results);

            //addMarker(event.latLng);
            geocoder.geocode({ location: event.latLng }, function(
              results,
              status
            ) {
              if (status === "OK") {
                // set addressString
                locationObject = results[0].geometry.location;
                map.setCenter(results[0].geometry.location);
                markerIndex = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
                });
                self.x = results[0].geometry.location.toJSON().lat;
                self.y = results[0].geometry.location.toJSON().lng;
              }
            });
          });
        })
        .catch(function() {
          console.log(" buoc 3 ");
          map = new google.maps.Map(document.getElementById(self.mapName), {
            zoom: 18,
            center: { lat: 10.814200401306152, lng: 106.643798828125 }
          });
          var geocoder = new google.maps.Geocoder();

          geocoder.geocode({ location: map.center }, function(results, status) {
            if (status === "OK") {
              map.setCenter(results[0].geometry.location);
              markerIndex = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
              });
            } else {
              console.log("err bi loi");
            }
          });
        });
    }
  },
  mounted() {
    let self = this;

    //init map
    const element = document.getElementById(this.mapName);
    const options = {
      zoom: 14,
      center: new google.maps.LatLng(51.501527, -0.1921837)
    };
    const map = new google.maps.Map(element, options);

    //init websocket
    let userId = localStorage.getItem("userId");
    ws = new WebSocket("ws://localhost:40510", userId);
    ws.onopen = function() {
      console.log("connected");
      ws.send("Hello server backend");
    };

    ws.close = function() {
      console.log("disconnected");
    };

    ws.onmessage = function(payload) {
      console.log("request from server");

      if (payload.data != "") {
        let jsonRequest = JSON.parse(payload.data);
        self.request = jsonRequest;
        console.log(jsonRequest);

        self.nameString = jsonRequest.nameString;
        self.phone = jsonRequest.phone;
        self.address = jsonRequest.addressString;
        self.note = jsonRequest.noteString;

        $("#exampleModal").modal({
          show: true
        });
        setTimeout(() => {
          $("#exampleModal").modal("hide");
        }, 10000);
      }
    };

    //identify driver's location
    self.locateMyLocation();
    self.chooseStatus(1);
  },
  destroyed() {
    ws.close = function() {
      console.log("disconnected");
    };
  }
};
</script>

<style scoped>
.btn {
  margin: 0 8px;
}
.button-list {
  display: flex;
  justify-content: center;
  align-items: center;
}
.google-map {
  width: 400px;
  height: 500px;
  margin: 20px auto;
  background: gray;
}
#app1 {
  background-image: linear-gradient(to right, #5f56cc, #b651c2);
  height: 100vh;
  padding: 15px 25px;
}

#header {
  padding: 0 20px;
  margin: 40px 50px;
  margin-bottom: 0px;
  display: grid;
  grid-template-columns: auto auto;
}

#logo-img {
  width: 150px;
  height: 150px;
  background-color: red;
  border-radius: 50%;
}

#form-info {
  padding: 20px 30%;
}

.row1 {
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 10px 10px;
}

#name {
  margin: auto 5px;
}

#phone {
  margin: auto 5px;
}

#name input[type="text"] {
  width: 100%;
  display: inline-block;
  border: none;
  box-sizing: border-box;
  background-color: #e6e6e6;
  border-radius: 20px;
  font-family: Poppins-Medium;
  font-size: 15px;
  color: #666666;
  height: 30px;
  padding-left: 20px;
}

#phone input[type="text"] {
  width: 100%;
  display: inline-block;
  border: none;
  box-sizing: border-box;
  background-color: #e6e6e6;
  border-radius: 20px;
  font-family: Poppins-Medium;
  font-size: 15px;
  color: #666666;
  height: 30px;
  padding-left: 20px;
}

.row2 {
  padding: 10px 15px;
}

.row2 input[type="text"] {
  width: 100%;
  display: inline-block;
  border: none;
  box-sizing: border-box;
  background-color: #e6e6e6;
  border-radius: 20px;
  font-family: Poppins-Medium;
  font-size: 15px;
  color: #666666;
  height: 30px;
  padding-left: 20px;
}

.map {
  background-color: red;
  width: 100%;
  height: 300px;
  margin: 30px 30px;
  padding: 0 0;
}

.row3 {
  padding: 10px 15px;
}

.row3 input[type="text"] {
  width: 100%;
  display: inline-block;
  border: none;
  box-sizing: border-box;
  background-color: #e6e6e6;
  border-radius: 20px;
  font-family: Poppins-Medium;
  font-size: 15px;
  color: #666666;
  height: 30px;
  padding-left: 20px;
}

.row4 {
  padding: 10px 15px;
  display: flex;
  justify-content: center;
}

.row4 button {
  width: 50%;
  border: none;
  background-color: #57b846;
  color: white;
  border-radius: 20px;
  height: 30px;
}

.row4 button:hover {
  background-color: red;
}

#table-book {
  padding: 20px 10%;
}
.logout {
  width: 100%;
}

.logout button {
  float: right;
  border: none;
  font-size: 50px;
  background: none;
  color: #57b846;
}

.logout button:hover {
  float: right;
  border: none;
  font-size: 50px;
  background: none;
  color: red;
}
.img-modal {
  width: 100%;
  height: 100%;
}

#request {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
}

#request span {
  color: #57b846;
  font-weight: bold;
  float: right;
}

.inputrequest {
  border: none;
  width: 80%;
  border-bottom: 2px solid #57b846;
  margin: auto 10px;
  font-size: 18px;
  background-color: white;
}

#request .label {
  width: 100px;
}
</style>

