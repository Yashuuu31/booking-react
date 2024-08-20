import { parse } from "date-fns"
import { toast } from "react-toastify";

export const timeToCurrentDate = (time, timeFormat) => {
    let date = parse(time, timeFormat, new Date());
    return date;
}

export const errorToast = (message) => {
    toast(message, {
        position:"top-right",
        autoClose:3000,
        closeOnClick:true,
        pauseOnHover:true,
        draggable:true,
        theme:"light",
        type:"error",
    });
}

export const successToast = (message) => {
    toast(message, {
        position:"top-right",
        autoClose:3000,
        closeOnClick:true,
        pauseOnHover:true,
        draggable:true,
        theme:"light",
        type:"success",
    });
}