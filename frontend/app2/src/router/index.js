import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import BootstrapVue from 'bootstrap-vue'
import VueSSE from 'vue-sse'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Router)
Vue.use(BootstrapVue);
Vue.use(VueSSE);

export default new Router({
  routes: [
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
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, 
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})
