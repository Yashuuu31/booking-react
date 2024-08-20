const BaseInput = ({ id, label, type, placeholder, name, errorMsg, touched, ...restProps }) => {
  return (
    <div className="">
      <label className="block text-gray-700 font-medium mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        {...restProps}
      />
      {errorMsg && touched && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  );
};

export default BaseInput;
