<script setup>
import {useVehicleStore} from "@/stores/vehicleStore.js";
import {onMounted, ref, watch} from "vue";
import router from "@/router/index.js";
import VehicleModel from "@/components/VehicleCart.vue";

const vehicleStore = useVehicleStore();

const params = ref({
  price_range: null,
  quality: null,
  sort_by_time: 'asc',
  ...vehicleStore.params,
});

onMounted(() => {
  if (!vehicleStore.total) {
    router.push({"name": "search"});
  }
  watch(
      () => vehicleStore.current_page,
      async (newPage) => {
        await vehicleStore.fetchVehiclesPagination(newPage);
      }
  );
});
</script>

<template>
  <v-app class="app">
    <v-navigation-drawer app width="300" class="filters">
      <v-toolbar flat dense>
        <v-toolbar-title>Фільтри</v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <v-list>
        <v-list-item>
          <v-list-item-title>Діапазон цін</v-list-item-title>
          <v-slider
              v-model="params.price_range"
              tick-size="2"
              :max="1000"
              :min="1"
              :step="1"
              v-tooltip:top="params.price_range"
              @end="vehicleStore.fetchVehicle(params)"
              class="mt-2"
          />
        </v-list-item>

        <v-divider />

        <v-list-item>
          <v-list-item-title>Клас обслуговування</v-list-item-title>
          <v-select
              v-model="params.quality"
              :items="['Premium', 'Middle', 'Low']"
              label="Виберіть клас"
              @update:model-value="() => vehicleStore.fetchVehicle(params)"
              dense
          />
        </v-list-item>

        <v-divider />

        <v-list-item>
          <v-list-item-title>Сортування</v-list-item-title>
          <v-select
              v-model="params.sort_by_time"
              :items="['asc', 'desc']"
              label="Сортувати за часом"
              @update:model-value="() => vehicleStore.fetchVehicle(params)"
              dense
          />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-row>
          <v-col v-for="vehicle in vehicleStore.vehicles" :key="vehicle.id" cols="12" md="4">
            <VehicleModel :vehicle="vehicle" />
          </v-col>
        </v-row>

        <div class="pagination-wrapper">
          <v-btn
              icon
              :disabled="vehicleStore.current_page === 1"
              @click="vehicleStore.fetchVehiclesPagination(vehicleStore.current_page - 1)"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <span>{{ vehicleStore.current_page }} / {{ vehicleStore.last_page }}</span>

          <v-btn
              icon
              :disabled="vehicleStore.current_page === vehicleStore.last_page"
              @click="vehicleStore.fetchVehiclesPagination(vehicleStore.current_page + 1)"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
