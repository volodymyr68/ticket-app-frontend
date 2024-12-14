<script setup>
import {ref} from "vue";
import {apiErrors, handleGoogleAuth, login} from "@/composables/authComposable.js";
import {useFormValidation} from "@/composables/formValidationComposable.js";


const email = ref(null);
const password = ref(null);

const {
  errors,
  validateSignIn,
  isValidSignIn,
} = useFormValidation();

const handleRequest = async () => {
  validateSignIn(email.value, password.value);

  if (isValidSignIn()) {
      const response = await login(email.value, password.value);
  }
};

</script>

<template>
  <v-container class="sign-in-form">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-5" elevation="3">
          <v-card-title class="auth-title headline text-center">Sign In</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRequest">
              <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  :error-messages="errors.emailErrors"
                  required
              />
              <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  :error-messages="errors.passwordErrors"
                  required
              />
              <div v-if="apiErrors" class="error-message">{{ apiErrors }}</div>
              <v-btn class="auth-btn" color="primary" type="submit" block>Sign In</v-btn>
              <br>
              <v-btn class="auth-btn" color="secondary" to="/" block>Cancel</v-btn>
              <br>
              <v-btn
                  @click="handleGoogleAuth"
                  icon
                  variant="plain"
              >
                <v-icon>mdi-google</v-icon>
              </v-btn>
            </v-form>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
