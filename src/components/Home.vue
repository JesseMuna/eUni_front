<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'

const courses = ref([])
const units = ref([])
const tutors = ref([])
const selectedCourse = ref(null)
const selectedUnit = ref(null)
const sessionLength = ref(null)
const loadingUnits = ref(false)
const loadingTutors = ref(false)

// Booking dialog
const bookingDialog = ref(false)
const selectedTutor = ref(null)
const scheduledAt = ref('')
const booking = ref(false)
const bookingSuccess = ref(false)
const bookingError = ref(null)

onMounted(async () => {
    try {
        const { data } = await api.get('/courses')
        courses.value = data.courses
    } catch (e) {
        console.error('Failed to load courses', e)
    }
})

watch(selectedCourse, async (courseId) => {
    if (!courseId) return
    selectedUnit.value = null
    tutors.value = []
    loadingUnits.value = true
    try {
        const { data } = await api.get(`/courses/${courseId}/units`)
        units.value = data.units
    } catch (e) {
        console.error('Failed to load units', e)
    } finally {
        loadingUnits.value = false
    }
})

watch(selectedUnit, async (unitId) => {
    if (!unitId) return
    loadingTutors.value = true
    tutors.value = []
    try {
        const { data } = await api.get('/tutors/search', {
            params: { course_id: selectedCourse.value, unit_id: unitId }
        })
        tutors.value = data.tutors
    } catch (e) {
        console.error('Failed to search tutors', e)
    } finally {
        loadingTutors.value = false
    }
})

const openBooking = (tutor) => {
    selectedTutor.value = tutor
    scheduledAt.value = ''
    bookingSuccess.value = false
    bookingError.value = null
    bookingDialog.value = true
}

const confirmBooking = async () => {
    if (!sessionLength.value) {
        bookingError.value = 'Please select a session length'
        return
    }
    booking.value = true
    bookingError.value = null
    try {
        await api.post('/bookings', {
            tutor_id:       selectedTutor.value.id,
            unit_id:        selectedUnit.value,
            session_length: sessionLength.value,
            scheduled_at:   scheduledAt.value || null,
        })
        bookingSuccess.value = true
    } catch (e) {
        bookingError.value = e.response?.data?.message || 'Booking failed'
    } finally {
        booking.value = false
    }
}
</script>

<template>
    <v-container>
        <v-row justify="center">

            <!-- Search panel -->
            <v-col cols="12" md="5">
                <v-card border="md" class="ma-3 pa-2">
                    <v-card-title>Find a Tutor</v-card-title>
                    <v-card-text>Need help studying? Request a tutor</v-card-text>

                    <v-select v-model="selectedCourse" :items="courses" item-title="name"
                        item-value="id" label="Select Course" variant="outlined" class="mb-2"
                        :loading="courses.length === 0"></v-select>

                    <v-select v-model="selectedUnit" :items="units" item-title="name"
                        item-value="id" label="Select Unit" variant="outlined" class="mb-2"
                        :loading="loadingUnits" :disabled="!selectedCourse || loadingUnits"></v-select>

                    <v-select v-model="sessionLength"
                        :items="['30 mins', '1 hour', '1.5 hours', '2 hours']"
                        label="Session length" variant="outlined" class="mb-2"></v-select>
                </v-card>
            </v-col>

            <!-- Tutors panel -->
            <v-col cols="12" md="7">
                <v-card border="md" class="ma-3 pa-2" min-height="200">
                    <v-card-title>Available Tutors</v-card-title>

                    <v-row v-if="loadingTutors" justify="center" class="pa-4">
                        <v-progress-circular indeterminate></v-progress-circular>
                    </v-row>

                    <v-card-text v-else-if="!selectedUnit">
                        Select a course and unit to see available tutors.
                    </v-card-text>

                    <v-card-text v-else-if="tutors.length === 0">
                        No tutors available for this unit yet.
                    </v-card-text>

                    <v-row v-else class="pa-2">
                        <v-col v-for="tutor in tutors" :key="tutor.id" cols="12">
                            <v-card variant="outlined">
                                <v-row align="center" class="pa-2">
                                    <v-avatar size="50" class="ma-2">
                                        <v-img src="bmw.jpg"></v-img>
                                    </v-avatar>
                                    <v-col>
                                        <v-card-title class="pa-0">{{ tutor.name }}</v-card-title>
                                        <v-card-subtitle class="pa-0">{{ tutor.university }}</v-card-subtitle>
                                        <v-card-text class="pa-0 text-caption">
                                            {{ tutor.description || 'No description provided.' }}
                                        </v-card-text>
                                    </v-col>
                                    <div class="ma-2 d-flex flex-column ga-2">
                                        <v-btn color="pink" :to="`/tutor/${tutor.id}`" size="small">
                                            View
                                        </v-btn>
                                        <v-btn color="primary" size="small" @click="openBooking(tutor)">
                                            Book
                                        </v-btn>
                                    </div>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

        </v-row>

        <!-- Booking dialog -->
        <v-dialog v-model="bookingDialog" max-width="480">
            <v-card class="pa-4">
                <v-card-title>Book a Session</v-card-title>

                <template v-if="bookingSuccess">
                    <v-card-text>
                        <v-alert type="success">
                            Booking request sent to {{ selectedTutor.name }}! They will confirm shortly.
                        </v-alert>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="bookingDialog = false">Close</v-btn>
                    </v-card-actions>
                </template>

                <template v-else>
                    <v-card-text>
                        <p class="mb-3">Booking a session with <strong>{{ selectedTutor?.name }}</strong></p>

                        <v-select v-model="sessionLength"
                            :items="['30 mins', '1 hour', '1.5 hours', '2 hours']"
                            label="Session length" variant="outlined" class="mb-3"></v-select>

                        <v-text-field v-model="scheduledAt" label="Preferred date & time (optional)"
                            type="datetime-local" variant="outlined"></v-text-field>

                        <v-alert v-if="bookingError" type="error" class="mt-2">
                            {{ bookingError }}
                        </v-alert>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" @click="bookingDialog = false">Cancel</v-btn>
                        <v-btn color="primary" :loading="booking" @click="confirmBooking">
                            Confirm Booking
                        </v-btn>
                    </v-card-actions>
                </template>
            </v-card>
        </v-dialog>

    </v-container>
</template>