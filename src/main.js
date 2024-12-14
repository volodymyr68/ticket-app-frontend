import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {VDateInput} from "vuetify/labs/components";
import {VNumberInput} from 'vuetify/labs/VNumberInput'
import './styles/main.css'
import '@mdi/font/css/materialdesignicons.css';
import Notifications from '@kyvg/vue3-notification'


const app = createApp(App);

const vuetify = createVuetify({
    components: {
        ...components,
        VDateInput,
        VNumberInput
    },
    directives,
});

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(Notifications);

app.mount('#app');
