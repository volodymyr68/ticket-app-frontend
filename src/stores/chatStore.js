import {defineStore} from "pinia";
import {ref} from "vue";
import {axiosInstance} from "@/services/axios.js";
import {useUserStore} from "@/stores/userStore.js";

export const useChatStore = defineStore("chatStore", () => {
    const chatId = ref("");
    const messages = ref([]);
    const clientId = ref("");


    const getChat = async () => {
        const userStore = useUserStore();
        try {
            const response = await axiosInstance.get(`/chats`, {
                    headers: {
                        Authorization: `Bearer ${userStore.apiToken}`,
                    }
                });
            chatId.value = response.data[0].id;
            clientId.value = response.data[0].client_id;
        } catch (e) {
            console.log(e)
        }
    }

    const getMessages = async () => {
        const userStore = useUserStore();
        try {
            const response = await axiosInstance.get(`/chats/${chatId.value}`,
                {
                    headers: {
                        Authorization: `Bearer ${userStore.apiToken}`,
                    },
                }
             );
            messages.value = response.data[0].messages;
        } catch (e) {
            console.log(e)
        }
    }

    const sendMessage = async (message) => {
        const userStore = useUserStore();
        try {
            const response = await axiosInstance.post(`chats/${chatId.value}/messages`,
                {
                    message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userStore.apiToken}`,
                    },
                });
        }catch (e) {
            console.log(e);
        }
    };

    const pushMessage = (message) => {
        messages.value.push(message);
    }

    return {chatId,messages,getChat,getMessages,sendMessage,pushMessage,clientId}
})