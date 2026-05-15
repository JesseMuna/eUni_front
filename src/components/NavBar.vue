<script setup>
import {useRouter} from "vue-router";
import { useAuth } from '@/services/auth';

const router = useRouter();
const {logout, isLoggedIn, isTutor, isAdmin} = useAuth();

async function handlelogout() {
    logout();
    router.push('/login') 
}




</script>
<template>
    <v-app-bar color="#DB7093">
        <v-app-bar-title >
            <v-btn to="/" size="large">eUni</v-btn>
            
        </v-app-bar-title>


            <v-btn v-if="!isTutor" text to="/home">Home</v-btn>
            <v-btn v-if="!isTutor" to="/account">Account</v-btn>
            <v-btn v-if="isTutor" text to="/mybookings"  >My Bookings</v-btn>
            <v-btn v-if="isAdmin" to="/admin">Admin</v-btn>
            <v-btn  text to="/login" v-if="!isLoggedIn">Login</v-btn>

            <v-btn v-else>
                <v-icon color="white" size="32">mdi-account</v-icon>
                <v-menu activator="parent">
                    <v-list>
                        <v-list-item v-if="isTutor || isAdmin">
                            <v-btn color="#D6AEDD" to="/tutorProfile">Profile</v-btn>
                        </v-list-item>

                        <v-list-item>
                            <v-btn @click="handlelogout">Logout</v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-btn>
    </v-app-bar>
</template>