<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const courses = ref([])
const selectedCourse = ref(null)
const units = ref([])

// Course form
const courseName = ref('')
const courseCode = ref('')
const addingCourse = ref(false)
const courseSuccess = ref('')
const courseError = ref('')

// Course editing
const editingCourse = ref(null)
const editCourseName = ref('')
const editCourseCode = ref('')
const savingCourse = ref(false)

// Unit form
const unitName = ref('')
const unitCode = ref('')
const addingUnit = ref(false)
const unitSuccess = ref('')
const unitError = ref('')

// Unit editing
const editingUnit = ref(null)
const editUnitName = ref('')
const editUnitCode = ref('')
const savingUnit = ref(false)

const loadingUnits = ref(false)

onMounted(async () => {
    await fetchCourses()
})

const fetchCourses = async () => {
    try {
        const { data } = await api.get('/courses')
        courses.value = data.courses
    } catch (e) {
        console.error('Failed to load courses', e)
    }
}

const fetchUnits = async (courseId) => {
    loadingUnits.value = true
    units.value = []
    try {
        const { data } = await api.get(`/courses/${courseId}/units`)
        units.value = data.units
    } catch (e) {
        console.error('Failed to load units', e)
    } finally {
        loadingUnits.value = false
    }
}

const selectCourse = async (course) => {
    selectedCourse.value = course
    unitSuccess.value = ''
    unitError.value = ''
    editingUnit.value = null
    await fetchUnits(course.id)
}

// ── Courses ──────────────────────────────────────────
const addCourse = async () => {
    if (!courseName.value.trim() || !courseCode.value.trim()) return
    addingCourse.value = true
    courseSuccess.value = ''
    courseError.value = ''
    try {
        const { data } = await api.post('/courses', {
            name: courseName.value.trim(),
            code: courseCode.value.trim()
        })
        courses.value.push(data.course)
        courseName.value = ''
        courseCode.value = ''
        courseSuccess.value = 'Course added!'
    } catch (e) {
        courseError.value = e.response?.data?.message || 'Failed to add course'
    } finally {
        addingCourse.value = false
    }
}

const startEditCourse = (course) => {
    editingCourse.value = course.id
    editCourseName.value = course.name
    editCourseCode.value = course.code
}

const cancelEditCourse = () => {
    editingCourse.value = null
}

const saveEditCourse = async (course) => {
    if (!editCourseName.value.trim() || !editCourseCode.value.trim()) return
    savingCourse.value = true
    try {
        const { data } = await api.put(`/courses/${course.id}`, {
            name: editCourseName.value.trim(),
            code: editCourseCode.value.trim()
        })
        // Update in list
        const idx = courses.value.findIndex(c => c.id === course.id)
        if (idx !== -1) courses.value[idx] = data.course
        // Update selected if it was the one being edited
        if (selectedCourse.value?.id === course.id) selectedCourse.value = data.course
        editingCourse.value = null
    } catch (e) {
        courseError.value = e.response?.data?.message || 'Failed to update course'
    } finally {
        savingCourse.value = false
    }
}

const deleteCourse = async (course) => {
    try {
        await api.delete(`/courses/${course.id}`)
        courses.value = courses.value.filter(c => c.id !== course.id)
        if (selectedCourse.value?.id === course.id) {
            selectedCourse.value = null
            units.value = []
        }
    } catch (e) {
        courseError.value = e.response?.data?.message || 'Failed to delete course'
    }
}

// ── Units ─────────────────────────────────────────────
const addUnit = async () => {
    if (!unitName.value.trim() || !unitCode.value.trim() || !selectedCourse.value) return
    addingUnit.value = true
    unitSuccess.value = ''
    unitError.value = ''
    try {
        const { data } = await api.post(`/courses/${selectedCourse.value.id}/units`, {
            name: unitName.value.trim(),
            code: unitCode.value.trim()
        })
        units.value.push(data.unit)
        unitName.value = ''
        unitCode.value = ''
        unitSuccess.value = 'Unit added!'
    } catch (e) {
        unitError.value = e.response?.data?.message || 'Failed to add unit'
    } finally {
        addingUnit.value = false
    }
}

const startEditUnit = (unit) => {
    editingUnit.value = unit.id
    editUnitName.value = unit.name
    editUnitCode.value = unit.code
}

const cancelEditUnit = () => {
    editingUnit.value = null
}

const saveEditUnit = async (unit) => {
    if (!editUnitName.value.trim() || !editUnitCode.value.trim()) return
    savingUnit.value = true
    try {
        const { data } = await api.put(`/courses/${selectedCourse.value.id}/units/${unit.id}`, {
            name: editUnitName.value.trim(),
            code: editUnitCode.value.trim()
        })
        const idx = units.value.findIndex(u => u.id === unit.id)
        if (idx !== -1) units.value[idx] = data.unit
        editingUnit.value = null
    } catch (e) {
        unitError.value = e.response?.data?.message || 'Failed to update unit'
    } finally {
        savingUnit.value = false
    }
}

const deleteUnit = async (unit) => {
    try {
        await api.delete(`/courses/${selectedCourse.value.id}/units/${unit.id}`)
        units.value = units.value.filter(u => u.id !== unit.id)
    } catch (e) {
        unitError.value = e.response?.data?.message || 'Failed to delete unit'
    }
}
</script>

<template>
    <v-container>
        <h1 class="mb-4">Admin Panel</h1>
        <v-row>

            <!-- Left: Courses -->
            <v-col cols="12" md="6">
                <v-card class="pa-4">
                    <v-card-title class="px-0">Courses</v-card-title>

                    <v-text-field v-model="courseName" label="Course name" placeholder="e.g. Computer Science"
                        variant="outlined" class="mb-2" />
                    <v-text-field v-model="courseCode" label="Course code" placeholder="e.g. CS"
                        variant="outlined" class="mb-2" />

                    <v-alert v-if="courseSuccess" type="success" class="mb-2" closable @click:close="courseSuccess = ''">
                        {{ courseSuccess }}
                    </v-alert>
                    <v-alert v-if="courseError" type="error" class="mb-2" closable @click:close="courseError = ''">
                        {{ courseError }}
                    </v-alert>

                    <v-btn color="primary" :loading="addingCourse"
                        :disabled="!courseName.trim() || !courseCode.trim()"
                        @click="addCourse" class="mb-4">
                        Add Course
                    </v-btn>

                    <v-divider class="mb-3" />
                    <p class="text-subtitle-2 mb-2">Existing Courses — click to manage units</p>

                    <v-list lines="one">
                        <template v-for="course in courses" :key="course.id">

                            <!-- Editing state -->
                            <v-list-item v-if="editingCourse === course.id" rounded="lg" class="mb-1 pa-2">
                                <v-row dense align="center">
                                    <v-col>
                                        <v-text-field v-model="editCourseName" label="Name" variant="outlined"
                                            density="compact" hide-details class="mb-1" />
                                        <v-text-field v-model="editCourseCode" label="Code" variant="outlined"
                                            density="compact" hide-details />
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-btn icon="mdi-check" color="success" variant="text" size="small"
                                            :loading="savingCourse" @click="saveEditCourse(course)" />
                                        <v-btn icon="mdi-close" variant="text" size="small"
                                            @click="cancelEditCourse" />
                                    </v-col>
                                </v-row>
                            </v-list-item>

                            <!-- Normal state -->
                            <v-list-item v-else :title="course.name" :subtitle="course.code"
                                :active="selectedCourse?.id === course.id" active-color="primary"
                                rounded="lg" class="mb-1" @click="selectCourse(course)">
                                <template #append>
                                    <v-btn icon="mdi-pencil" variant="text" color="blue" size="small"
                                        class="mr-1" @click.stop="startEditCourse(course)" />
                                    <v-btn icon="mdi-delete" variant="text" color="red" size="small"
                                        @click.stop="deleteCourse(course)" />
                                </template>
                            </v-list-item>

                        </template>

                        <v-list-item v-if="courses.length === 0">
                            <v-list-item-title class="text-grey">No courses yet.</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <!-- Right: Units -->
            <v-col cols="12" md="6">
                <v-card class="pa-4">
                    <v-card-title class="px-0">
                        Units
                        <span v-if="selectedCourse" class="text-primary"> — {{ selectedCourse.name }}</span>
                    </v-card-title>

                    <template v-if="!selectedCourse">
                        <v-card-text class="px-0 text-grey">Select a course on the left to manage its units.</v-card-text>
                    </template>

                    <template v-else>
                        <v-text-field v-model="unitName" label="Unit name" placeholder="e.g. Data Structures"
                            variant="outlined" class="mb-2" />
                        <v-text-field v-model="unitCode" label="Unit code" placeholder="e.g. CS201"
                            variant="outlined" class="mb-2" />

                        <v-alert v-if="unitSuccess" type="success" class="mb-2" closable @click:close="unitSuccess = ''">
                            {{ unitSuccess }}
                        </v-alert>
                        <v-alert v-if="unitError" type="error" class="mb-2" closable @click:close="unitError = ''">
                            {{ unitError }}
                        </v-alert>

                        <v-btn color="primary" :loading="addingUnit"
                            :disabled="!unitName.trim() || !unitCode.trim()"
                            @click="addUnit" class="mb-4">
                            Add Unit
                        </v-btn>

                        <v-divider class="mb-3" />
                        <p class="text-subtitle-2 mb-2">Units in this course</p>

                        <v-progress-circular v-if="loadingUnits" indeterminate class="ma-2" />

                        <v-list v-else lines="one">
                            <template v-for="unit in units" :key="unit.id">

                                <!-- Editing state -->
                                <v-list-item v-if="editingUnit === unit.id" rounded="lg" class="mb-1 pa-2">
                                    <v-row dense align="center">
                                        <v-col>
                                            <v-text-field v-model="editUnitName" label="Name" variant="outlined"
                                                density="compact" hide-details class="mb-1" />
                                            <v-text-field v-model="editUnitCode" label="Code" variant="outlined"
                                                density="compact" hide-details />
                                        </v-col>
                                        <v-col cols="auto">
                                            <v-btn icon="mdi-check" color="success" variant="text" size="small"
                                                :loading="savingUnit" @click="saveEditUnit(unit)" />
                                            <v-btn icon="mdi-close" variant="text" size="small"
                                                @click="cancelEditUnit" />
                                        </v-col>
                                    </v-row>
                                </v-list-item>

                                <!-- Normal state -->
                                <v-list-item v-else :title="unit.name" :subtitle="unit.code"
                                    rounded="lg" class="mb-1">
                                    <template #append>
                                        <v-btn icon="mdi-pencil" variant="text" color="blue" size="small"
                                            class="mr-1" @click="startEditUnit(unit)" />
                                        <v-btn icon="mdi-delete" variant="text" color="red" size="small"
                                            @click="deleteUnit(unit)" />
                                    </template>
                                </v-list-item>

                            </template>

                            <v-list-item v-if="units.length === 0">
                                <v-list-item-title class="text-grey">No units yet for this course.</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </template>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>