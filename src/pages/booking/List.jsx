import { useEffect, useState } from "react";
import { deleteBooking, getBookings } from "../../api/booking";
import { formatDate, format, parse } from "date-fns";
import { Link } from "react-router-dom";
import { errorToast, successToast } from "../../utils/utils";
import BaseSpinner from "../../components/base/BaseSpinner";

const List = () => {
  const [isApiCall, setIsApiCall] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState();

  useEffect(() => {
    fetchBookings();
  }, [isApiCall]);

  /**
   * Fetch api's
   */
  const fetchBookings = () => {
    getBookings({
      include: "timeSlot",
    })
      .then((res) => {
        setBookings(res.data);
      })
      .catch((error) => {
        errorToast(error.response?.data?.message);
      })
      .finally(() => setIsLoading(false));
  };

  /**
   * Handler methods
   */
  const formatBookinTime = (time) => {
    let parseTime = parse(time, "HH:mm:ss", new Date());
    return format(parseTime, "hh:mm a");
  };

  const handleDelete = (bookingId) => {
    let isConfirm = confirm("Are you sure want to delete?");
    if(isConfirm) {
      deleteBooking(bookingId).then((res) => {
        successToast(res.data?.message);
        setIsApiCall(prev => prev + 1);
        setIsLoading(true);
      }).catch((error) => {
        errorToast(error.response?.data?.message)
      });
    }
  }

  return (
    <>
      <div className="bg-white border rounded-lg">
        <div className="flex items-center justify-between p-6 bg-white">
          <h2 className="text-xl font-semibold">Bookings</h2>

          <Link to="booking/+" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New
          </Link>
        </div>

        <div className="w-full mx-auto p-6 pt-0">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Customer Name</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Customer Email</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Booking Date</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Time Slot</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Timing</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex min-h-[300px] w-full items-center justify-center">
                      <BaseSpinner />
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && bookings?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 px-4 py-2">{item.customer_name}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.customer_email}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{formatDate(item.booking_date, "dd MMM, yyyy")}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item?.time_slot?.name}</td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {formatBookinTime(item?.start_time)} to {formatBookinTime(item?.end_time)}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2 space-x-3">
                    <Link to={`/booking/${item.id}`} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default List;
