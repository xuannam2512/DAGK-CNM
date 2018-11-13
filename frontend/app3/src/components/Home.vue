

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
          </tr>
        </thead>
        <tbody id="list-request">
            <tr v-for="request in requests">
                <td>{{request.id}}</td>
                <td>{{request.nameString}}</td>
                <td>{{request.phone}}</td>
                <td>{{request.addressString}}</td>
                <td>{{request.noteString}}</td>
                <td>"Đã định vị"</td>
            </tr>
		</tbody>
      </table>
    </div>
  </div>

</template>

<script>
import Vue from 'vue'
import cookie from 'vue-cookie'

import Home from './Home'
import HomeComponent from '../router/index.js'

Vue.use(cookie);

    export default {
        name: 'Home',
        data() {
            return {
                requests: [{
                    id: 1,
                    nameString: "Duc",
                    phone: "0123",
                    addressString: "tc",
                    noteString: "note"
                }]
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
                })
            },
            setupSSE() {
                if (typeof (EventSource) === 'undefined') {
                    console.log('not support');
                    return;
                }

                var src = new EventSource('http://localhost:3000/requestAddedEvent');

                src.onerror = function (e) {
                    console.log('error: ' + e);
                }

                src.addEventListener('REQUEST_ADDED', function (e) {
                    var data = JSON.parse(e.data);
                    var arr = [data];
                }, false);
            },
            loadRequests() {
                var url = 'http://localhost:3000/api/requests?ts=0';
                axios.get(url)
                    .then(function (res) {

                    }).catch(function (err) {
                        console.log(err);
                    })
            }
        }

    };

    window.addEventListener('DOMContentLoaded', function(event) {
        Home.methods.setupSSE();
        Home.methods.loadRequests();
    });

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

