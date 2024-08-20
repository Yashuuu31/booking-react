import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <div className="min-h-screen flex flex-col pt-5 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 lg:p-10">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
