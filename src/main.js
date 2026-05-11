import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

import * as labsComponents from 'vuetify/labs/components'

const vuetify = createVuetify({
 components: {
    ...components,
    ...labsComponents,
    
  },
   directives,
    icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },

  theme:{
    defaultTheme: 'light',
    themes: {
      light:{
        colors:{
          primary:"#003366",
            secondary:"#eff9fe"

            }
          },
        },
      },
    },
)

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
