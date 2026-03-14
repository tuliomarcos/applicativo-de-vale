# API Specification — Vales de Terraplanagem

Base URL: `/api`

All authenticated endpoints require `Authorization: Bearer <token>` header.

## Auth

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/signup | {name: string (required), phone: string (required), email: string (required), password: string (required), role: enum('PRESTADOR','CLIENTE','EMPRESA') (required)} | {token: string, user: {id: UUID, email: string, name: string, phone: string, role: string}} | No |
| POST | /api/auth/login | {email: string (required), password: string (required)} | {token: string, user: {id: UUID, email: string, name: string, phone: string, role: string}} | No |
| GET | /api/auth/me | — | {user: {id: UUID, email: string, name: string, phone: string, role: string}} | Bearer |

## Clients

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/clients | {name: string (required), cnpj: string (required), address: string (required), phone: string (required), email: string (required)} | {id: UUID, name: string, cnpj: string, address: string, phone: string, email: string, createdAt: ISO8601} | Yes |
| GET | /api/clients | query: ?search=string&page=integer&limit=integer | {items: Client[], total: integer, page: integer, totalPages: integer} | Yes |
| GET | /api/clients/:id | — | Client | Yes |
| PATCH | /api/clients/:id | {name: string (optional), cnpj: string (optional), address: string (optional), phone: string (optional), email: string (optional)} | Client | Yes |
| DELETE | /api/clients/:id | — | {success: boolean} | Yes |

Client shape: `{id: UUID, name: string, cnpj: string, address: string, phone: string, email: string, createdAt: ISO8601}`

## Prestadores (Service Providers)

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/prestadores | {name: string (required), document: string (required), documentType: enum('CPF','CNPJ') (required), address: string (required), phone: string (required), email: string (required)} | Prestador | Yes |
| GET | /api/prestadores | query: ?search=string&page=integer&limit=integer | {items: Prestador[], total: integer, page: integer, totalPages: integer} | Yes |
| GET | /api/prestadores/:id | — | Prestador | Yes |
| PATCH | /api/prestadores/:id | {name: string (optional), document: string (optional), documentType: enum (optional), address: string (optional), phone: string (optional), email: string (optional)} | Prestador | Yes |
| DELETE | /api/prestadores/:id | — | {success: boolean} | Yes |

Prestador shape: `{id: UUID, name: string, document: string, documentType: string, address: string, phone: string, email: string, createdAt: ISO8601}`

## Empresa (Earthmoving Company)

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/empresa | {name: string (required), cnpj: string (required), address: string (required), phone: string (required), primaryColor: string (required), secondaryColor: string (required)} | Empresa | Yes |
| GET | /api/empresa | — | Empresa \| null | Yes |
| PATCH | /api/empresa/:id | {name: string (optional), cnpj: string (optional), address: string (optional), phone: string (optional), primaryColor: string (optional), secondaryColor: string (optional)} | Empresa | Yes |

Empresa shape: `{id: UUID, name: string, cnpj: string, address: string, phone: string, primaryColor: string, secondaryColor: string, logoUrl: string | null, userId: UUID, createdAt: ISO8601}`

## File Upload (Logo)

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/upload/presigned | {fileName: string (required), contentType: string (required), isPublic: boolean (required)} | {uploadUrl: string, cloud_storage_path: string} | Yes |
| POST | /api/upload/complete | {cloud_storage_path: string (required), empresaId: UUID (required)} | {id: UUID, cloud_storage_path: string, url: string} | Yes |
| GET | /api/files/:id/url?mode=view | — | {url: string} | Yes |

## Vales (Vouchers)

### Create Vale Viagem
| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/vales/viagem | {clientId: UUID (required), truckPlate: string (required), driverName: string (required), tripType: enum('ENTULHO','TERRA') (required), workLocation: string (required), date: ISO8601 (required), signatureData: string (required, base64 PNG)} | ValeViagem | Yes |

### Create Vale Diária
| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/vales/diaria | {clientId: UUID (required), operatorName: string (required), workLocation: string (required), date: ISO8601 (required), morningStart: string (required, HH:mm), morningEnd: string (required, HH:mm), afternoonStart: string (required, HH:mm), afternoonEnd: string (required, HH:mm), totalHours: number (required), equipment: string (required), signatureData: string (required, base64 PNG)} | ValeDiaria | Yes |

### List / Get / Update / Delete Vales
| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/vales | query: ?type=VIAGEM\|DIARIA&search=string&page=integer&limit=integer | {items: Vale[], total: integer, page: integer, totalPages: integer} | Yes |
| GET | /api/vales/:id | — | Vale (full detail with client info) | Yes |
| PATCH | /api/vales/:id | (any editable fields from viagem or diaria) | Vale | Yes (EMPRESA only) |
| DELETE | /api/vales/:id | — | {success: boolean} | Yes (EMPRESA only) |

Vale shape (union):
```
{
  id: UUID,
  type: 'VIAGEM' | 'DIARIA',
  clientId: UUID,
  client: {id: UUID, name: string, cnpj: string, email: string},
  workLocation: string,
  date: ISO8601,
  signatureUrl: string,
  createdById: UUID,
  createdAt: ISO8601,
  // VIAGEM fields (null if DIARIA):
  truckPlate: string | null,
  driverName: string | null,
  tripType: 'ENTULHO' | 'TERRA' | null,
  // DIARIA fields (null if VIAGEM):
  operatorName: string | null,
  morningStart: string | null,
  morningEnd: string | null,
  afternoonStart: string | null,
  afternoonEnd: string | null,
  totalHours: number | null,
  equipment: string | null
}
```

## PDF Generation

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/vales/pdf | {valeIds: UUID[] (required)} | {pdfUrl: string} | Yes |

Backend generates PDF with empresa logo, colors, data. Returns a signed URL to the generated PDF file.

## Email Sending

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/vales/send-email | {valeIds: UUID[] (required), recipientEmail: string (required)} | {success: boolean} | Yes |

Backend generates PDF and sends as email attachment.

## WhatsApp Share

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/vales/share-link | {valeIds: UUID[] (required)} | {pdfUrl: string, whatsappUrl: string} | Yes |

Returns a public PDF URL and a pre-formatted WhatsApp deep link (`https://wa.me/?text=...`). Frontend opens the whatsappUrl via Linking.

## Dashboard Stats

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/dashboard/stats | — | {totalVales: integer, totalClients: integer, recentVales: Vale[]} | Yes |
