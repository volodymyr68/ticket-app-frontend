import {defineStore} from 'pinia'
import {ref} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {axiosInstance} from "@/services/axios.js";
import router from "@/router/index.js";
import {notify} from "@kyvg/vue3-notification";

export const useVehicleStore = defineStore('vehicleStore', () => {
    const vehicles = ref(null);
    const total = ref(null);
    const current_page = ref(null);
    const per_page = ref(null);
    const last_page = ref(null);
    const departure_city_id = ref(null);
    const destination_city_id = ref(null);
    const seats_quantity = ref(null);
    const departure_time = ref(null);
    const params = ref(null);

    const setParams = (newParams) => {
        if(!newParams.price_range){
            delete newParams.price_range;
        }
        if(!newParams.quality){
            delete newParams.quality;
        }
        params.value = newParams;
    };

    const setPagination = (data,meta) => {
        current_page.value = meta.current_page;
        per_page.value = meta.per_page;
        total.value = meta.total;
        vehicles.value = data;
        last_page.value = meta.last_page;
    };

    const fetchVehicle = async (newParams) => {
        const userStore = useUserStore();
        setParams(newParams);
        try {
            const response = await axiosInstance.get('/vehicles', {
                params: params.value,
                headers: {
                    Authorization: `Bearer ${userStore.apiToken}`,
                    Accept : 'application/json'
                },
            });
            const data = response.data.data;
            const meta = response.data.meta;
            setPagination(data,meta);
            if (total.value > 0) {
                await router.push({'name': 'vehicle'});
            }
        } catch (error) {
            notify({
                type: "error",
                title: "Failed to load vehicle information222",
                text: error.message,
            });
        }
    }

    const fetchVehiclesPagination = async (page) => {
        const userStore = useUserStore();
        try {
            const response = await axiosInstance.get(`/vehicles?page=${page}`, {
                params: params,
                headers: {
                    Authorization: `Bearer ${userStore.apiToken}`,
                    Accept : 'application/json'
                },
            });
            const data = response.data.data;
            const meta = response.data.meta;
            setPagination(data,meta);
        } catch (error) {
            notify({
                type: "error",
                title: "Failed to load vehicle information",
                text: error.message,
            });
        }
    }

    const getVehicleById = async (id) => {
        const userStore = useUserStore();
        try {
            const response = await axiosInstance.get(`/vehicles/${id}`, {
                headers: {
                    Authorization: `Bearer ${userStore.apiToken}`,
                    Accept : 'application/json'
                },
            });
            return response.data;
        } catch (error) {
            notify({
                type: "error",
                title: `Failed to load vehicle with id ${id}`,
                text: error.message,
            });
        }
    }



    return {vehicles,total,current_page,per_page,last_page,params,setParams, setPagination, fetchVehicle,fetchVehiclesPagination,getVehicleById};
});