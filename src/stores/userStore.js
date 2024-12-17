import {defineStore} from 'pinia';
import {ref} from 'vue';
import {axiosInstance} from "@/services/axios.js";
import {notify} from "@kyvg/vue3-notification";

export const useUserStore = defineStore('userStore', () => {
    const isLoggedIn = ref(false);
    const apiToken = ref(null);
    const user = ref(null);

    const setUser = (data) => {
        user.value = data;
    }

    const setToken = (token) =>{
        apiToken.value = token;
        isLoggedIn.value = true;
    }

    const logout = () => {
        isLoggedIn.value = false;
        apiToken.value = null;
    };

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get('/users',
                {
                    headers: {
                        Authorization: `Bearer ${apiToken.value}`
                    }
                }
            );
            setUser(response.data.data);
        } catch (error) {
            notify({
                type: "error",
                title: "Failed to load user information",
                text: error.message,
            });
        }
    }

    const updateUser = async (user) => {
        try {
            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("number", user.number);
            formData.append("sex", user.sex);
            if(user.newImage){
                formData.append("image", user.newImage);
            }
            const response = await axiosInstance.post(`/users`, formData, {
                headers: {
                    Authorization: `Bearer ${apiToken.value}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setUser(response.data.data);
        } catch (error) {
            notify({
                type: "error",
                title: "Failed to update user",
                text: error.message,
            });
        }
    }

    return { isLoggedIn, apiToken, user , setUser ,setToken,logout,fetchUser,updateUser};
});

