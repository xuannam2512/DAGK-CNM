

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
    <div id='table-book'>
      <h3>
        Danh Sách Đặt Xe
      </h3>
      <br>  
      <table class='table table-bordered table-dark'>
        <thead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>Họ và tên</th>
            <th scope='col'>Số điện thoại</th>
            <th scope='col'>Địa chỉ</th>
            <th scope='col'>X</th>
            <th scope='col'>Y</th>
            <th scope='col'>Ghi chú</th>
            <th scope='col'>Trang thai</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
            <!-- looop to load data -->
          <tr v-for="(request, index) in requests" :key="index">
            <th scope='row'>{{index}}</th>
            <td>{{request.nameString}}</td>
            <td>{{request.phone}}</td>
            <td>{{request.addressString}}</td>
            <td>{{request.x}}</td>
            <td>{{request.y}}</td>
            <td>{{request.noteString}}</td>
            <td>{{request.status}}</td>
            <td>
              <button type="button" class="btn btn-primary btn-block mb-1" @click="locate(index)">Dinh Vi</button>                            
              <button type="button" class="btn btn-success btn-block" @click="save(index)">Luu</button>
            </td>
          </tr>

        </tbody>
      </table>
      <!-- <button @click="load">Load</button> -->
      <!-- <b-table id="my-table" ref="table" :busy.sync="isBusy" :items="myProvider"></b-table> -->
    </div>

    <div class="container">
        <!-- Content here -->
        <h3>Map</h3>
        <div class="google-map" :id="mapName"></div>
    </div>
  </div>
</template>

<script>
    var requests = [];
    let msgServer;
    var map;
    var address = "Bình Lợi, Bình Thạnh, TP Hồ Chí Minh";
    var markerIndex;
    var locationObject;

    //install vue-sse package (search vue-sse package)
    import VueSSE from 'vue-sse'
    import Vue from 'vue'

    Vue.use(VueSSE);

    export default {
        name: 'Home',
        props: ['name'],
        data() {         
            //Get data firstly
            axios({
                method:'get',
                url: `http://localhost:3000/api/requests?ts=0`,
                headers: {                    
                    'x-access-token': localStorage.getItem("accessToken")
                }
            })
            .then(res => {
                requests = res.data.rows;           
                this.requests = requests;
            })
            .catch(err => {
                console.log(err);
                return []
            })
            
            return {
                // isBusy: false
                requests: [],
                mapName: this.name + "-map"
            }
        },
        methods: {
            logout() {
                let user = {
                    userId: localStorage.getItem("userId")
                } 

                let formBody = [];
                for (let property in user) {
                    let encodedKey = encodeURIComponent(property);
                    let encodedValue = encodeURIComponent(user[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");                

                axios({
                    method:'post',
                    url: 'http://localhost:3000/api/users/logout',
                    data: formBody,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'x-access-token': localStorage.getItem("accessToken")
                    }
                })
                .then((response) => {
                    if(response.status === 200) {
                        alert("logout is successful");
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem('userId');
                        this.$router.push('/login');
                    }                
                })
                .catch((err) => {
                    alert("error: " + err);
                    if(err.response.status === 401) {
                        let token = localStorage.getItem("refreshToken");
                        alert("err: " + err);
                        axios({
                            method:'post',
                            url: `http://localhost:3000/api/authen/accesstoken`,
                            data: {
                                refeshToken: token
                            },
                            headers: {
                                'Content-Type': 'application/json'                              
                            }
                        })
                        .then((response) => {
                            if(response.status === 200) {
                                let accesstoken = response.data.accesToken;
                                console.log(accesstoken);
                                localStorage.setItem("accessToken", accesstoken);
                                this.logout();
                            }                            
                        })
                        .catch(err => {
                            console.log("error: " + err);
                        })
                    }
                })
            },
            save(index) {
                alert(index);
                axios({
                    method:'put',
                    url: `http://localhost:3000/api/requests`,
                    data: {
                        	id: this.requests[index].id,
                            nameString: this.requests[index].nameString,
                            phone: this.requests[index].phone,
                            addressString: this.requests[index].addressString,
                            x: this.requests[index].x,
                            y: this.requests[index].y,
                            status: "Da dinh vi",
                            noteString: this.requests[index].noteString
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem("accessToken")
                    }
                })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    if(err.response.status === 401) {
                        let token = localStorage.getItem("refreshToken");                        
                        axios({
                            method:'post',
                            url: `http://localhost:3000/api/authen/accesstoken`,
                            data: {
                                refeshToken: token
                            },
                            headers: {
                                'Content-Type': 'application/json'                              
                            }
                        })
                        .then((response) => {
                            if(response.status === 200) {
                                let accesstoken = response.data.accesToken;                                
                                localStorage.setItem("accessToken", accesstoken);
                                this.save(index);
                            }                            
                        })
                        .catch(err => {
                            console.log("error: " + err);
                        });
                    }
                    console.log("err: " + err);
                })
            },
            locate(index) {
                let address = "";
                address = this.requests[index].addressString;
                var self = this;

                //set status by call api
                axios({
                    method:'put',
                    url: `http://localhost:3000/api/requests`,
                    data: {
                        	id: this.requests[index].id,
                            nameString: this.requests[index].nameString,
                            phone: this.requests[index].phone,
                            addressString: this.requests[index].addressString,
                            x: this.requests[index].x,
                            y: this.requests[index].y,
                            status: "Dang dinh vi",
                            noteString: this.requests[index].noteString
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem("accessToken")
                    }
                })
                .then(res => {
                    if (res.status === 200) {   
                        console.log("jump here");                                     
                    }
                })
                .catch(err => {
                    alert("error: " + err);
                    if(err.response.status === 401) {
                        let token = localStorage.getItem("refreshToken");                        
                        axios({
                            method:'post',
                            url: `http://localhost:3000/api/authen/accesstoken`,
                            data: {
                                refeshToken: token
                            },
                            headers: {
                                'Content-Type': 'application/json'                              
                            }
                        })
                        .then((response) => {
                            if(response.status === 200) {
                                let accesstoken = response.data.accesToken;                                
                                localStorage.setItem("accessToken", accesstoken);
                                this.locate(index);
                            }                            
                        })
                        .catch(err => {
                            console.log("error: " + err);
                        });
                    }
                })

                map = new google.maps.Map(document.getElementById(this.mapName), {
                    zoom: 18,
                    center: { lat: 10.8230989, lng: 106.6296638 }
                });
                var geocoder = new google.maps.Geocoder();            
                
                //load map and set maker with address
                geocoder.geocode({ 'address':  address }, function (results, status) {
                    if (status === 'OK') {
                        locationObject = results[0].geometry.location;
                        map.setCenter(results[0].geometry.location);
                        markerIndex = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                    }
                });

                //load map and set maker when choose any position on map by left click mouse on map
                google.maps.event.addListener(map, 'click', function (event) {
                markerIndex.setMap(null);                               
                geocoder.geocode({ 'location': event.latLng }, function (results, status) {
                    if (status === 'OK') {
                        locationObject = results[0].geometry.location;
                        map.setCenter(results[0].geometry.location);
                        markerIndex = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                        console.log(results[0].geometry.location.toJSON());  
                        self.requests[index].x =  results[0].geometry.location.toJSON().lat;
                        self.requests[index].y =  results[0].geometry.location.toJSON().lng;
                    }
                });
            });
            }
        },
        mounted() {
            let self = this;
            //handle realtime: post new request
            Vue.SSE('http://localhost:3000/requestAddedEvent', { format: 'json'})
            .then(sse => {
                msgServer = sse;
                sse.onError(e => {
                    console.error('lost connection; giving up!', e);
        
                sse.close();
                });
                sse.subscribe('REQUEST_ADDED', data => {                                    
                    self.requests.push(data);
                });
            })
            .catch(err => {                        
                console.error('Failed to connect to server', err);
            });

            //handle realtime: change status

            Vue.SSE('http://localhost:3000/requestChangeStatus', { format: 'json'})
            .then(sse => {
                msgServer = sse;
                sse.onError(e => {
                    console.error('lost connection; giving up!', e);
        
                sse.close();
                });
                sse.subscribe('REQUEST_CHANGE_STATUS', data => {                                    
                    for(let i = 0; i < self.requests.length; i++) {
                        if(self.requests[i].id == data.id) {
                            self.requests[i].status = data.status;
                            self.requests[i].x = data.x;
                            self.requests[i].y = data.y;
                        }
                    }
                });
            })
            .catch(err => {                        
                console.error('Failed to connect to server', err);
            });

            //init map
            const element = document.getElementById(this.mapName)
            const options = {
                zoom: 14,
                center: new google.maps.LatLng(51.501527,-0.1921837)
            }
            const map = new google.maps.Map(element, options);
           
        }
    };
</script>

<style scoped>
    .google-map {
        width: 800px;
        height: 600px;
        margin: 0 auto;
        background: gray;
        }
    #app1 {
        background-image: linear-gradient(to right, #5F56CC, #B651C2);
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
    
    #name input[type=text] {
        width: 100%;
        display: inline-block;
        border: none;
        box-sizing: border-box;
        background-color: #E6E6E6;
        border-radius: 20px;
        font-family: Poppins-Medium;
        font-size: 15px;
        color: #666666;
        height: 30px;
        padding-left: 20px;
    }
    
    #phone input[type=text] {
        width: 100%;
        display: inline-block;
        border: none;
        box-sizing: border-box;
        background-color: #E6E6E6;
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
    
    .row2 input[type=text] {
        width: 100%;
        display: inline-block;
        border: none;
        box-sizing: border-box;
        background-color: #E6E6E6;
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
    
    .row3 input[type=text] {
        width: 100%;
        display: inline-block;
        border: none;
        box-sizing: border-box;
        background-color: #E6E6E6;
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
        background-color:red;
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
</style>

