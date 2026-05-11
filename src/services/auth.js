import {ref, computed} from 'vue';
import api from './api';

const user = ref(JSON.parse(localStorage.getItem("user")) || null);
const loading = ref(false)
const error = ref(null)
const isTutor = computed(() => user.value?.role === 'tutor')
const isAdmin = computed(() => user.value?.role === 'admin')



export function useAuth() {
    const isLoggedIn = computed(() => !!user.value)

    async function login(credentials) {
        loading.value = true
        error.value = null

        try{

            if(!credentials.email || !credentials.password){
                throw new Error('Email and password are required')
            }

            const response = await api.post('login', credentials)
            const {token, user: userData} = response.data

            console.log(response.data)

            if (token && userData){
                user.value = userData

                if(user.value.role === "tutor") isTutor.value = true
                if(user.value.role === "admin") isAdmin.value = true


                localStorage.setItem("authToken", token);
                localStorage.setItem("user", JSON.stringify(user.value));
                return response

            }else{
                throw new Error('Invalid response format from server')
            }
        }catch(err){
            error.value = err.response?.data?.message || err.message || 'Login Failed'
            throw err
        }finally{
            loading.value =false
        }
    }

    async function register(formData){
        loading.value = true
        error.value = null
        try{
            const response = await api.post('register', formData)
            const {token, user: userData} = response.data
            if (token && userData){
                user.value = userData
                if (user.value.role === 'tutor') {
                isTutor.value = true
                localStorage.setItem('isTutor', 'true')  
            }
                localStorage.setItem("authToken", token);
                localStorage.setItem("user", JSON.stringify(user.value));

                return response
            }else{
                throw new Error('Invalid response format from server')
            }
        }catch (err){
            error.value = err.response?.data?.message || 'Registration failed'
            throw err
        }finally{
            loading.value = false
        }

    }

    function logout() {
        user.value = null
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("isTutor");

    }

    return {
        error,
        loading,
        isLoggedIn,
        isAdmin,
        isTutor,
        login,
        register,
        logout,
    }


}