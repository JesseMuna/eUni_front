<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const bookings = ref([])
const loading = ref(true)
const error = ref('')

const statusColor = (status) => {
  if (status === 'accepted') return 'success'
  if (status === 'rejected') return 'error'
  return 'warning'
}

const statusIcon = (status) => {
  if (status === 'accepted') return 'mdi-check-circle'
  if (status === 'rejected') return 'mdi-close-circle'
  return 'mdi-clock-outline'
}

onMounted(async () => {
  try {
    const { data } = await api.get('/bookings')
    bookings.value = data.bookings
  } catch (e) {
    error.value = 'Failed to load bookings.'
  } finally {
    loading.value = false
  }
})

const deleteBooking = async (id) => {
  try {
    await api.delete(`/bookings/${id}`)
    bookings.value = bookings.value.filter(b => b.id !== id)
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to delete booking.'
  }
}
</script>

<template>
  <v-container>
    <p class="text-h5 mb-4">My Booking Requests</p>

    <v-alert v-if="error" type="error" class="mb-4" closable
      @click:close="error = ''">{{ error }}</v-alert>

    <v-progress-circular v-if="loading" indeterminate color="primary" class="ma-4" />

    <template v-else>
      <v-alert v-if="bookings.length === 0" type="info">
        You have no booking requests yet.
      </v-alert>

      <v-card v-for="booking in bookings" :key="booking.id" class="mb-4">
        <v-card-item>
          <template #prepend>
            <v-icon :color="statusColor(booking.status)" size="36">
              {{ statusIcon(booking.status) }}
            </v-icon>
          </template>

          <v-card-title>{{ booking.tutor.name }}</v-card-title>
          <v-card-subtitle>{{ booking.tutor.university }}</v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="4">
              <div class="text-caption text-medium-emphasis">Unit</div>
              <div>{{ booking.unit.name }}</div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="text-caption text-medium-emphasis">Session Length</div>
              <div>{{ booking.session_length }}</div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="text-caption text-medium-emphasis">Scheduled</div>
              <div>{{ booking.scheduled_at ?? 'Not scheduled' }}</div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-chip :color="statusColor(booking.status)" variant="tonal">
            {{ booking.status.charAt(0).toUpperCase() + booking.status.slice(1) }}
          </v-chip>
          <v-spacer />
          <v-btn
            v-if="booking.status !== 'pending'"
            color="error"
            variant="tonal"
            prepend-icon="mdi-delete"
            @click="deleteBooking(booking.id)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-container>
</template>