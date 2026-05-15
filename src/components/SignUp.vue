<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/services/auth';

const router = useRouter();
const { register, loading, error } = useAuth()

const name = ref(null);
const email = ref(null);
const phonenumber = ref(null);
const university = ref(null);
const role = ref(null)
const password = ref(null);
const confirmPassword = ref(null);
const showPassword = ref(false) // 👈

const rules = {
    required: value => !!value || 'Required',
    min: v => v.length > 8 || 'At least 8 characters',
    passwordMatch: () => password.value === confirmPassword.value || 'Passwords must match'
}

const signup = async () => {
    const formData = new FormData();
    formData.append("name", name.value)
    formData.append("email", email.value)
    formData.append("phoneNumber", phonenumber.value)
    formData.append("university", university.value)
    formData.append("role", role.value)
    formData.append("password", password.value)

    try {
        await register(formData)
        router.push('/')
    } catch(err) {
        console.error('Sign up failed', err)
    }
}
</script>

<template>
    <v-container>
        <v-row justify="center">
            <v-col md="6">
                <v-card class="pa-6 rounded-lg">
                    <v-form @submit.prevent="signup">
                        <div class="text-center mb-6">
                            <h1 class="text-h4 font-weight-bold">Welcome!</h1>
                        </div>

                        <v-select
                            label="Role"
                            :items="[
                                { title: 'Tutor', value: 'tutor' },
                                { title: 'Student', value: 'student' },
                            ]"
                            v-model="role" />

                        <v-text-field v-model="name" label="Name" />
                        <v-text-field v-model="email" label="Email" type="email" />
                        <v-text-field v-model="phonenumber" label="Phone Number" />

                        <v-select
                            label="University"
                            :items="['Strathmore', 'University of Nairobi', 'Pwani University', 'Kenyatta University']"
                            v-model="university" />

                        <v-text-field
                            v-model="password"
                            label="Password"
                            prepend-inner-icon="mdi-lock"
                            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append-inner="showPassword = !showPassword" />

                        <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

                        <v-row justify="center">
                            <v-btn type="submit" :loading="loading">Sign up</v-btn>
                        </v-row>

                        <div class="text-center mt-6">
                            <router-link to="/login">Already have an account? Log in</router-link>
                        </div>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>