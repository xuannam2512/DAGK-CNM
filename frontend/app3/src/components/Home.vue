

<template>
    <div id='app3'>
    <div id='header'>
      <div id='logo-img'></div>
      <div id='title'>
          <div class="logout">
              <button @click="logout()">
                  <i class="fas fa-sign-out-alt"></i>
              </button>
          </div>
        <h1>
          MY APP#03
        </h1>        
      </div>
    </div>
    <GoogleMap name="example"></GoogleMap>
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
            <th scope='col'>Ghi chú</th>
            <th scope='col'>Tình trạng</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="list-request">
            <tr v-for="(request, index) in requests" :key="index">
                <td>{{index + 1}}</td> 
                <td>{{request.nameString}}</td>
                <td>{{request.phone}}</td>
                <td>{{request.addressString}}</td>
                <td>{{request.noteString}}</td>
                <td>{{request.status}}</td>
                <td>
                    <button v-if="request.status == 'Da co xe'" type="button" class="btn btn-info btn-sm" @click="getRoute(request.addressString)">Xem chi tiết</button>
                </td>
            </tr>
		</tbody>
      </table>
    </div>
  </div>

</template>

<script>

let msgServer;

import Vue from 'vue'
import cookie from 'vue-cookie'
import VueSSE from 'vue-sse'
import GoogleMap from './GoogleMap'

Vue.use(cookie);

    export default {
        name: 'Home',
        components: {
            GoogleMap
        },
        data() {
            let promise = axios.get('http://localhost:3000/api/requests?ts=0', {
                'headers': {
                    'x-access-token': localStorage.getItem("accessToken")
                }
            })
            promise.then((res) => {
                var rows = res.data.rows;      
                console.log(rows);          
                this.requests = res.data.rows;
            }).catch(error => {
                return []
            })
            return {
                requests: []
            }
        },
        methods: {
            getRoute(requestAddress) {
                GoogleMap.methods.getRoute(requestAddress, '227 Nguyen Van Cu');
            },
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
                })
            }
        },
        mounted() {
            let self = this;
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

            Vue.SSE('http://localhost:3000/requestChangedEvent', { format: 'json'})
            .then(sse => {
                msgServer = sse;
                sse.onError(e => {
                      console.error('lost connection; giving up!', e);
        
                sse.close();
                });
                sse.subscribe('REQUEST_CHANGED', data => {
                    for (var i = 0; i < self.requests.length; i++) {
                        if (self.requests[i].id == data.id) {
                            self.requests[i].status = data.status;
                            break;
                        }
                    }
                });
            })
            .catch(err => {                        
                console.error('Failed to connect to server', err);
            });
        }

    };
</script>

<style>
    #app3 {
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

