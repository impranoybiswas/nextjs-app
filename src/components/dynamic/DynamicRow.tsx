import React, { ChangeEvent, useEffect, useState } from "react";

interface DynamicFormProps {
  inputs: { name: string; label: string; type: string; placeholder?: string }[];
  values: Record<string, string | number>;
  onChange?: (data: Record<string, string | number>[]) => void;
}

export default function DynamicRow({
  inputs,
  values,
  onChange,
}: DynamicFormProps) {
  const [fields, setFields] = useState([values]);

  useEffect(() => {
    onChange?.(fields);
  }, [fields, onChange]);

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const updated = [...fields];
    updated[index] = {
      ...updated[index],
      [event.target.name]: event.target.value,
    };
    setFields(updated);
  };

  const handleAddField = () => {
    setFields([...fields, { ...values }]);
  };

  const handleRemoveField = (index: number) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  return (
    <>
      {fields.map((field, index) => (
        <div key={index} className="flex items-center gap-2">
          {inputs.map((input) => (
            <input
              key={input.name}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={field[input.name]}
              className="input"
              onChange={(e) => handleChange(index, e)}
            />
          ))}

          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveField(index)}
              className="btn-circular bg-red-600 text-white"
            >
              -
            </button>
          )}

          {index === fields.length - 1 && (
            <button
              type="button"
              onClick={handleAddField}
              className="btn-circular bg-green-600 text-white"
            >
              +
            </button>
          )}
        </div>
      ))}
    </>
  );
}
