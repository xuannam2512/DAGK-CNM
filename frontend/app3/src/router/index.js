import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Register from '../components/register.vue'

import BootstrapVue from 'bootstrap-vue'
import VueSSE from 'vue-sse'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Router)
Vue.use(BootstrapVue)
Vue.use(VueCookie)
Vue.use(VueSSE) 

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
