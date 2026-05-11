<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/services/auth';

const router = useRouter();
const{login, loading, error, isLoggedIn, isTutor, isAdmin} =useAuth();

const rules = {
    required: value => !!value || 'Required',
    min: v => v.length >8 || 'Atleast 8 characters',
    passwordMatch: () => password.value === confirmPassword.value || 'Passwords must match'
}

const email = ref(null);
const password = ref(null);

async function handleLogin() {

    if(!email.value || !password.value){
        console.error('Email and password are required')
        return
    }

    try{
        await login({
            email: email.value,
            password: password.value
        })
        console.log('isLoggedIn;', isLoggedIn.value)
        console.log('isTutor;', isTutor.value)
        console.log('isAdmin;', isAdmin)


        router.push('/')

    }catch(err) {
        console.error('Login failed, err')
    }
    
}

</script>
<template>
    <v-container>
        <v-row justify="center">
            <v-col md="6" sm="8">
                <v-card class="pa-8 rounded-lg" elevation="10">
                    <v-form @submit.prevent="handleLogin" ref="form">
                        <div class="text-center">
                            <h1>Welcome back</h1>
                        </div>
                        <v-text-field v-model="email" label="Email"  prepend-inner-icon="mdi-email" 
                        required outlined dense></v-text-field>

                        <v-text-field 
                        v-model="password" label="Password"  prepend-inner-icon="mdi-lock"
                         :append-icon="password ? 'mdi-eye' : 'mdi-eye-off'" 
                         :type="password ? 'text' : 'password'" 
                         @click:append="password = !password" 
                         required outlined dense>
                        </v-text-field>
                        <v-row justify="center">
                            <v-btn type="submit">Log in</v-btn>
                        </v-row>
                        <div class="text-center mt-6">
                            <router-link to="/signup">
                                Don't have an account? Sign Up
                            </router-link>

                        </div>

                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>>
</template>