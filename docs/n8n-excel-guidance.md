# n8n Excel Guidance

Use these backend settings so the React frontend receives a real Excel binary instead of JSON or text.

## Binary download contract

- Webhook response must return the Excel file as binary.
- Set `Content-Type` to `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
- Set `Content-Disposition` to `attachment; filename="invoice-data-YYYY-MM-DD.xlsx"`.
- Do not wrap the file in JSON.
- In n8n, respond with the binary property that contains the `.xlsx` output.

## Column order

Use a fixed column order for every row:

1. `Vendor Name`
2. `Invoice Date`
3. `GSTIN`
4. `Grand Total`

## Data normalization

- Replace missing values with `N/A`.
- Normalize dates to `YYYY-MM-DD`.
- Keep one invoice per row.
- For multiple invoices, build an array of row objects before writing the sheet.

Example normalized row:

```json
{
  "Vendor Name": "Acme Supplies",
  "Invoice Date": "2026-03-20",
  "GSTIN": "27ABCDE1234F1Z5",
  "Grand Total": 15420.75
}
```

## Excel styling

If you stay in n8n, use a code step with `exceljs` or generate the workbook in a small Node service.

Recommended worksheet formatting:

- Header row: bold text, fill color `#D9EAF7` or light gray, centered vertically.
- Borders: thin border on all populated cells.
- Alignment: text columns left, totals right.
- Currency: `₹#,##0.00` or `$#,##0.00`.
- Date: `yyyy-mm-dd`.
- Widths:
  - `Vendor Name`: 28
  - `Invoice Date`: 16
  - `GSTIN`: 20
  - `Grand Total`: 18

## Suggested `exceljs` approach

```js
import ExcelJS from "exceljs";

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("Invoices");

sheet.columns = [
  { header: "Vendor Name", key: "vendorName", width: 28 },
  { header: "Invoice Date", key: "invoiceDate", width: 16 },
  { header: "GSTIN", key: "gstin", width: 20 },
  { header: "Grand Total", key: "grandTotal", width: 18 },
];

rows.forEach((row) => {
  sheet.addRow({
    vendorName: row.vendorName || "N/A",
    invoiceDate: row.invoiceDate || "N/A",
    gstin: row.gstin || "N/A",
    grandTotal: Number(row.grandTotal ?? 0),
  });
});

sheet.getRow(1).font = { bold: true };
sheet.getRow(1).fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9EAF7" },
};

sheet.eachRow((row, rowNumber) => {
  row.eachCell((cell, colNumber) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    if (rowNumber === 1) {
      cell.alignment = { vertical: "middle", horizontal: "left" };
      return;
    }

    if (colNumber === 4) {
      cell.alignment = { horizontal: "right" };
      cell.numFmt = "₹#,##0.00";
      return;
    }

    if (colNumber === 2 && cell.value !== "N/A") {
      cell.numFmt = "yyyy-mm-dd";
    }

    cell.alignment = { horizontal: "left" };
  });
});

const buffer = await workbook.xlsx.writeBuffer();
```

## Better long-term option

For more control, move Excel generation out of n8n into a Node.js service that:

- accepts normalized invoice JSON,
- generates the workbook with `exceljs`,
- returns the buffer with the same binary headers,
- lets n8n focus on orchestration only.
