import {defineStore} from "pinia";
import {ref} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {axiosInstance} from "@/services/axios.js";
import {notify} from "@kyvg/vue3-notification";

export const useTicketStore = defineStore('ticketStore',()=>{
   const userTickets = ref(null);
   const setUserTickets = (tickets) => {
       userTickets.value = tickets;
   }

    const fetchUserTickets = async () =>{
        const userStore = useUserStore();
        try {
            const response = await axiosInstance.get(
                '/tickets',
                {
                    headers: {
                        Authorization: `Bearer ${userStore.apiToken}`,
                    },
                }
            );
            setUserTickets(response.data.data);
        } catch (error) {
            notify({
                type: "error",
                title: "Failed to load tickets",
                text: error.message,
            });
        }
    }

    return { userTickets, setUserTickets,fetchUserTickets };
});

