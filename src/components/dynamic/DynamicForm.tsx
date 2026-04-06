import React, { ChangeEvent, useState } from "react";

interface DynamicFormProps {
  inputs: { name: string; label: string; type: string; placeholder?: string }[];
  values: Record<string, string | number>;
  onSubmit?: (data: Record<string, string | number>[]) => void;
}

export default function DynamicForm({
  inputs,
  values,
  onSubmit,
}: DynamicFormProps) {
  const [fields, setFields] = useState([values]);

  // Input change handler
  const handleChange = (
    index: string | number,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const values = [...fields];
    values[index as number] = {
      ...values[index as number],
      [event.target.name]: event.target.value,
    };
    setFields(values);
  };

  // Add new field row
  const handleAddField = () => {
    setFields([...fields, { ...values }]);
  };

  // Submit handler
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(fields);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <div key={index} className="flex flex-row gap-2">
          {inputs.map((input) => (
            <input
              key={input.name}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={field[input.name as keyof typeof field]}
              className="input"
              onChange={(e) => handleChange(index, e)}
            />
          ))}
        </div>
      ))}

      <div className="flex flex-row gap-2">
        <button type="button" onClick={handleAddField} className="btn btn-natural">
          Add Row
        </button>
        <button type="reset" onClick={() => setFields([values])} className="btn btn-natural">
          Reset
        </button>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}
