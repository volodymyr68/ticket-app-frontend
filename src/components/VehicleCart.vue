<script setup>
defineProps({
  vehicle: Object,
});
</script>

<template>
  <v-card class="vehicle-card" max-width="400" outlined>
    <v-card-title>
      <span class="headline">{{ vehicle.departure_city }} to {{ vehicle.destination_city }}</span>
    </v-card-title>

    <v-card-subtitle>
      <span>{{ vehicle.departure_time }}</span>
    </v-card-subtitle>

    <v-card-text>
      <div><strong>Доступні квитки:</strong> {{ vehicle.seats_quantity }}</div>
      <div><strong>Клас обслуговування:</strong> ${{ vehicle.quality }}</div>
      <div><strong>Ціна квитка:</strong> ${{ vehicle.ticket_cost }}</div>
    </v-card-text>

    <v-card-actions>
      <router-link class="cta-link2" :to="{ name: 'vehicleDetails', params: { id: vehicle.id } }">View Vehicle</router-link>
    </v-card-actions>
  </v-card>
</template>
