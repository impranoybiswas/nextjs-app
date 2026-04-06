import generatePDF from "@/lib/generate-pdf";
import DynamicForm from "../dynamic/DynamicForm";

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

export default function FormToPDF() {
  const submitData = (data: Record<string, string | number>[]) => {
    generatePDF({ values: data as Record<string, number>[] });
  };
  return (
    <div className="card">
      <h2>Form to PDF</h2>
      <p>Generate a PDF from form data using jsPDF and autoTable.</p>
      <DynamicForm inputs={inputs} values={values} onSubmit={submitData} />
    </div>
  );
}
