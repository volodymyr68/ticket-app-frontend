<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { payTicket } from "@/composables/ticketComposable.js";

import Pusher from "pusher-js";
import { useVehicleStore } from "@/stores/vehicleStore.js";
import { useBonusStore } from "@/stores/bonusStore.js";

const route = useRoute();
const vehicleId = route.params.id;
const vehicle = ref(null);
const selectedSeats = ref(1);
const vehicleStore = useVehicleStore();
const bonusStore = useBonusStore();
const isBonus = ref(false);

onMounted(async () => {
  const response = await vehicleStore.getVehicleById(vehicleId);
  await bonusStore.fetchUserBonus();
  vehicle.value = response.data;

  const pusher = new Pusher("0c48b8eef40cc5d2451b", {
    cluster: "eu",
  });

  const channel = pusher.subscribe("DownloadTicket");
  channel.bind("App\\Events\\SendTicketEvent", function (data) {
    const downloadUrl = data.url;

    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "ticket.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Download URL is missing!");
    }
  });
});

const ticketPrice = computed(() => {
  const basePrice = selectedSeats.value * (vehicle.value?.ticket_cost || 0);
  if (isBonus.value) {
    return Math.max(basePrice - bonusStore.bonus, 0);
  }
  return basePrice;
});
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h5 text-center">
            Ticket for Trip: {{ vehicle?.departure_city }} → {{ vehicle?.destination_city }}
          </v-card-title>
          <v-card-subtitle class="text-center">
            Departure Time: {{ new Date(vehicle?.departure_time).toLocaleString() }}
          </v-card-subtitle>

          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-list dense>
                  <v-list-item>
                    <v-list-item-title>Departure City</v-list-item-title>
                    <v-list-item-subtitle>{{ vehicle?.departure_city }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Destination City</v-list-item-title>
                    <v-list-item-subtitle>{{ vehicle?.destination_city }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Seats Available</v-list-item-title>
                    <v-list-item-subtitle>{{ vehicle?.seats_quantity }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Ticket Cost</v-list-item-title>
                    <v-list-item-subtitle>${{ vehicle?.ticket_cost }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="6" class="d-flex justify-center align-center">
                <v-img
                    src="https://cdn.vuetifyjs.com/images/cards/road.jpg"
                    max-height="200"
                    max-width="300"
                ></v-img>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row align="center" justify="space-between" class="mt-4">
              <v-col cols="12" md="6">
                <v-select
                    v-model="selectedSeats"
                    :items="[1, 2, 3, 4]"
                    label="Number of Seats"
                    outlined
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <p class="text-h6">
                  Total Cost: ${{ ticketPrice.toFixed(2) }}
                </p>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <v-checkbox
                    :label="`Use bonuses (${bonusStore.bonus} available)`"
                    v-model="isBonus"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-row justify="center">
              <v-btn
                  color="primary"
                  block
                  class="pay-button"
                  @click="payTicket(vehicleId, selectedSeats, ticketPrice, isBonus)"
              >
                Confirm and Pay
              </v-btn>

              <v-btn color="secondary" block class="back-button">
                <router-link :to="{ name: 'search' }">Back to Search</router-link>
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@import "../styles/vehicle-details.css";
</style>