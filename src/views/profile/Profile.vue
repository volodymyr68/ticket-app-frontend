<script setup>
import { useUserStore } from "@/stores/userStore.js";
import { onMounted, ref, watch } from "vue";
import { useTicketStore } from "@/stores/ticketStore.js";
import { downloadTicket } from "@/composables/ticketComposable.js";
import Pusher from "pusher-js";
import {userErrors, validateUser} from "@/composables/authComposable.js";
import {useBonusStore} from "@/stores/bonusStore.js";

const userStore = useUserStore();
const ticketStore = useTicketStore();
const bonusStore = useBonusStore();

const user = ref({
  id: '',
  name: '',
  email: '',
  number: '',
  sex: '',
  image: '',
  newImage: null,
});

const tickets = ref([]);


onMounted(async () => {
  await userStore.fetchUser();
  user.value = { ...userStore.user };
  await ticketStore.fetchUserTickets();
  await  bonusStore.fetchUserBonus();
  tickets.value = ticketStore.userTickets;
  const pusher = new Pusher('0c48b8eef40cc5d2451b', {
    cluster: 'eu',
  });

  const channel = pusher.subscribe('DownloadTicket');
  channel.bind('App\\Events\\SendTicketEvent', function (data) {
    const downloadUrl = data.url;

    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'ticket.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Download URL is missing!');
    }
  });
});

watch(
    () => userStore.user,
    (newUser) => {
      user.value = { ...newUser };
    },
    { deep: true }
);

watch(
    () => ticketStore.userTickets,
    (newTickets) => {
      tickets.value = newTickets;
    },
    { deep: true }
);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    user.value.newImage = file;
    console.log('Selected file:', file);
  }
};

const saveUser = () => {
  if (validateUser(user)) {
    console.log(user.value)
    userStore.updateUser(user.value);
  } else {
    console.log("Validation failed!", userErrors.value);
  }
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h5 text-center">
            Personal Profile
          </v-card-title>
          <v-img
              :src="user.image"
              alt="Failed to load image"
              height="200px"
              width="200px"
          ></v-img>
          <v-card-actions>
              Current bonus : {{bonusStore.bonus}}
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4" justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>User Information</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                  v-model="user.name"
                  label="Name"
                  outlined
                  :error="!!userErrors.name"
                  :error-messages="userErrors.name"
              ></v-text-field>

              <v-text-field
                  v-model="user.number"
                  label="Phone"
                  outlined
                  :error="!!userErrors.number"
                  :error-messages="userErrors.number"
              ></v-text-field>

              <v-select
                  v-model="user.sex"
                  :items="['male', 'female']"
                  label="Sex"
                  outlined
                  :error="!!userErrors.sex"
                  :error-messages="userErrors.sex"
              ></v-select>

              <input type="file" @change="handleFileChange" />
              <p v-if="user.newImage">Selected file: {{ user.newImage.name }}</p>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="primary" @click="saveUser">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4" justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Purchase History</v-card-title>
          <v-card-text>
            <v-list v-if="tickets && tickets.length !== 0" dense>
              <v-list-item
                  v-for="ticket in tickets"
                  :key="ticket.id"
              >
                <div>
                  <v-list-item-title>
                    Trip: {{ ticket.departure_city }} → {{ ticket.destination_city }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Seats taken: {{ ticket.seats_taken }}, Price ${{ ticket.price }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Departure: {{ ticket.departure_time }}
                  </v-list-item-subtitle>
                </div>
                <v-spacer></v-spacer>
                <v-btn
                    class="ml-2"
                    @click="downloadTicket(ticket.id)"
                >
                  Download pdf
                </v-btn>
              </v-list-item>
            </v-list>
            <v-alert
                v-else
                elevation="2"
                type="info"
            >
              История покупок пуста
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>