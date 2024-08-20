const BaseTextarea = ({ id, label, placeholder, name, errorMsg, touched, ...restProps }) => {
    return (
      <div className="">
        <label className="block text-gray-700 font-medium mb-2" htmlFor={id}>
          {label}
        </label>
        <textarea
          id={id}
          name={name}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          {...restProps}
        >{restProps?.value}</textarea>
        {errorMsg && touched && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
      </div>
    );
  };
  
  export default BaseTextarea;
  