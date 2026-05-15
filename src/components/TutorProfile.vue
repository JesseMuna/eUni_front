<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const userDetails = ref(JSON.parse(localStorage.getItem('user')))
const tutorUnits = ref({})   
const loading = ref(true)

onMounted(async () => {
    try {
        const {data: unitsData} = await api.get('/tutor/units')
        tutorUnits.value = unitsData.units
    } catch (e) {
        console.error('Failed to load units', e)
    } finally {
        loading.value = false
    }

    try{
        const {data: userData} = await api.get('/user/me')
        userDetails.value = userData.userData
        localStorage.setItem('user', JSON.stringify(userData.user))

    }catch(e){
        console.error('Failed to load Units', e)
    }finally{
        loading.value = false
    }
})
</script>

<template>
    <v-container fluid>
        <v-row justify="center" align="center">
            <v-col cols="12" md="6">
                <v-card style="background-color: antiquewhite;">

                    <!-- Personal details -->
                    <v-row>
                        <v-col>
                            <div class="d-flex align-center ga-4 pa-8">
                                <v-avatar size="120">
                                    <v-img :src="userDetails.profilePicture 
                                        ? `http://127.0.0.1:8000/storage/${userDetails.profilePicture}` 
                                        : 'bmw.jpg'"
                                        cover>
                                    </v-img>
                                </v-avatar>
                                <div>
                                    <v-card-title class="pa-0">Name: {{ userDetails.name }}</v-card-title>
                                    <v-card-title class="pa-0">Phone: {{ userDetails.phoneNumber }}</v-card-title>
                                    <v-card-title class="pa-0">University: {{ userDetails.university }}</v-card-title>
                                    <v-btn to="/editprofile" class="mt-2">Edit Profile</v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>

                    <!-- Units grouped by course -->
                    <v-row>
                        <v-col>
                            <v-progress-circular v-if="loading" indeterminate class="ma-4"></v-progress-circular>

                            <template v-else>
                                <!-- No units yet -->
                                <v-card v-if="Object.keys(tutorUnits).length === 0" class="ma-3 pa-3">
                                    <v-card-text>No tutoring units added yet. <a href="/editprofile">Add some!</a></v-card-text>
                                </v-card>

                                <!-- Units grouped by course -->
                                <v-card
                                    v-for="(units, courseName) in tutorUnits"
                                    :key="courseName"
                                    class="ma-3"
                                >
                                    <v-card-title>{{ courseName }}</v-card-title>
                                    <v-row class="px-4 pb-3">
                                        <v-col
                                            v-for="unit in units"
                                            :key="unit.id"
                                            cols="6"
                                        >
                                            <v-chip>{{ unit.name }}</v-chip>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </template>
                        </v-col>
                    </v-row>

                    <!-- Description -->
                    <div class="d-flex align-center px-4 pt-2">
                        <h4>Description</h4>
                    </div>
                    <v-row>
                        <v-col>
                            <v-card class="ma-3">
                                <v-card-text>
                                    {{ userDetails.description || 'No description added yet.' }}
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>