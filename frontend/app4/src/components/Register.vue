<template>
    <div id="container">
    <div id='register-container'>
      <div class='register-container-left'>
        <div class='register-image'>
        </div>
      </div>
      <div class='register-container-right'>
        <div class='register-container-right-top'>
          <span class='title-register'>Register</span>
          <div>
            <div class='email-container'>
              <span><i class='fas fa-user'></i></span>
              <input v-model="name" id='name' name="name" type='text' placeholder='Name' required>
            </div>
            <div class='email-container'>
              <span><i class='far fa-calendar-alt'></i></span>
              <input v-model="dob" id='dob' name="dob" type='date' required>
            </div>
            <div class='email-container'>
              <span><i class='fas fa-envelope'></i></span>
              <input v-model="email" id='email' name="email" type='email' placeholder='Email' required>
            </div>
            <div class='email-container'>
              <span><i class='fas fa-user'></i></span>
              <input v-model="username" id='username' name="username" type='text' placeholder='Username' required>
            </div>
            <div class='email-container'>
              <span><i class='fas fa-lock'></i></span>
              <input v-model="password" id='password' name="password" type='password' placeholder='Password' required>
            </div>
            <div class='email-container'>
              <span><i class='fas fa-lock'></i></span>
              <input v-model="repeat_password" id='repeat_password' name="repeat_password" type='password' placeholder='Repeat Your Password' required>
            </div>
            <button @click="register">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'Register',
        data() {
            return {
                username: "",
                password: "",
                repeat_password: "",
                name: "",
                email: "",
                dob: ""
            };
        },
        methods: {
            register() {
                let username = this.username;
                let password = this.password;
                let repeatPassword = this.repeat_password;
                let name = this.name;
                let email = this.email;
                let dob = this.dob;

                //check info
                if(username.indexOf(' ') > 0) {
                    alert("Username is not white space!");
                } else {
                    if (password != repeatPassword) {
                        alert("Repeat password is invalid!");
                    } else {
                        let userEntity = {
                            username: username,
                            password: password,
                            name: name,
                            email: email,
                            dob: dob,
                            permission: 4
                        }

                        console.log(userEntity);

                        let formBody = [];
                        for (let property in userEntity) {
                            let encodedKey = encodeURIComponent(property);
                            let encodedValue = encodeURIComponent(userEntity[property]);
                            formBody.push(encodedKey + "=" + encodedValue);
                        }
                        formBody = formBody.join("&");

                        let url = 'http://localhost:3000/api/users'

                        axios({
                            method: 'post',
                            url: url,
                            data: formBody,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                            .then(response => {
                                if(response.status === 201) {
                                    console.log("user entity: ", response);
                                    axios({
                                        method:'post',
                                        url: `http://localhost:3000/api/drivers`,
                                        data: {
                                            userId: response.data.insertId,
                                            status: 'Stand by'
                                        },
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                    .then(res => {
                                        console.log("Post driver: ", res);
                                        alert("Register is successful")   
                                        this.$router.push('/login');
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })                                                                                                         
                                } else {
                                    if(response.status === 203) {
                                        alert("Username is exist!!");
                                    }
                                }				
                            })
                            .catch(err => {
                                console.log("err: " + err);
                                alert("Server Error: " + err);
                            });
                    }
                }
            }
        }
    };
</script>

<style>
    #container {
      background-image: linear-gradient(to right, #5F56CC, #B651C2);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    #register-container {
        background-color: #FFFFFF;
        margin: 10px 5%;
        padding: 70px 5%;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
    }
    
    .register-container-left {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .register-container-right {
        width: 50%;
        display: flex;
        flex-flow: column;
    }
    
    .register-container-right-top {
        width: 100%;
        flex: 0 1 auto;
    }
    
    .register-image {
        width: 200px;
        height: 200px;
        background-color: red;
        border-radius: 50%;
    }
    
    #register-container input[type=text] {
        padding: 12px 20px;
        margin: 0 auto;
        display: inline-block;
        border: none;
        box-sizing: border-box;
        background-color: #E6E6E6;
        border-radius: 20px;
        width: 80%;
        font-family: Poppins-Medium;
        font-size: 15px;
        color: #666666;
    }
    
    #register-container input[type=date] {
        padding: 8px 20px;
        margin: 0 auto;
        display: inline-block;
        border: none;
        box-sizing: border-box;
        background-color: #E6E6E6;
        border-radius: 20px;
        width: 80%;
        font-family: Poppins-Medium;
        font-size: 15px;
        color: #666666;
    }

    #register-container input[type=email] {
        padding: 8px 20px;
        margin: 0 auto;
        display: inline-block;
        border: none;
        box-sizing: border-box;
        background-color: #E6E6E6;
        border-radius: 20px;
        width: 80%;
        font-family: Poppins-Medium;
        font-size: 15px;
        color: #666666;
    }
    
    #register-container input[type=password] {
        padding: 12px 20px;
        margin: 0 auto;
        display: inline-block;
        border: none;
        box-sizing: border-box;
        background-color: #E6E6E6;
        border-radius: 20px;
        width: 80%;
        font-family: Poppins-Medium;
        font-size: 15px;
        color: #666666;
    }
    
    .title-register {
        font-family: Poppins-Bold;
        font-size: 24px;
        text-align: center;
        width: 100%;
        display: block;
        padding-bottom: 30px;
        font-weight: bold;
    }
    
    .register {
        height: 100px;
        flex: 1 1 auto;
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }
    
    .email-container {
        padding: 0 15px;
        width: 100%;
        margin: 5px 0;
        display: inline-block;
        border: none;
        box-sizing: border-box;
        background-color: #E6E6E6;
        border-radius: 20px;
    }
    
    .email-container span {
        float: left;
        margin: 10px 5px;
    }
    
    #register-container button {
        width: 100%;
        border: none;
        background-color: #57b846;
        padding: 12px 20px;
        margin: 15px 0;
        color: white;
        border-radius: 20px;
    }
</style>

