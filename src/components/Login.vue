<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/services/auth';

const router = useRouter();
const { login, loading, error, isLoggedIn, isTutor, isAdmin } = useAuth();

const email = ref(null);
const password = ref(null);
const showPassword = ref(false); // 👈 separate ref for visibility

async function handleLogin() {
    if (!email.value || !password.value) {
        console.error('Email and password are required')
        return
    }
    try {
        await login({ email: email.value, password: password.value })
        router.push('/')
    } catch(err) {
        console.error('Login failed', err)
    }
}
</script>

<template>
    <v-container>
        <v-row justify="center">
            <v-col md="6" sm="8">
                <v-card class="pa-8 rounded-lg" elevation="10">
                    <v-form @submit.prevent="handleLogin">
                        <div class="text-center">
                            <h1>Welcome back</h1>
                        </div>

                        <v-text-field
                            v-model="email"
                            label="Email"
                            prepend-inner-icon="mdi-email"
                            required />

                        <v-text-field
                            v-model="password"
                            label="Password"
                            prepend-inner-icon="mdi-lock"
                            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append-inner="showPassword = !showPassword"
                            required />

                        <v-row justify="center">
                            <v-btn type="submit" :loading="loading">Log in</v-btn>
                        </v-row>

                        <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>

                        <div class="text-center mt-6">
                            <router-link to="/signup">Don't have an account? Sign Up</router-link>
                        </div>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>