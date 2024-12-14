import {ref} from 'vue'
import {defineStore} from 'pinia'
import {axiosInstance} from "@/services/axios.js";
import {useUserStore} from "@/stores/userStore.js";
import {notify} from "@kyvg/vue3-notification";

export const useCityStore = defineStore('cityStore', () => {
    const cities = ref([]);
    const userStore = useUserStore();

    const fetchCities = async () => {
        try {
            const response = await axiosInstance.get('/cities', {
                headers: {
                    Authorization: `Bearer ${userStore.apiToken}`
                },
                withCredentials: true
            });
            cities.value = response.data;
        } catch (error) {
            notify({
                type: "error",
                title: "Failed to fetch cities",
                text: error.message,
            });
        }
    };

    return { cities, fetchCities };
});