import { Form, Formik } from "formik";
import BaseInput from "../../components/base/BaseInput";
import BaseTextarea from "../../components/base/BaseTextarea";
import { useEffect, useState } from "react";
import { getTimeSlots } from "../../api/timeslot";
import { isAfter, isEqual, isBefore, format } from "date-fns";
import { errorToast, successToast, timeToCurrentDate } from "../../utils/utils";
import * as yup from "yup";
import { storeBooking } from "../../api/booking";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentSlot, setCurrentSlot] = useState();

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  /**
   * Fetch Api's
   */
  const fetchTimeSlots = () => {
    getTimeSlots().then((res) => {
      setTimeSlots(res.data);
    });
  };

  /**
   * Handler methods
   */
  const handleStartTime = (e, { setFieldValue, values }) => {
    let startTime = timeToCurrentDate(e.target.value, "HH:mm");
    setFieldValue("start_time", format(startTime, "HH:mm"));
    let endTime = values?.end_date && timeToCurrentDate(values?.end_date, "HH:mm");

    timeSlots.map((slot) => {
      let slotStartTime = timeToCurrentDate(slot.start_time, "HH:mm:ss");
      let slotEndTime = timeToCurrentDate(slot.end_time, "HH:mm:ss");

      let checkSlotDate =
        ((isAfter(startTime, slotStartTime) && isBefore(startTime, slotEndTime)) || isEqual(startTime, slotStartTime)) &&
        ((isAfter(endTime, slotStartTime) && isBefore(endTime, slotEndTime)) || isEqual(endTime, slotEndTime));
      if (checkSlotDate) {
        setCurrentSlot(slot);
      }
    });
  };

  const handleEndTime = (e, { setFieldValue, values }) => {
    let startTime = timeToCurrentDate(values.start_time, "HH:mm");
    let endTime = timeToCurrentDate(e.target.value, "HH:mm");
    setFieldValue("end_time", format(endTime, "HH:mm"));

    if (startTime && endTime) {
      timeSlots.map((slot) => {
        let slotStartTime = timeToCurrentDate(slot.start_time, "HH:mm:ss");
        let slotEndTime = timeToCurrentDate(slot.end_time, "HH:mm:ss");
        console.log(startTime, slotStartTime);

        let checkSlotDate =
          ((isAfter(startTime, slotStartTime) && isBefore(startTime, slotEndTime)) || isEqual(startTime, slotStartTime)) &&
          ((isAfter(endTime, slotStartTime) && isBefore(endTime, slotEndTime)) || isEqual(endTime, slotEndTime));

        if (checkSlotDate) {
          setCurrentSlot(slot);
        }
      });
    }
  };

  const handleSlotBtn = (slot, { setFieldValue, values }) => {
    setFieldValue("start_time", slot.start_time);
    setFieldValue("end_time", slot.end_time);
    setCurrentSlot(slot);
  };

  const handleSubmit = (values) => {
    setIsSubmit(false);
    values.time_slot_id = currentSlot.id;
    storeBooking(values)
      .then((res) => {
        successToast(res.message);
        navigate("/");
      })
      .catch((error) => {
        errorToast(error.response?.data?.message);
      }).finally(() => setIsSubmit(true));
  };

  const initFormValues = {
    customer_name: "",
    customer_email: "",
    description: "",
    booking_date: "",
    start_time: "",
    end_time: "",
  };

  const initFormTouched = {
    customer_name: false,
    customer_email: false,
    description: false,
    booking_date: false,
    start_time: false,
    end_time: false,
  };

  const validationSchema = yup.object({
    customer_name: yup.string().required("Customer name is required").max(255, "Out of the range value."),
    customer_email: yup.string().required("Customer email is required").email().max(255, "Out of the range value."),
    description: yup.string().max(2000, "Out of the range value."),
    booking_date: yup.string().required("Please select booking date."),
    start_time: yup.string().required("Please select start time."),
    end_time: yup.string().required("Please select end time."),
  });

  return (
    <>
      <div className="flex space-x-5">
        <Formik onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={initFormValues} initialTouched={initFormTouched}>
          {({ values, touched, errors, setFieldValue, handleChange, handleBlur }) => (
            <Form autoComplete="off" className="w-full p-7 border rounded-lg">
              <div>
                <h2 className="text-2xl font-bold mb-6">Booking Form</h2>

                {/* <!-- Customer Name --> */}
                <div className="mb-4">
                  <BaseInput
                    id="customer_name"
                    label="Customer name"
                    placeholder="Enter customer name"
                    type="text"
                    name="customer_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.customer_name}
                    errorMsg={errors.customer_name}
                    touched={touched.customer_name}
                  />
                </div>

                {/* <!-- Customer Email --> */}
                <div className="mb-4">
                  <BaseInput
                    id="customer_email"
                    label="Customer email"
                    placeholder="Enter customer email"
                    type="email"
                    name="customer_email"
                    value={values.customer_email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.customer_email}
                    errorMsg={errors.customer_email}
                  />
                </div>

                <div className="mb-4">
                  <BaseTextarea
                    id="description"
                    label="Description"
                    placeholder="Enter booking description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.description}
                    errorMsg={errors.description}
                  />
                </div>

                {/* <!-- Date Picker --> */}
                <div className="mb-4">
                  <BaseInput
                    id="booking_date"
                    label="Booking date"
                    placeholder="Select booking date"
                    name="booking_date"
                    type="date"
                    value={values.booking_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.booking_date}
                    errorMsg={errors.booking_date}
                  />
                </div>

                {/* <!-- Slots --> */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Select Slots</label>
                  <div className="flex space-x-2">
                    {timeSlots?.map((item) => (
                      <div key={item.id}>
                        {item.id == currentSlot?.id ? (
                          <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => handleSlotBtn(item, { setFieldValue, values })}
                          >
                            {item.name}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* <!-- Start Time Picker --> */}
                <div className="mb-4">
                  <BaseInput
                    id="start_time"
                    label="Start time"
                    placeholder="Select start time"
                    type="time"
                    name="start_time"
                    value={values.start_time}
                    onChange={(e) => handleStartTime(e, { setFieldValue, values })}
                    onBlur={handleBlur}
                    touched={touched.start_time}
                    errorMsg={errors.start_time}
                  />
                </div>

                {/* <!-- End Time Picker --> */}
                <div className="mb-4">
                  <BaseInput
                    id="end_time"
                    label="End time"
                    placeholder="Select end time"
                    type="time"
                    name="end_time"
                    value={values.end_time}
                    onChange={(e) => handleEndTime(e, { setFieldValue, values })}
                    onBlur={handleBlur}
                    touched={touched.end_time}
                    errorMsg={errors.end_time}
                  />
                </div>

                {/* <!-- Submit Button --> */}
                {isSubmit ? (
                  <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                    Submit
                  </button>
                ) : (
                  <button disabled type="submit" className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                    Submit
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Create;
