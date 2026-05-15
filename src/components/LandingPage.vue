<script setup>
</script>

<template>
    <v-container fluid class="pa-0">

        <!-- HERO -->
        <v-row no-gutters style="min-height: 90vh;">
            <v-col cols="12" md="6" class="d-flex align-center pa-10">
                <div>
                    <v-chip color="teal" variant="tonal" size="small" class="mb-4">
                        University Peer Tutoring
                    </v-chip>
                    <h1 style="font-family: Georgia, serif; font-size: clamp(2rem,4vw,3.2rem); line-height: 1.15; font-weight: 700;" class="mb-4">
                        Learn from students<br>
                        <span style="color: #00897B;">who just got it.</span>
                    </h1>
                    <p class="text-body-1 text-medium-emphasis mb-6" style="max-width: 440px; line-height: 1.75;">
                        Connect with top-performing peers who tutor the exact units
                        you're taking. Book a session in minutes — or become a tutor yourself.
                    </p>
                    <div class="d-flex ga-3 flex-wrap">
                        <v-btn color="teal-darken-1" variant="flat" size="large" to="/signup">
                            Find a tutor <v-icon end>mdi-arrow-right</v-icon>
                        </v-btn>
                        <v-btn variant="outlined" size="large" to="/signup">Become a tutor</v-btn>
                    </div>
                    <v-row class="mt-10" no-gutters>
                        <v-col cols="4">
                            <div style="font-family: Georgia, serif; font-size: 1.8rem; font-weight: 700;">340+</div>
                            <div class="text-caption text-medium-emphasis mt-1">Active tutors</div>
                        </v-col>
                        <v-col cols="4">
                            <div style="font-family: Georgia, serif; font-size: 1.8rem; font-weight: 700;">1,200+</div>
                            <div class="text-caption text-medium-emphasis mt-1">Sessions booked</div>
                        </v-col>
                        <v-col cols="4">
                            <div style="font-family: Georgia, serif; font-size: 1.8rem; font-weight: 700;">28</div>
                            <div class="text-caption text-medium-emphasis mt-1">Courses covered</div>
                        </v-col>
                    </v-row>
                </div>
            </v-col>

            <v-col cols="12" md="6" class="pa-6">
                <v-row no-gutters style="height: 100%; gap: 8px;">
                    <v-col cols="7" style="padding-right: 4px;">
                        <v-img src="pic1.jpeg" cover
                            style="height: 100%; min-height: 320px; border-radius: 16px;"></v-img>
                    </v-col>
                    <v-col cols="4" class="d-flex flex-column" style="gap: 8px;">
                        <v-img src="pic2.jpeg" cover style="flex: 1; border-radius: 16px;"></v-img>
                        <v-img src="pic3.jpeg" cover style="flex: 1; border-radius: 16px;"></v-img>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- HOW IT WORKS -->
        <v-container class="py-12">
            <p class="text-overline text-medium-emphasis">How it works</p>
            <h2 style="font-family: Georgia, serif; font-size: 1.75rem; font-weight: 700;" class="mb-8">
                Three steps to your session
            </h2>
            <v-row>
                <v-col cols="12" sm="6" md="3">
                    <v-card variant="tonal" color="teal" rounded="lg" class="pa-5 h-100">
                        <div style="font-family: Georgia, serif; font-size: 2rem; font-weight: 700; color: #00897B;" class="mb-3">01</div>
                        <div class="font-weight-medium mb-2">Pick your unit</div>
                        <div class="text-caption text-medium-emphasis" style="line-height: 1.65;">Search by course code or subject. Filter by availability and session length.</div>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-card variant="tonal" color="teal" rounded="lg" class="pa-5 h-100">
                        <div style="font-family: Georgia, serif; font-size: 2rem; font-weight: 700; color: #00897B;" class="mb-3">02</div>
                        <div class="font-weight-medium mb-2">Choose a tutor</div>
                        <div class="text-caption text-medium-emphasis" style="line-height: 1.65;">Browse peer profiles, read reviews, and see their academic background.</div>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-card variant="tonal" color="teal" rounded="lg" class="pa-5 h-100">
                        <div style="font-family: Georgia, serif; font-size: 2rem; font-weight: 700; color: #00897B;" class="mb-3">03</div>
                        <div class="font-weight-medium mb-2">Book instantly</div>
                        <div class="text-caption text-medium-emphasis" style="line-height: 1.65;">Select a time that works for you. Get a confirmation and meeting link.</div>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-card variant="tonal" color="teal" rounded="lg" class="pa-5 h-100">
                        <div style="font-family: Georgia, serif; font-size: 2rem; font-weight: 700; color: #00897B;" class="mb-3">04</div>
                        <div class="font-weight-medium mb-2">Study smarter</div>
                        <div class="text-caption text-medium-emphasis" style="line-height: 1.65;">Attend your session, take notes, and leave a review to help others.</div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-divider></v-divider>

       
        <v-divider></v-divider>

        <!-- APPLY BANNER -->
        <v-row no-gutters style="min-height: 420px;">
            <v-col cols="12" md="5">
                <v-img src="pic4.jpeg" cover style="height: 100%; min-height: 300px;"></v-img>
            </v-col>
            <v-col cols="12" md="7" class="d-flex align-center pa-10 bg-teal-lighten-5">
                <div>
                    <v-chip color="teal" variant="tonal" size="small" class="mb-4">For tutors</v-chip>
                    <h2 style="font-family: Georgia, serif; font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 700; line-height: 1.2;" class="mb-4">
                        Share what you know.<br>Earn while you teach.
                    </h2>
                    <p class="text-body-2 text-medium-emphasis mb-5" style="max-width: 420px; line-height: 1.75;">
                        Top students in your department are earning by helping their peers.
                        Apply as a tutor — set your own schedule and the units you teach.
                    </p>
                    <div class="d-flex flex-column ga-2 mb-6">
                        <div class="d-flex align-center ga-2">
                            <v-icon color="teal" size="18">mdi-check-circle</v-icon>
                            <span class="text-body-2">Set your own availability</span>
                        </div>
                        <div class="d-flex align-center ga-2">
                            <v-icon color="teal" size="18">mdi-check-circle</v-icon>
                            <span class="text-body-2">Teach units you've already passed</span>
                        </div>
                        <div class="d-flex align-center ga-2">
                            <v-icon color="teal" size="18">mdi-check-circle</v-icon>
                            <span class="text-body-2">Build your academic reputation</span>
                        </div>
                    </div>
                    <v-btn color="teal-darken-1" variant="flat" size="large" to="/editprofile">
                        Apply now <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                </div>
            </v-col>
        </v-row>

        <v-divider></v-divider>

        

        <!-- FOOTER -->
        <v-container class="py-6">
            <v-row align="center">
                <v-col>
                    <span style="font-family: Georgia, serif; font-weight: 700; font-size: 1.1rem;">PeerTutor</span>
                </v-col>
                <v-col class="text-right">
                    <span class="text-caption text-medium-emphasis">University of Nairobi · Peer Tutoring Network</span>
                </v-col>
            </v-row>
        </v-container>

    </v-container>
</template>