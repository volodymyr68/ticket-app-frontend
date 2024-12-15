import {defineStore} from "pinia";
import {ref} from "vue";
import {axiosInstance} from "@/services/axios.js";
import {useUserStore} from "@/stores/userStore.js";

export const useBonusStore = defineStore('bonusStore',()=>{
    const bonus = ref(0);

    const fetchUserBonus = async () =>{
        const userStore = useUserStore();
        const response = await axiosInstance.get('/bonuses',
            {
                headers: {
                    Authorization: `Bearer ${userStore.apiToken}`
                },
            });
           bonus.value = response.data.amount;
    }
    return {bonus, fetchUserBonus}
})