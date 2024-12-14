import {useUserStore} from "@/stores/userStore.js";
import {axiosInstance} from "@/services/axios.js";
import {notify} from "@kyvg/vue3-notification";

export const download = async () => {
    const userStore = useUserStore();
    try {
        const response = await axiosInstance.get('/vehicle/download', {
            headers: {
                Authorization: `Bearer ${userStore.apiToken}`,
                Accept: 'application/json'
            },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'vehicle_report.pdf');
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    } catch (error) {
        notify({
            type: "error",
            title: "Error downloading the file",
            text: error.message,
        });
    }
}