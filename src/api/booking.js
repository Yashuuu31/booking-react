import $axios from "../utils/axios"

export const getBookings = async (params) => {
    return $axios.get('bookings', {
        params: params
    }).then(res => res.data)
}

export const getBooking = async (id, params) => {
    return $axios.get(`bookings/${id}`, {
        params: params
    }).then(res => res.data)   
}

export const storeBooking = async (data) => {
    return $axios.post('bookings', data).then(res => res.data);
}

export const updateBooking = async (id, data) => {
    return $axios.put(`bookings/${id}`, data).then(res => res.data);
}

export const deleteBooking = async (id) => {
    return $axios.delete(`bookings/${id}`).then(res => res.data);
}