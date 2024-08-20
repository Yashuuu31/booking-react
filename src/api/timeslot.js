import $axios from "../utils/axios"

export const getTimeSlots = async () => {
    return $axios.get('time-slots').then(res => res.data);
}