<script setup>
import { computed, onMounted, ref } from 'vue';
import { useCityStore } from "@/stores/cityStore.js";
import { useVehicleStore } from "@/stores/vehicleStore.js";
import {userErrors, validateFields, vehicleErrors} from "@/composables/authComposable.js";

const departure_city_id = ref(null);
const destination_city_id = ref(null);
const departure_time = ref(new Date());
const seats_quantity = ref(1);


const cityStore = useCityStore();
const vehicleStore = useVehicleStore();

const destinations = computed(() =>
    cityStore.cities.map(city => ({
      title: city.name,
      value: city.id
    }))
);

const adjustDepartureTimeAndFetch = () => {
  if (!validateFields(departure_city_id,destination_city_id,departure_time,seats_quantity)) {
    console.log("Validation failed:", vehicleErrors.value);
    return;
  }

  const departure_time_add = new Date(departure_time.value);
  departure_time_add.setDate(departure_time_add.getDate() + 1);
  const formatedDate = departure_time_add.toISOString().split('T')[0];

  const params = {
    departure_city_id: departure_city_id.value,
    destination_city_id: destination_city_id.value,
    departure_time: formatedDate,
    seats_quantity: seats_quantity.value
  };

  console.log("Search Params:", params);
  vehicleStore.fetchVehicle(params);
};

onMounted(async () => {
  await cityStore.fetchCities();
});
</script>

<template>
  <v-card elevation="3" class="pa-4" width="700">
    <v-card-title>Знайди та забронюй собі квитки</v-card-title>
    <v-card-text>
      <v-select
          label="Місце відправки"
          v-model="departure_city_id"
          :items="destinations"
          :item-props="true"
          item-text="title"
          item-value="value"
          outlined
          dense
          :error="!!vehicleErrors.departure_city_id"
          :error-messages="vehicleErrors.departure_city_id"
      />

      <v-select
          label="Місце прибуття"
          v-model="destination_city_id"
          :items="destinations"
          item-text="title"
          item-value="value"
          outlined
          dense
          class="mt-4"
          :error="!!vehicleErrors.destination_city_id"
          :error-messages="vehicleErrors.destination_city_id"
      />

      <v-date-input
          label="Дата відправки:"
          variant="solo-filled"
          v-model="departure_time"
          :error="!!vehicleErrors.departure_time"
          :error-messages="vehicleErrors.departure_time"
      ></v-date-input>

      <v-number-input
          label="Кількість місць:"
          :max="4"
          :min="1"
          :model-value="seats_quantity"
          control-variant="stacked"
          v-model="seats_quantity"
          :error="!!vehicleErrors.seats_quantity"
          :error-messages="vehicleErrors.seats_quantity"
      ></v-number-input>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" block @click="adjustDepartureTimeAndFetch">
        Пошук квитків
      </v-btn>
    </v-card-actions>
    <v-alert
        v-if="vehicleStore.total === 0"
        type="info"
        elevation="2"
    >
      На данний момент немає квитків за цим маршрутом та датою
    </v-alert>
  </v-card>
</template>
