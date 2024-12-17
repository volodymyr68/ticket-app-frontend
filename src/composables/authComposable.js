import {useUserStore} from "@/stores/userStore.js";
import {useCookies} from "vue3-cookies";
import router from "@/router/index.js";
import {axiosInstance} from "@/services/axios.js";
import {ref} from "vue";
import {notify} from "@kyvg/vue3-notification";


export const apiErrors = ref(null);

export const userErrors = ref({});

export const vehicleErrors = ref({});

export const login = async (email,password) => {
    apiErrors.value = null;
    const userStore = useUserStore();
    const { cookies } = useCookies();
    try {
        const response = await axiosInstance.post('/login', {
            email,
            password,
        });
        const data = response.data;
        userStore.setToken(data.token);
        cookies.set('apiToken', userStore.apiToken);
        router.push({'name':'search'});
    } catch (error) {
        notify({
            type: "error",
            title: "Login error",
            text: error.message,
        });
    }
}

export const register = async (name, email, password ) => {
    apiErrors.value = null;
    const userStore = useUserStore();
    const { cookies } = useCookies();
    try {
        const response = await axiosInstance.post('/register', {
            name,
            email,
            password,
        });
        const data = response.data;
        userStore.setToken(data.token);
        cookies.set('apiToken', userStore.apiToken);
        router.push({'name':'search'});
    } catch (error) {
        notify({
            type: "error",
            title: "Register error",
            text: error.message,
        });
    }
}

export const handleGoogleAuth = async () => {
    try {
        window.location.href = 'http://localhost:8080/google/redirect';
    } catch (error) {
        notify({
            type: "error",
            title: "Error during Google authentication",
            text: error.message,
        });
    }
};

export const logout = () => {
    const userStore = useUserStore();
    const { cookies } = useCookies();
    userStore.logout();
    cookies.remove('apiToken');
    router.push('/')
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export const checkToken = () => {
    const userStore = useUserStore();
    const { cookies } = useCookies();
    const token = getCookie('apiToken');
    if(token){
        userStore.setToken(decodeURIComponent(token));
    } else {
        userStore.isLoggedIn = false;
    }
}

export const validateUser = (user) => {
    userErrors.value = {};
    let isValid = true;

    if (!user.value.name || user.value.name.trim().length < 3) {
        userErrors.value.name = "Name must be at least 3 characters long.";
        isValid = false;
    }

    if (!user.value.number || !/^\d{12}$/.test(user.value.number)) {
        userErrors.value.number = "Phone number must be 12 digits.";
        isValid = false;
    }

    if (!user.value.sex || !["male", "female"].includes(user.value.sex)) {
        userErrors.value.sex = "Sex must be 'male' or 'female'.";
        isValid = false;
    }

    return isValid;
};

export const validateFields = (departure_city_id,destination_city_id,departure_time,seats_quantity) => {
    vehicleErrors.value = {};

    let isValid = true;

    if (!departure_city_id.value) {
        vehicleErrors.value.departure_city_id = "Виберіть місце відправки";
        isValid = false;
    }

    if (!destination_city_id.value) {
        vehicleErrors.value.destination_city_id = "Виберіть місце прибуття";
        isValid = false;
    }

    if (!departure_time.value) {
        vehicleErrors.value.departure_time = "Виберіть дату відправки";
        isValid = false;
    }

    if (!seats_quantity.value || seats_quantity.value < 1) {
        vehicleErrors.value.seats_quantity = "Вкажіть коректну кількість місць (від 1 до 4)";
        isValid = false;
    }

    return isValid;
};