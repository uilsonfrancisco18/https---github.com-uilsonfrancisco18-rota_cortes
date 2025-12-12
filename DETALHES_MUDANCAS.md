# 🔍 Detalhes das Mudanças de Código

## Frontend Mudanças

### 1. MyAppointments.tsx (NOVO ARQUIVO)
```typescript
// ✅ CRIADO NOVO COMPONENTE

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Card } from "./card";
import { Calendar, Clock, DollarSign, Trash2, AlertCircle } from "lucide-react";

interface MyAppointmentsProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
}

export function MyAppointments({ open, onClose, userId }: MyAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca agendamentos quando modal abre
  useEffect(() => {
    if (open && userId) {
      fetchAppointments();
    }
  }, [open, userId]);

  // Fetch agendamentos da API protegida
  const fetchAppointments = async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/appointments/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setAppointments(data);
  };

  // Cancela agendamento
  const cancelAppointment = async (appointmentId: string) => {
    const token = localStorage.getItem("authToken");
    await fetch(`${API_URL}/appointments/${appointmentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    // Remove da lista local
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* Modal com lista de agendamentos */}
    </Dialog>
  );
}
```

---

### 2. Header.tsx (MODIFICADO)

#### ANTES:
```typescript
import { Scissors, Menu, X } from "lucide-react";

interface HeaderProps {
  onBookingClick: () => void;
}

export function Header({ onBookingClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header>
      {/* ... */}
      <Button onClick={onBookingClick}>Agendar Agora</Button>
      {/* ... */}
    </header>
  );
}
```

#### DEPOIS:
```typescript
import { Scissors, Menu, X, Calendar } from "lucide-react"; // ✅ Adicionado Calendar

interface HeaderProps {
  onBookingClick: () => void;
  onMyAppointmentsClick: () => void; // ✅ Novo prop
}

export function Header({ onBookingClick, onMyAppointmentsClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Novo state

  useEffect(() => {
    // ✅ Detecta se usuário está logado
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    // ✅ Monitora mudanças de storage
    const handleStorageChange = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };
    window.addEventListener("storage", handleStorageChange);
  }, []);

  return (
    <header>
      {/* ... */}
      <div className="hidden lg:flex items-center gap-4">
        {/* ✅ Botão aparece apenas se logado */}
        {isLoggedIn && (
          <Button
            onClick={onMyAppointmentsClick}
            variant="outline"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Meus Agendamentos
          </Button>
        )}
        <Button onClick={onBookingClick}>Agendar Agora</Button>
      </div>
      {/* ... */}
    </header>
  );
}
```

---

### 3. App.tsx (MODIFICADO)

#### ANTES:
```typescript
import { BookingModal } from "./BookingModal";

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div>
      <Header onBookingClick={() => setIsBookingOpen(true)} />
      <BookingModal 
        open={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
}
```

#### DEPOIS:
```typescript
import { BookingModal } from "./BookingModal";
import { MyAppointments } from "./MyAppointments"; // ✅ Novo import

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false); // ✅ Novo state
  const [userId, setUserId] = useState<string | undefined>(); // ✅ Novo state

  // ✅ Handler para abrir modal de agendamentos
  const handleMyAppointmentsClick = () => {
    const id = localStorage.getItem("userId");
    setUserId(id || undefined);
    setIsMyAppointmentsOpen(true);
  };

  return (
    <div>
      <Header 
        onBookingClick={() => setIsBookingOpen(true)}
        onMyAppointmentsClick={handleMyAppointmentsClick} // ✅ Novo prop
      />
      {/* ... outros componentes ... */}
      <BookingModal 
        open={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
      {/* ✅ Novo componente */}
      <MyAppointments
        open={isMyAppointmentsOpen}
        onClose={() => setIsMyAppointmentsOpen(false)}
        userId={userId}
      />
    </div>
  );
}
```

---

### 4. BookingModal.tsx (MODIFICADO)

#### MUDANÇA NO handleConfirm():
```typescript
// Dentro da função handleConfirm, após sucesso no POST

// ✅ NOVO CÓDIGO
if (created.userId) {
  localStorage.setItem("userId", created.userId);      // Salva ID
  localStorage.setItem("userEmail", email);            // Salva email
  localStorage.setItem("userName", name);              // Salva nome
}

// ✅ NOVO: Alert de sucesso
alert("Agendamento realizado com sucesso! Você pode acompanhar em 'Meus Agendamentos'.");

setBookings((prev) => [...prev, { dateKey, start: `${hh}:${mm}`, duration }]);
onClose();
return;
```

---

## Backend Mudanças

### 1. AppointmentController.js (MODIFICADO)

#### MUDANÇA 1: getUserAppointments()
```javascript
// ✅ ANTES
export const getUserAppointments = async (req, res) => {
    const appointments = await prisma.appointment.findMany({
        where: { userId },
        include: { service: { select: { name: true, duration: true } } },
        // ❌ Faltava price
    });
};

// ✅ DEPOIS
export const getUserAppointments = async (req, res) => {
    const appointments = await prisma.appointment.findMany({
        where: { userId },
        include: { service: { select: { 
            name: true, 
            duration: true, 
            price: true  // ✅ ADICIONADO
        } } },
    });
};
```

#### MUDANÇA 2: createPublicAppointment()
```javascript
// ✅ ANTES
include: { 
  service: { select: { name: true, duration: true } }, 
  user: { select: { name: true, phone: true, email: true } }  // ❌ Sem ID
}

// ✅ DEPOIS
include: { 
  service: { select: { name: true, duration: true } }, 
  user: { select: { 
    id: true,  // ✅ ADICIONADO - Necessário para frontend salvar
    name: true, 
    phone: true, 
    email: true 
  } }
}
```

#### MUDANÇA 3: Novo método cancelAppointment()
```javascript
// ✅ NOVO MÉTODO ADICIONADO

export const cancelAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const userId = req.userId;

    try {
        // Busca agendamento
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Agendamento não encontrado.' });
        }

        // ✅ SEGURANÇA: Valida se pertence ao usuário
        if (appointment.userId !== userId) {
            return res.status(403).json({ error: 'Você não tem permissão.' });
        }

        // Atualiza status para CANCELLED
        const cancelled = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CANCELLED' },
            include: { service: { select: { name: true, duration: true } } },
        });

        return res.status(200).json(cancelled);
    } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        return res.status(500).json({ error: 'Erro interno ao cancelar agendamento.' });
    }
};
```

---

### 2. AppointmentRoutes.js (MODIFICADO)

#### ANTES:
```javascript
import { 
    createAppointment,
    getUserAppointments,
    getAvailableSlots,
    createPublicAppointment,
    getPublicAppointments,
} from '../controllers/AppointmentController.js';

const router = express.Router();

router.post('/', protect, createAppointment); 
router.get('/me', protect, getUserAppointments); 
router.get('/slots', getAvailableSlots); 
router.post('/public', createPublicAppointment);
router.get('/public', getPublicAppointments);

export default router;
```

#### DEPOIS:
```javascript
import { 
    createAppointment,
    getUserAppointments,
    getAvailableSlots,
    createPublicAppointment,
    getPublicAppointments,
    cancelAppointment,  // ✅ NOVO IMPORT
} from '../controllers/AppointmentController.js';

const router = express.Router();

router.post('/', protect, createAppointment); 
router.get('/me', protect, getUserAppointments); 
router.delete('/:appointmentId', protect, cancelAppointment);  // ✅ NOVA ROTA
router.get('/slots', getAvailableSlots); 
router.post('/public', createPublicAppointment);
router.get('/public', getPublicAppointments);

export default router;
```

---

## Resumo das Mudanças

### Frontend
| Arquivo | Tipo | O que mudou |
|---------|------|-----------|
| MyAppointments.tsx | ✅ NOVO | Componente modal para listar agendamentos |
| Header.tsx | ✏️ EDIT | Botão "Meus Agendamentos" + detector de login |
| App.tsx | ✏️ EDIT | Integração do novo componente |
| BookingModal.tsx | ✏️ EDIT | Salva userId após agendamento |

### Backend
| Arquivo | Tipo | O que mudou |
|---------|------|-----------|
| AppointmentController.js | ✏️ EDIT | + price no getUserAppointments + cancelAppointment |
| AppointmentRoutes.js | ✏️ EDIT | + Rota DELETE para cancelamento |

---

## Linhas de Código Adicionadas

```
Frontend:
├── MyAppointments.tsx: ~200 linhas
├── Header.tsx: ~20 linhas
├── App.tsx: ~15 linhas
└── BookingModal.tsx: ~10 linhas
Total Frontend: ~245 linhas

Backend:
├── AppointmentController.js: ~40 linhas (cancelAppointment)
└── AppointmentRoutes.js: ~5 linhas
Total Backend: ~45 linhas

Total de código novo: ~290 linhas
```

---

## Mudanças de API

### Novos Endpoints
```
DELETE /api/appointments/:appointmentId
```

### Endpoints Modificados (Response)
```
POST /api/appointments/public
- Antes: Retornava { id, date, status, service, user }
- Depois: Retorna { id, date, status, service, user (com ID) }

GET /api/appointments/me
- Antes: { ..., service: { name, duration } }
- Depois: { ..., service: { name, duration, price } }
```

---

## LocalStorage Novo

```javascript
{
  "userId": "uuid-string",     // Novo - Salvo após primeiro agendamento
  "userName": "João Silva",    // Novo - Salvo após primeiro agendamento
  "userEmail": "joao@email",   // Novo - Salvo após primeiro agendamento
  "authToken": "jwt-token"     // Existente - Não alterado
}
```

---

**✅ Todas as mudanças estão prontas e testadas!**
