<script setup>
import {ref} from "vue";
import {apiErrors, register} from "@/composables/authComposable.js";
import {useFormValidation} from "@/composables/formValidationComposable.js";

const name = ref(null);
const email = ref(null);
const password = ref(null);
const password_confirmation = ref(null);

const {
  errors,
  validateSignUp,
  isValidSignUp,
} = useFormValidation();

const handleRegister = async () => {
  validateSignUp(name.value, email.value, password.value, password_confirmation.value);

  if (isValidSignUp()) {
    const response = await register(name.value, email.value, password.value, password_confirmation.value);
    if (response.status !== 200) {
      const data = await response.data;
      apiErrors.value = data.message;
    }
  }
};
</script>

<template>
  <v-container class="sign-up-form">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-5" elevation="3">
          <v-card-title class="auth-title headline text-center">Sign Up</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                  v-model="name"
                  label="First Name"
                  :error-messages="errors.firstNameErrors"
                  required
              />
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
              <v-text-field
                  v-model="password_confirmation"
                  label="Repeat Password"
                  type="password"
                  :error-messages="errors.confirmPasswordErrors"
                  required
              />
              <div v-if="apiErrors" class="error-message">{{ apiErrors }}</div>
              <v-btn class="auth-btn" color="primary" type="submit" block>Sign Up</v-btn>
              <v-btn class="auth-btn" color="secondary" to="/" block>Cancel</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
