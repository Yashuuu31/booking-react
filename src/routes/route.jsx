import { createBrowserRouter } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import BookingList from "../pages/booking/List";
import BookingCreate from "../pages/booking/Create";
import BookingEdit from "../pages/booking/Edit";

const routes = createBrowserRouter([
    {
        element: <BaseLayout />,
        children:[
            {
                path:"/",
                element: <BookingList />
            },
            {
                path:"/booking/+",
                element:<BookingCreate />,
                id:"booking-create"
            },
            {
                path:"/booking/:id",
                element:<BookingEdit />,
                id:"booking-edit"
            }
        ],
    }
]);

export default routes