import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type JsPDFWithAutoTable = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

type Order = {
  id: string;
  created_at?: string;
  customer: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  payment: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: {
    name: string;
    quantity: number;
    size?: string;
    price: number;
  }[];
};

export function generateInvoice(order: Order) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("EXRONIX", 14, 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("ENGINEERED BEYOND LIMITS — Precision 3D Printing", 14, 28);

  doc.line(14, 35, 196, 35);

  // Invoice Info
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", 14, 46);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Order ID: ${order.id}`, 14, 56);
  doc.text(
  `Date: ${
    order.created_at
      ? new Date(order.created_at).toLocaleString("en-NP", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "N/A"
  }`,
  14,
  63
);

  doc.text(`Customer: ${order.customer}`, 14, 75);
  doc.text(`Email: ${order.email ?? "-"}`, 14, 82);
  doc.text(`Phone: ${order.phone ?? "-"}`, 14, 89);

  doc.text(
    `Address: ${order.address ?? ""}, ${order.city ?? ""}, ${
      order.postalCode ?? ""
    }`,
    14,
    96
  );

  doc.text(`Payment: ${order.payment}`, 14, 103);

  autoTable(doc, {
    startY: 112,
    head: [["Product", "Size", "Qty", "Price"]],
    body: (order.items ?? []).map((item) => [
      item.name,
      item.size ?? "-",
      item.quantity,
      `NPR ${item.price.toLocaleString()}`,
    ]),
  });

  const finalY = ((doc as JsPDFWithAutoTable).lastAutoTable?.finalY ?? 112) + 10;

  doc.setFontSize(12);

  doc.text(
    `Subtotal: NPR ${order.subtotal.toLocaleString()}`,
    140,
    finalY
  );

  doc.text(
    `Shipping: ${
      order.shipping === 0
        ? "FREE"
        : `NPR ${order.shipping.toLocaleString()}`
    }`,
    140,
    finalY + 8
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    `Total: NPR ${order.total.toLocaleString()}`,
    140,
    finalY + 18
  );

  doc.setFont("helvetica", "normal");

  doc.text(
    "Thank you for ordering with EXRONIX",
    14,
    finalY + 35
  );

  doc.save(`Invoice-${order.id}.pdf`);
}