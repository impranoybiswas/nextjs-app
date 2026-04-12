import generatePDF from "@/lib/generate-pdf";
import DynamicRow from "../dynamic/DynamicRow";
import { useState, SubmitEvent } from "react";

const inputs = [
  {
    name: "product",
    label: "Product Name",
    type: "text",
    placeholder: "Product",
  },
  { name: "price", label: "Price", type: "number", placeholder: "Price" },
];

const values = {
  product: "",
  price: 0 as number,
};

export type RowData = Record<string, string | number>;

export default function FormToPDF() {
  const [rowData, setRowData] = useState<RowData[]>([]);

  const submitData = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = (
      e.currentTarget.elements.namedItem("title") as HTMLInputElement
    ).value;
    console.log("Form Data : ", { title, rowData });
    generatePDF({ values: rowData });
  };

  return (
    <div className="card">
      <form onSubmit={submitData} className="space-y-2">
        <input
          type="text"
          name="title"
          placeholder="Form Title"
          className="input"
        />
        <DynamicRow inputs={inputs} values={values} onChange={setRowData} />
        <button type="submit" className="btn btn-primary">
          Generate PDF
        </button>
      </form>
    </div>
  );
}
