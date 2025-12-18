// Input.tsx
import React from "react";

interface InputProps {
    type?: string;
    label?: string;
    id?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    type = "text",
    label,
    id,
    name,
    value,
    placeholder,
    onChange,
    disabled,
    className,
    }) => {
    return (
        <div>
        {label && (
            <label
                htmlFor={id}
                className="text-sm font-medium text-gray-700"
            >
                {label}
            </label>
        )}
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            className={`border rounded p-2 w-full ${className || ""}`}
        />
        </div>
    );
};

export default Input;
