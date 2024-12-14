import {axiosInstance} from "@/services/axios.js";
import {useUserStore} from "@/stores/userStore.js";
import {notify} from "@kyvg/vue3-notification";

export const payTicket = async (vehicle_id, seats_taken, price) => {
    const userStore = useUserStore();
    try {
        const response = await axiosInstance.post(
            '/tickets',
            {
                vehicle_id,
                seats_taken,
                price,
            },
            {
                headers: {
                    Authorization: `Bearer ${userStore.apiToken}`,
                },
            }
        );
    } catch (error) {
        notify({
            type: "error",
            title: "Payment fail",
            text: error.message,
        });
    }
}


export const downloadTicket = async (id) => {
    const userStore = useUserStore();
    try {
        const response = await axiosInstance.post(`/tickets/${id}/download`, {
            headers: {
                Authorization: `Bearer ${userStore.apiToken}`,
                Accept: 'application/json'
            },
            responseType: 'blob',
        });
        notify({
            type: "success",
            title: "Ticket will download soon",
        });

        // const url = window.URL.createObjectURL(new Blob([response.data]));
        //
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'vehicle_report.pdf');
        // document.body.appendChild(link);
        //
        // link.click();
        //
        // document.body.removeChild(link);
    } catch (error) {
        notify({
            type: "error",
            title: "Error downloading the file",
            text: error.message,
        });
    }
}