import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Register from '../components/register.vue'

Vue.use(Router)
Vue.use(VueCookie)

var validToken = (token) => {
  console.log("Valid token: " + token);

  axios({
    method:'get',
    url: `http://localhost:3000/api/authen/${token}`,
  })
  .then(response => {
    console.log(response);
    if(response.status === 200) {
      console.log("check success");
      return true;
    }
  }).catch(error => {
    // There was an error so redirect
    console.log("error: " + error);
    window.location.href = "/login";
    return false;
  })

 }

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: (to, from, next) => {      
        let token = localStorage.getItem('refreshToken');
        if(token != null) {          
          next();
        } else {
          next('/login')
        }          
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})
