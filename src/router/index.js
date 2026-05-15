import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import SignUp from '@/components/SignUp.vue'
import Account from '@/components/Account.vue'
import Tutor from '@/components/Tutor.vue'
import TutorProfile from '@/components/TutorProfile.vue'
import EditProfile from '@/components/EditProfile.vue'
import Admin from '@/components/Admin.vue'
import TutorBookings from '@/components/TutorBookings.vue'
import LandingPage from '@/components/LandingPage.vue'
import Requests from '@/components/Requests.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'landingpage',
      component: LandingPage
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },

    {
      path: '/signup',
      name: 'signup',
      component: SignUp

    },

    {
      path: '/login',
      name: 'login',
      component: Login

    },

    {
      path: '/tutor',
      name: 'tutor',
      component: Tutor
    },

    {
      path: '/tutor/:id',
      name: 'tutorDetail',
      component: TutorProfile
    },

    {
      path: '/tutorProfile',
      name: 'tutorProfile',
      component: TutorProfile
    },

    {
      path: '/account',
      name:'account',
      component: Account
    },
    {
      path: '/editprofile',
      name: 'editprofile',
      component: EditProfile

    },

    {
      path: '/admin',
      name: 'admin',
      component: Admin

    },

    {
      path:'/mybookings',
      name: 'TutorBookings',
      component: TutorBookings
    },

    {
      path: '/requests',
      name: 'requests',
      component: Requests
    }


  ],
})

export default router
