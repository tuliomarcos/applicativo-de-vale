# Database Schema — Vales de Terraplanagem

PostgreSQL with Prisma ORM. All IDs are UUIDs, auto-generated. All tables have createdAt/updatedAt.

## Entities

### User
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| name | String | Required |
| email | String | Unique, required |
| phone | String | Required |
| password | String | bcrypt hashed, required |
| role | Enum(PRESTADOR, CLIENTE, EMPRESA) | Required |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Indexes: email (unique)

### Empresa
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User.id, unique, onDelete CASCADE |
| name | String | Required |
| cnpj | String | Required |
| address | String | Required |
| phone | String | Required |
| primaryColor | String | Required, hex color |
| secondaryColor | String | Required, hex color |
| logoFileId | UUID | FK → File.id, nullable |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Indexes: userId (unique)
Relations: User (1:1), File (optional 1:1 for logo)

### Client
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| createdById | UUID | FK → User.id, onDelete CASCADE |
| name | String | Required |
| cnpj | String | Required |
| address | String | Required |
| phone | String | Required |
| email | String | Required |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Indexes: createdById
Relations: User (many:1)

### Prestador
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| createdById | UUID | FK → User.id, onDelete CASCADE |
| name | String | Required |
| document | String | Required (CPF or CNPJ) |
| documentType | Enum(CPF, CNPJ) | Required |
| address | String | Required |
| phone | String | Required |
| email | String | Required |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Indexes: createdById
Relations: User (many:1)

### Vale
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| type | Enum(VIAGEM, DIARIA) | Required |
| createdById | UUID | FK → User.id, onDelete CASCADE |
| clientId | UUID | FK → Client.id, onDelete RESTRICT |
| workLocation | String | Required |
| date | DateTime | Required |
| signaturePath | String | Required (cloud storage path to signature PNG) |
| truckPlate | String | Nullable (VIAGEM only) |
| driverName | String | Nullable (VIAGEM only) |
| tripType | Enum(ENTULHO, TERRA) | Nullable (VIAGEM only) |
| operatorName | String | Nullable (DIARIA only) |
| morningStart | String | Nullable (DIARIA only, HH:mm) |
| morningEnd | String | Nullable (DIARIA only, HH:mm) |
| afternoonStart | String | Nullable (DIARIA only, HH:mm) |
| afternoonEnd | String | Nullable (DIARIA only, HH:mm) |
| totalHours | Float | Nullable (DIARIA only) |
| equipment | String | Nullable (DIARIA only) |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Indexes: createdById, clientId, type, date
Relations: User (many:1), Client (many:1)

### File
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User.id, onDelete CASCADE |
| fileName | String | Required |
| cloud_storage_path | String | Required |
| isPublic | Boolean | Default false |
| contentType | String | Required (MIME type) |
| createdAt | DateTime | Auto |

Indexes: userId
Relations: User (many:1)

## Enum Definitions

```prisma
enum UserRole {
  PRESTADOR
  CLIENTE
  EMPRESA
}

enum ValeType {
  VIAGEM
  DIARIA
}

enum TripType {
  ENTULHO
  TERRA
}

enum DocumentType {
  CPF
  CNPJ
}
```

## Key Relationships
- User 1:1 Empresa (only EMPRESA role users)
- User 1:N Client (user creates clients)
- User 1:N Prestador (user creates prestadores)
- User 1:N Vale (user creates vales)
- Client 1:N Vale (client referenced in vales)
- User 1:N File (user uploads files)
- Empresa 1:0..1 File (optional logo)
