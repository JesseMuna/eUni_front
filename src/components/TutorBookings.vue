<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const bookings = ref([])
const loading = ref(false)
const updatingId = ref(null)
const error = ref(null)

const pending = computed(() => bookings.value.filter(b => b.status === 'pending'))
const accepted = computed(() => bookings.value.filter(b => b.status === 'accepted'))
const rejected = computed(() => bookings.value.filter(b => b.status === 'rejected'))

onMounted(async () => {
    loading.value = true
    try {
        const { data } = await api.get('/tutor/bookings')
        bookings.value = data.bookings
    } catch (e) {
        error.value = 'Failed to load bookings'
    } finally {
        loading.value = false
    }
})

const updateStatus = async (booking, status) => {
    updatingId.value = booking.id
    try {
        const { data } = await api.patch(`/bookings/${booking.id}/status`, { status })
        const idx = bookings.value.findIndex(b => b.id === booking.id)
        if (idx !== -1) bookings.value[idx] = { ...bookings.value[idx], status: data.booking.status }
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to update booking'
    } finally {
        updatingId.value = null
    }
}

const deleteBooking = async (id) => {
    try {
        await api.delete(`/bookings/${id}`)
        bookings.value = bookings.value.filter(b => b.id !== id)
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to delete booking'
    }
}

const formatDate = (dt) => {
    if (!dt) return 'No preferred time set'
    return new Date(dt).toLocaleString('en-KE', {
        dateStyle: 'medium', timeStyle: 'short'
    })
}
</script>

<template>
    <v-container>
        <h1 class="mb-4">Booking Requests</h1>

        <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = null">
            {{ error }}
        </v-alert>

        <v-progress-circular v-if="loading" indeterminate class="ma-4" />

        <template v-else>

            <!-- Pending -->
            <p class="text-h6 mb-2">Pending <v-chip color="orange" size="small">{{ pending.length }}</v-chip></p>
            <v-card v-if="pending.length === 0" class="mb-4 pa-3 text-grey">No pending requests.</v-card>
            <v-card v-for="booking in pending" :key="booking.id" class="mb-3 pa-3" variant="outlined">
                <v-row align="center">
                    <v-avatar size="45" class="ma-2">
                        <v-img src="/bmw.jpg" />
                    </v-avatar>
                    <v-col>
                        <p class="font-weight-bold mb-0">{{ booking.student.name }}</p>
                        <p class="text-caption text-grey mb-0">{{ booking.student.university }}</p>
                        <p class="text-caption mb-0">Unit: <strong>{{ booking.unit?.name ?? 'N/A' }}</strong></p>
                        <p class="text-caption mb-0">Session: <strong>{{ booking.session_length }}</strong></p>
                        <p class="text-caption mb-0">Preferred time: <strong>{{ formatDate(booking.scheduled_at) }}</strong></p>
                    </v-col>
                    <div class="d-flex flex-column ga-2 ma-2">
                        <v-btn color="green" size="small" :loading="updatingId === booking.id"
                            @click="updateStatus(booking, 'accepted')">Accept</v-btn>
                        <v-btn color="red" variant="outlined" size="small" :loading="updatingId === booking.id"
                            @click="updateStatus(booking, 'rejected')">Reject</v-btn>
                    </div>
                </v-row>
            </v-card>

            <!-- Accepted -->
            <p class="text-h6 mb-2 mt-4">Accepted <v-chip color="green" size="small">{{ accepted.length }}</v-chip></p>
            <v-card v-if="accepted.length === 0" class="mb-4 pa-3 text-grey">No accepted bookings.</v-card>
            <v-card v-for="booking in accepted" :key="booking.id" class="mb-3 pa-3" variant="outlined">
                <v-row align="center">
                    <v-avatar size="45" class="ma-2">
                        <v-img src="/bmw.jpg" />
                    </v-avatar>
                    <v-col>
                        <p class="font-weight-bold mb-0">{{ booking.student.name }}</p>
                        <p class="text-caption mb-0">Unit: <strong>{{ booking.unit?.name ?? 'N/A' }}</strong></p>
                        <p class="text-caption mb-0">Session: <strong>{{ booking.session_length }}</strong></p>
                        <p class="text-caption mb-0">{{ formatDate(booking.scheduled_at) }}</p>
                    </v-col>
                    <div class="d-flex flex-column ga-2 ma-2">
                        <v-chip color="green">Accepted</v-chip>
                        <v-btn color="red" variant="outlined" size="small" prepend-icon="mdi-delete"
                            @click="deleteBooking(booking.id)">Delete</v-btn>
                    </div>
                </v-row>
            </v-card>

            <!-- Rejected -->
            <p class="text-h6 mb-2 mt-4">Rejected <v-chip color="red" size="small">{{ rejected.length }}</v-chip></p>
            <v-card v-if="rejected.length === 0" class="mb-4 pa-3 text-grey">No rejected bookings.</v-card>
            <v-card v-for="booking in rejected" :key="booking.id" class="mb-3 pa-3" variant="outlined opacity-70">
                <v-row align="center">
                    <v-avatar size="45" class="ma-2">
                        <v-img src="/bmw.jpg" />
                    </v-avatar>
                    <v-col>
                        <p class="font-weight-bold mb-0">{{ booking.student.name }}</p>
                        <p class="text-caption mb-0">Unit: <strong>{{ booking.unit?.name ?? 'N/A' }}</strong></p>
                        <p class="text-caption mb-0">Session: <strong>{{ booking.session_length }}</strong></p>
                    </v-col>
                    <div class="d-flex flex-column ga-2 ma-2">
                        <v-chip color="red">Rejected</v-chip>
                        <v-btn color="red" variant="outlined" size="small" prepend-icon="mdi-delete"
                            @click="deleteBooking(booking.id)">Delete</v-btn>
                    </div>
                </v-row>
            </v-card>

        </template>
    </v-container>
</template>