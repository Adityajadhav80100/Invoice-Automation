# InvoiceFlow Frontend

Minimal Vite + React frontend for uploading invoice PDFs/images and downloading AI-generated Excel output.

## Setup

```bash
npm install
copy .env.example .env
```

Set `VITE_N8N_WEBHOOK_URL` in `.env`, then run:

```bash
npm run dev
```

## Download contract

The frontend expects the n8n webhook to return a binary `.xlsx` file directly.

- `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition: attachment; filename="invoice-data-YYYY-MM-DD.xlsx"`
- Response body must be binary, not JSON

Frontend download handling is implemented with `await response.blob()` in [src/services/invoiceService.js](D:/WEBDEV/PROJECTS/Invoice-Automation/src/services/invoiceService.js).

Backend formatting guidance is documented in [docs/n8n-excel-guidance.md](D:/WEBDEV/PROJECTS/Invoice-Automation/docs/n8n-excel-guidance.md).
