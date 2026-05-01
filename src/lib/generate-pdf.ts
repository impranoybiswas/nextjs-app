import { RowData } from "@/components/pdf-generate/FormToPDF";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePDF({
  values,
}: {
  values: RowData[];
}) {
  const doc = new jsPDF("portrait", "px", "a4");
  const title = "Test PDF";

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const currentY = 20;

  const addDivider = (y: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    return y + 5;
  };

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), pageWidth / 2, currentY + 10, {
    align: "center",
  });

  addDivider(currentY + 20);

  autoTable(doc, {
    startY: currentY + 30,
    head: [["ID", "PRODUCT", "PRICE"]],
    body: values.map((row, index) => [
      index + 1,
      row.product,
      parseFloat(row.price.toString()).toFixed(2),
    ]),
    theme: "grid",
    styles: {
      cellPadding: 8,
      fontSize: 12,
      overflow: "linebreak",
    },
  });

  doc.save(`${title}.pdf` || "new-document.pdf");
}
