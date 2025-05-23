import React from "react";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = "text",
  required = false,
  children,
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-gunmetal font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children ? (
        children
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          required={required}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
        />
      )}
    </div>
  );
};

export default FormField;
