<script setup>
import {useUserStore} from "@/stores/userStore.js";
import {onMounted} from "vue";
import {checkToken, logout} from "@/composables/authComposable.js";
import {Notifications} from "@kyvg/vue3-notification";

const userStore = useUserStore();

onMounted(()=>{
  checkToken();
});


</script>

<template>
  <v-app>
    <v-app-bar  color="primary" dark>
      <v-toolbar-title>Ticket Finder</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="navigation">
        <router-link
            :to="{ name: 'main' }"
            class="nav-link"
        >Home</router-link>
        <router-link
            v-if="userStore.isLoggedIn"
            :to="{ name: 'profile' }"
            class="nav-link"
        >Profile</router-link>
        <router-link
            v-if="userStore.isLoggedIn"
            :to="{ name: 'search' }"
            class="nav-link"
        >Tickets</router-link>
        <router-link
            v-if="userStore.isLoggedIn"
            :to="{ name: 'chat' }"
            class="nav-link"
        >Chat</router-link>
        <router-link
            v-if="!userStore.isLoggedIn"
            :to="{ name: 'login' }"
            class="nav-link"
        >Login</router-link>
        <router-link
            v-if="!userStore.isLoggedIn"
            :to="{ name: 'register' }"
            class="nav-link"
        >Register</router-link>
        <v-btn
            v-if="userStore.isLoggedIn"
            class="nav-link"
            @click="logout"
        >
          Logout
        </v-btn>
      </div>
    </v-app-bar>

    <v-main class="d-flex justify-center align-center pa-5 test">
      <RouterView></RouterView>
    </v-main>
  </v-app>
  <notifications  position="bottom left" />
</template>


