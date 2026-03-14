# UX Specification — Gerenciamento de Vales de Terraplanagem

## Design Direction

- **Theme**: Dark mode with deep grays (#0D0D0D background, #1A1A1A cards, #242424 inputs)
- **Primary Color**: Ember Orange #F97316
- **Accent Color**: Warm Amber #F59E0B
- **Gradient Buttons**: linear-gradient(135deg, #F97316, #F59E0B)
- **Typography**: Display/Heading: "Poppins" (Google Fonts), Body: "Source Sans 3" (Google Fonts)
- **Type Scale**: Display 32px → Heading 22px → Body 16px → Caption 13px
- **Backgrounds**: Layered gradient from #0D0D0D to #141418 with subtle radial accent glow
- **Text Colors**: Headings #F5F5F5, Body #CCCCCC, Muted #888888
- **Cards**: rounded 16px, glass effect with rgba(255,255,255,0.05) background, 1px border rgba(255,255,255,0.08)
- **Spacing**: 8pt grid throughout

## Screens

### 1. Welcome Screen (`app/index.tsx`)
- **Purpose**: Entry point for unauthenticated users
- **Layout**: Centered logo/app name at top 40%, two full-width gradient buttons below
- **Elements**:
  - App logo (construction/earthmoving icon) + app name "TerraVale"
  - Tagline caption text
  - Button: "Entrar" → navigates to Login
  - Button: "Criar Conta" → navigates to Signup
- **Animations**: Fade-in logo, staggered button entry

### 2. Login Screen (`app/auth/login.tsx`)
- **Purpose**: Email/password authentication
- **Elements**:
  - Heading "Entrar"
  - Input: Email (floating label, keyboard type email)
  - Input: Senha (floating label, secure entry, eye toggle)
  - Gradient button "Entrar" (full width)
  - Text link "Criar conta" → Signup
- **Validation**: Email format, password min 6 chars. Error shake on invalid.
- **Loading**: Button shows spinner on submit

### 3. Signup Screen (`app/auth/signup.tsx`)
- **Purpose**: Create new account with profile type selection
- **Elements**:
  - Heading "Criar Conta"
  - Input: Nome (required)
  - Input: Telefone (required, phone keyboard)
  - Input: Email (required)
  - Input: Senha (required, min 6 chars)
  - Input: Confirmar Senha
  - **Profile Type Selector**: 3 selectable cards in a row:
    - "Prestador de Serviço" (icon: wrench)
    - "Cliente" (icon: person)
    - "Empresa de Terraplanagem" (icon: building)
  - Selected card gets accent border + glow
  - Gradient button "Criar Conta"
- **Validation**: All fields required, passwords match, email format

### 4. Home / Dashboard (`app/(tabs)/index.tsx`)
- **Purpose**: Main hub after login, role-aware
- **Layout**: Greeting header with user name, grid of action cards
- **Elements**:
  - "Olá, {name}" heading + profile type badge
  - Quick stats row: total vales, clientes count
  - Action cards grid (2 columns):
    - "Criar Vale Viagem" (visible to: EMPRESA, PRESTADOR)
    - "Criar Vale Diária" (visible to: EMPRESA, PRESTADOR)
    - "Lista de Vales" (all roles)
    - "Clientes" (EMPRESA, PRESTADOR)
    - "Prestadores" (EMPRESA)
    - "Minha Empresa" (EMPRESA only)
  - Each card: icon + label, glass card style, press animation

### 5. Criar Vale Viagem (`app/vales/criar-viagem.tsx`)
- **Purpose**: Form to create a trip voucher
- **Layout**: Scrollable form
- **Elements**:
  - Heading "Novo Vale Viagem"
  - Dropdown: Selecionar Cliente (searchable, fetches client list)
  - Input: Caminhão Placa (text, uppercase auto)
  - Input: Nome do Motorista
  - **Tipo de Viagem**: Two toggle buttons side by side — "Entulho" | "Terra" (selected gets gradient fill)
  - Input: Local da Obra
  - Date Picker: Data (defaults to today)
  - **Assinatura Digital**: Embedded signature pad (react-native-signature-canvas area), clear button, bordered area 200px height
  - Gradient button "Salvar Vale"
- **Validation**: All fields required, signature required

### 6. Criar Vale Diária (`app/vales/criar-diaria.tsx`)
- **Purpose**: Form to create a daily voucher
- **Elements**:
  - Heading "Novo Vale Diária"
  - Dropdown: Selecionar Cliente
  - Input: Nome do Operador
  - Input: Local da Obra
  - Date Picker: Data
  - **Hora Section**:
    - Morning: Start time picker (default 7:00) → End time picker (default 12:00)
    - Afternoon: Start time picker (default 13:00) → End time picker (default 17:00)
    - Auto-calculated "Total de Horas" displayed as a highlighted badge (e.g., "9h")
  - Input: Equipamento
  - **Assinatura Digital**: Same signature pad component
  - Gradient button "Salvar Vale"
- **Auto-calc logic**: totalHours = (morningEnd - morningStart) + (afternoonEnd - afternoonStart), displayed live

### 7. Cadastrar Empresa (`app/empresa/cadastrar.tsx`)
- **Purpose**: Register earthmoving company details (EMPRESA role only)
- **Elements**:
  - Heading "Cadastrar Empresa"
  - Input: Nome da Empresa
  - Input: CNPJ (masked ##.###.###/####-##)
  - Input: Endereço
  - Input: Telefone
  - **Color Picker Section**: "Cores da Empresa"
    - Two color picker rows: "Cor Primária" and "Cor Secundária"
    - Each shows a palette of 12 preset colors as tappable circles + custom hex input
  - **Logo Upload**: Tappable area with camera/gallery icon, shows preview after selection. Uses expo-image-picker.
  - Gradient button "Salvar Empresa"

### 8. Cadastrar Cliente (`app/clientes/cadastrar.tsx`)
- **Purpose**: Register a new client
- **Elements**:
  - Heading "Novo Cliente"
  - Input: Nome
  - Input: CNPJ (masked)
  - Input: Endereço
  - Input: Telefone
  - Input: Email
  - Gradient button "Salvar"

### 9. Cadastrar Prestador (`app/prestadores/cadastrar.tsx`)
- **Purpose**: Register a service provider
- **Elements**:
  - Heading "Novo Prestador"
  - Input: Nome
  - Input: CNPJ/CPF (masked, toggle between CNPJ/CPF)
  - Input: Endereço
  - Input: Telefone
  - Input: Email
  - Gradient button "Salvar"

### 10. Lista de Vales (`app/(tabs)/vales.tsx`)
- **Purpose**: View all vouchers with actions
- **Layout**: Filter chips at top + FlashList
- **Elements**:
  - Search bar (by client name, plate, location)
  - Filter chips: "Todos", "Viagem", "Diária"
  - Each vale card shows:
    - Type badge (Viagem/Diária)
    - Client name, date, location
    - Status indicator
  - **Card press** → bottom sheet with actions:
    - "Visualizar" → opens Vale Detail screen
    - "Editar" (EMPRESA role only) → opens edit form
    - "Apagar" (EMPRESA role only) → confirmation dialog then delete
    - "Gerar PDF" → generates and previews PDF
    - "Enviar por Email" → email input modal, sends PDF
    - "Enviar por WhatsApp" → opens WhatsApp share with PDF
  - FAB button "+" → bottom sheet to choose Viagem or Diária
- **Empty state**: Illustration + "Nenhum vale encontrado" message
- **Loading**: Skeleton shimmer cards

### 11. Visualizar Vale (`app/vales/[id].tsx`)
- **Purpose**: Read-only view of a voucher
- **Layout**: Scrollable detail card
- **Elements**:
  - Type heading (Vale Viagem / Vale Diária)
  - All fields displayed as label:value pairs in a card
  - Signature image displayed
  - Action buttons at bottom: "Gerar PDF", "Compartilhar"

### 12. Lista de Clientes (`app/(tabs)/clientes.tsx`)
- **Purpose**: View all registered clients
- **Elements**:
  - Search bar
  - FlashList of client cards (name, CNPJ, phone)
  - Card press → detail view or edit
  - FAB "+" → Cadastrar Cliente
- **Loading**: Skeleton shimmer

### 13. Lista de Prestadores (`app/prestadores/index.tsx`)
- **Purpose**: View all service providers (EMPRESA role)
- **Elements**:
  - Search bar
  - FlashList of prestador cards
  - FAB "+" → Cadastrar Prestador

## Navigation

### Unauthenticated Flow
- `app/index.tsx` (Welcome) → `app/auth/login.tsx` | `app/auth/signup.tsx`
- Auth guard: redirect to Welcome if no token

### Authenticated Flow (Tab Navigation)
- **Bottom Tabs** (4 tabs with icons):
  1. **Início** → Dashboard (`app/(tabs)/index.tsx`)
  2. **Vales** → Lista de Vales (`app/(tabs)/vales.tsx`)
  3. **Clientes** → Lista de Clientes (`app/(tabs)/clientes.tsx`)
  4. **Perfil** → Profile/Settings (`app/(tabs)/perfil.tsx`)

- **Stack screens** (pushed from tabs):
  - `app/vales/criar-viagem.tsx`
  - `app/vales/criar-diaria.tsx`
  - `app/vales/[id].tsx` (view/edit)
  - `app/clientes/cadastrar.tsx`
  - `app/clientes/[id].tsx`
  - `app/prestadores/index.tsx`
  - `app/prestadores/cadastrar.tsx`
  - `app/empresa/cadastrar.tsx`

### Role-Based Visibility
- **EMPRESA**: All features
- **PRESTADOR**: Create vales, manage clients, view vales, no delete/edit vales, no manage prestadores
- **CLIENTE**: View own vales only, no create/edit/delete

### Profile Screen (`app/(tabs)/perfil.tsx`)
- User info display
- "Minha Empresa" link (EMPRESA only)
- "Sair" logout button

## Animation & Motion
- Screen transitions: slide-from-right for stack pushes, fade for tab switches
- Button press: scale(0.97) spring + haptic on mobile
- List items: staggered fade-in on load
- Bottom sheets: multi-snap with backdrop blur
- Signature pad: smooth drawing with no lag
- Loading: skeleton shimmer on all lists
- Respect reduced motion preferences

## Component Standards
- All buttons: gradient fill [#F97316, #F59E0B], press animation, loading/disabled states
- Inputs: floating labels, focus glow animation, error shake
- Cards: rounded 16px, glass effect, press scale animation
- Images (logos): expo-image with blurhash placeholder
- Lists: @shopify/flash-list
- Touch targets: minimum 44pt
- Accessibility: all inputs labeled, contrast ≥ 4.5:1
