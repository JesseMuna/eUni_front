<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const userDetails = ref(null)
const tab = ref(1)
const newEmail = ref('')
const newName = ref('')
const university = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const detailLoading = ref(false)
const detailSuccess = ref('')
const detailError = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/user-info')
    userDetails.value = data.user
  } catch (e) {
    detailError.value = 'Failed to load user details.'
  }
})

const clearDetailFeedback = () => {
  detailSuccess.value = ''
  detailError.value = ''
}

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
</script>

<template>
  <v-container>
    <template v-if="userDetails">
      <v-row>
        <v-col>
          <div class="d-flex align-center ga-4 pa-8">
            <v-avatar size="120">
              <v-img
                :src="userDetails.profilePicture
                  ? `http://127.0.0.1:8000/storage/${userDetails.profilePicture}`
                  : 'bmw.jpg'"
                cover
              />
            </v-avatar>
            <div>
              <v-card-title class="pa-0">Name: {{ userDetails.name }}</v-card-title>
              <v-card-title class="pa-0">Phone: {{ userDetails.phoneNumber }}</v-card-title>
              <v-card-title class="pa-0">University: {{ userDetails.university }}</v-card-title>
              <v-btn to="/requests" class="mt-2">View Requests</v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <p class="text-h5 mb-2">Edit Details</p>
      <v-card>
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
                  label="New email" type="email" />
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
                  label="New name" />
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
                  variant="outlined" label="University" />
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
                  label="Current password" type="password" />
                <v-text-field v-model="newPassword" variant="outlined"
                  label="New password" type="password" />
                <v-btn color="primary" :loading="detailLoading"
                  :disabled="!currentPassword || !newPassword"
                  @click="changePassword">Change Password</v-btn>
              </v-col>
            </v-row>
          </v-tabs-window-item>

        </v-tabs-window>
      </v-card>
    </template>

    <template v-else>
      <v-row justify="center" align="center" style="height: 300px">
        <v-progress-circular indeterminate color="primary" />
      </v-row>
    </template>
  </v-container>
</template>