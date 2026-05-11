<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'

const userDetails = ref(JSON.parse(localStorage.getItem('user'))) // make reactive so UI updates
const tab = ref(1)

// Course & unit state
const courses = ref([])
const units = ref([])
const selectedCourse = ref(null)
const selectedUnits = ref([])
const loadingUnits = ref(false)
const savingUnits = ref(false)
const saveSuccess = ref(false)
const saveError = ref(null)

// Detail update state
const newEmail = ref('')
const newName = ref('')
const university = ref(userDetails.value?.university || '')
const currentPassword = ref('')
const newPassword = ref('')
const about = ref(userDetails.value?.description || '')

const detailLoading = ref(false)
const detailSuccess = ref('')
const detailError = ref('')

const clearDetailFeedback = () => {
    detailSuccess.value = ''
    detailError.value = ''
}

// Generic detail updater
const updateDetail = async (payload) => {
    detailLoading.value = true
    clearDetailFeedback()
    try {
        const { data } = await api.post('/user/profile', payload)
        const updated = { ...userDetails.value, ...data.user }
        userDetails.value = updated
        localStorage.setItem('user', JSON.stringify(updated))
        detailSuccess.value = 'Updated successfully!'
        newEmail.value = ''
        newName.value = ''
        currentPassword.value = ''
        newPassword.value = ''
    } catch (e) {
        detailError.value = e.response?.data?.message || 'Update failed'
    } finally {
        detailLoading.value = false
    }
}

const changeEmail = () => {
    if (!newEmail.value.trim()) return
    updateDetail({ email: newEmail.value.trim() })
}

const changeName = () => {
    if (!newName.value.trim()) return
    updateDetail({ name: newName.value.trim() })
}

const changeUniversity = () => {
    if (!university.value) return
    updateDetail({ university: university.value })
}

const changePassword = () => {
    if (!currentPassword.value || !newPassword.value) return
    if (newPassword.value.length < 8) {
        detailError.value = 'New password must be at least 8 characters'
        return
    }
    updateDetail({ current_password: currentPassword.value, password: newPassword.value })
}

const saveAbout = () => {
    if (!about.value.trim()) return
    updateDetail({ description: about.value.trim() })
}

// Fetch all courses on mount
onMounted(async () => {
    try {
        const { data } = await api.get('/courses')
        courses.value = data.courses
    } catch (e) {
        console.error('Failed to load courses', e)
    }

    try {
        const { data } = await api.get('/tutor/units')
        const allUnits = Object.values(data.units).flat()
        selectedUnits.value = allUnits.map(u => u.id)
        if (allUnits.length > 0) {
            selectedCourse.value = allUnits[0].course_id
        }
    } catch (e) {
        console.error('Failed to load tutor units', e)
    }
})

watch(selectedCourse, async (courseId) => {
    if (!courseId) return
    loadingUnits.value = true
    selectedUnits.value = []
    try {
        const { data } = await api.get(`/courses/${courseId}/units`)
        units.value = data.units
    } catch (e) {
        console.error('Failed to load units', e)
    } finally {
        loadingUnits.value = false
    }
})

const saveUnits = async () => {
    if (!selectedCourse.value || selectedUnits.value.length === 0) return
    savingUnits.value = true
    saveSuccess.value = false
    saveError.value = null
    try {
        await api.post('/tutor/units', {
            course_id: selectedCourse.value,
            unit_ids: selectedUnits.value
        })
        saveSuccess.value = true
    } catch (e) {
        saveError.value = e.response?.data?.message || 'Failed to save units'
    } finally {
        savingUnits.value = false
    }
}
</script>

<template>
    <div align="center">
        <h1>Edit Profile</h1>
    </div>

    <v-container>

        <!-- Profile header -->
        <v-card class="mb-4">
            <v-row align="center">
                <v-avatar size="100" class="ma-2">
                    <v-img src="bmw.jpg"></v-img>
                </v-avatar>
                <v-col>
                    <v-card-title>{{ userDetails.name }}</v-card-title>
                    <v-card-subtitle>{{ userDetails.email }}</v-card-subtitle>
                </v-col>
                <v-spacer></v-spacer>
                <v-btn class="ma-2">Change Photo</v-btn>
            </v-row>
        </v-card>

        <!-- Tutoring units section -->
        <p class="text-h5 mb-2">Tutoring Units</p>
        <v-card class="mb-4 pa-3">
            <v-row>
                <v-col cols="12" md="6">
                    <v-select
                        v-model="selectedCourse"
                        :items="courses"
                        item-title="name"
                        item-value="id"
                        label="Select Course"
                        placeholder="Pick your course"
                        variant="outlined"
                        :loading="courses.length === 0"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select
                        v-if="selectedCourse"
                        v-model="selectedUnits"
                        :items="units"
                        item-title="name"
                        item-value="id"
                        label="Select Units you can teach"
                        variant="outlined"
                        multiple chips
                        :loading="loadingUnits"
                        :disabled="loadingUnits"
                    ></v-select>
                    <v-select v-else label="Select Units" placeholder="Select a course first"
                        variant="outlined" disabled></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <v-select label="Session length"
                        :items="['30 mins', '1 hour', '1.5 hours', '2 hours']"
                        variant="outlined"></v-select>
                </v-col>
            </v-row>
            <v-alert v-if="saveSuccess" type="success" class="mb-2">Units saved successfully!</v-alert>
            <v-alert v-if="saveError" type="error" class="mb-2">{{ saveError }}</v-alert>
            <v-btn color="primary" :loading="savingUnits"
                :disabled="!selectedCourse || selectedUnits.length === 0"
                @click="saveUnits">Save Units</v-btn>
        </v-card>

        <!-- About section -->
        <p class="text-h5 mb-2">About</p>
        <v-card class="mb-4 pa-3">
            <v-textarea v-model="about" label="Tell students about yourself" variant="outlined"></v-textarea>
            <v-btn color="primary" :loading="detailLoading" @click="saveAbout">Save About</v-btn>
        </v-card>

        <!-- Edit details -->
        <p class="text-h5 mb-2">Edit Details</p>
        <v-card>
            <!-- Shared feedback shown above tabs -->
            <v-alert v-if="detailSuccess" type="success" class="ma-3" closable
                @click:close="detailSuccess = ''">{{ detailSuccess }}</v-alert>
            <v-alert v-if="detailError" type="error" class="ma-3" closable
                @click:close="detailError = ''">{{ detailError }}</v-alert>

            <v-tabs v-model="tab" align-tabs="center">
                <v-tab :value="1">Email</v-tab>
                <v-tab :value="2">Name</v-tab>
                <v-tab :value="3">University</v-tab>
                <v-tab :value="4">Password</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">

                <v-tabs-window-item :value="1">
                    <v-row justify="center" align="center" class="pa-4">
                        <v-col cols="12" md="6">
                            <v-text-field v-model="newEmail" variant="outlined"
                                :placeholder="userDetails.email"
                                label="New email" type="email"></v-text-field>
                        </v-col>
                        <v-btn color="primary" :loading="detailLoading"
                            :disabled="!newEmail.trim()"
                            @click="changeEmail">Change Email</v-btn>
                    </v-row>
                </v-tabs-window-item>

                <v-tabs-window-item :value="2">
                    <v-row justify="center" align="center" class="pa-4">
                        <v-col cols="12" md="6">
                            <v-text-field v-model="newName" variant="outlined"
                                :placeholder="userDetails.name"
                                label="New name"></v-text-field>
                        </v-col>
                        <v-btn color="primary" :loading="detailLoading"
                            :disabled="!newName.trim()"
                            @click="changeName">Change Name</v-btn>
                    </v-row>
                </v-tabs-window-item>

                <v-tabs-window-item :value="3">
                    <v-row class="pa-4">
                        <v-col cols="12" md="6">
                            <v-select v-model="university"
                                :items="['Strathmore', 'University of Nairobi', 'Pwani University']"
                                variant="outlined" label="University"></v-select>
                        </v-col>
                    </v-row>
                    <v-row justify="center" class="pb-4">
                        <v-btn color="primary" :loading="detailLoading"
                            @click="changeUniversity">Change University</v-btn>
                    </v-row>
                </v-tabs-window-item>

                <v-tabs-window-item :value="4">
                    <v-row justify="center" class="pa-4">
                        <v-col cols="12" md="6">
                            <v-text-field v-model="currentPassword" variant="outlined"
                                label="Current password" type="password"></v-text-field>
                            <v-text-field v-model="newPassword" variant="outlined"
                                label="New password" type="password"></v-text-field>
                            <v-btn color="primary" :loading="detailLoading"
                                :disabled="!currentPassword || !newPassword"
                                @click="changePassword">Change Password</v-btn>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>

            </v-tabs-window>
        </v-card>

    </v-container>
</template>