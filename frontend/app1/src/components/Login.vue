<template>
  <div id="container">
      <div id='login-container'>
        <div class='login-container-left'>
          <div class='logo-image'></div>
        </div>
        <div class='login-container-right'>
          <div class='login-container-right-top'>
            <span class='title-login'>Member Login</span>
            <div id="form-login">
              <div class='email-container'>
                <span><i class='fas fa-envelope'></i></span>
                <input v-model="username" name='username' type='text' placeholder='Username' />
              </div>
              <div class='email-container'>
                <span><i class='fas fa-lock'></i></span>
                <input v-model="password" name='password' type='password' placeholder='Password' />
              </div>
              <button type='submit' @click="login">
                Login
              </button>
            </div>
            <div class='forgot-login'>
              <span>Forgot</span>
              <a href='#'>Username/Password?</a>
            </div>
          </div>
          <div class='register'>
            <a href='#/register'>
              <span>Create your Account</span>
              <i class='fas fa-long-arrow-alt-right'></i>
            </a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      let username = this.username;
      let password = this.password;

      //check info login
      if (username == "" || password == "") {
        alert("Username or password is not emplty!");
      } else {
        if (username.indexOf(" ") > 0) {
          alert("Username is not white space!");
        } else {
          //send request api

          axios({
            method: "post",
            url: "http://localhost:3000/api/users/login",
            data: {
              username: username,
              password: password,
              permission: 1
            },
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(response => {
              if (response.status === 201) {
                alert("Login is successful!!");
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem(
                  "refreshToken",
                  response.data.refreshToken
                );
                localStorage.setItem("userId", response.data.user.userId);
                this.$router.push("/");
              } else {
                if (response.status === 204) {
                  alert("Username or password invalid!");
                }
              }
            })
            .catch(err => {
              console.log("err: " + err);
            });
        }
      }
    }
  }
};
</script>

<style scoped>
#container {
  background-image: linear-gradient(to right, #5f56cc, #b651c2);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#login-container {
  background-color: #ffffff;
  margin: 10px 5%;
  padding: 70px 5%;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
}

.login-container-left {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container-right {
  width: 50%;
  display: flex;
  flex-flow: column;
}

.login-container-right-top {
  width: 100%;
  flex: 0 1 auto;
}

.logo-image {
  width: 200px;
  height: 200px;
  background-color: red;
  border-radius: 50%;
}

#login-container input[type="text"] {
  padding: 12px 20px;
  margin: 0 auto;
  display: inline-block;
  border: none;
  box-sizing: border-box;
  background-color: #e6e6e6;
  border-radius: 20px;
  width: 80%;
  font-family: Poppins-Medium;
  font-size: 15px;
  color: #666666;
}

#login-container input[type="date"] {
  padding: 8px 20px;
  margin: 0 auto;
  display: inline-block;
  border: none;
  box-sizing: border-box;
  background-color: #e6e6e6;
  border-radius: 20px;
  width: 80%;
  font-family: Poppins-Medium;
  font-size: 15px;
  color: #666666;
}

#login-container input[type="password"] {
  padding: 12px 20px;
  margin: 0 auto;
  display: inline-block;
  border: none;
  box-sizing: border-box;
  background-color: #e6e6e6;
  border-radius: 20px;
  width: 80%;
  font-family: Poppins-Medium;
  font-size: 15px;
  color: #666666;
}

.title-login {
  font-family: Poppins-Bold;
  font-size: 24px;
  text-align: center;
  width: 100%;
  display: block;
  padding-bottom: 30px;
  font-weight: bold;
}

.forgot-login {
  text-align: center;
}

.forgot-login span {
  font-size: 13px;
  line-height: 1.5;
  color: #999999;
  font-family: Poppins-Regular;
}

.forgot-login a {
  text-decoration: none;
  color: #666666;
  font-size: 13px;
  line-height: 1.5;
  font-family: Poppins-Regular;
}

.forgot-login a:hover {
  color: #57b846;
}

.register {
  height: 100px;
  flex: 1 1 auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.focus-input100 {
  display: block;
  position: absolute;
  border-radius: 25px;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 0px 0px;
  color: rgba(87, 184, 70, 0.8);
}

.register a {
  text-decoration: none;
  color: #666666;
  font-family: Poppins-Regular;
  font-size: 13px;
  line-height: 1.5;
}

.email-container {
  padding: 0 15px;
  width: 100%;
  margin: 5px 0;
  display: inline-block;
  border: none;
  box-sizing: border-box;
  background-color: #e6e6e6;
  border-radius: 20px;
}

.email-container span {
  float: left;
  margin: 10px 5px;
}

.register a:hover {
  color: #57b846;
}

#login-container button {
  width: 100%;
  border: none;
  background-color: #57b846;
  padding: 12px 20px;
  margin: 15px 0;
  color: white;
  border-radius: 20px;
}
</style>

