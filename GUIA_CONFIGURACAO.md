# 🚀 Guia de Configuração - Meus Agendamentos

## Pré-requisitos

- ✅ Node.js instalado
- ✅ Backend rodando (porta 3000 ou configurada)
- ✅ Banco de dados Prisma sincronizado
- ✅ Variáveis de ambiente configuradas

---

## 1️⃣ Verificar Banco de Dados

### Schema Prisma
Certifique-se que `schema.prisma` tem estes modelos:

```prisma
model User {
  id           String @id @default(uuid())
  email        String @unique
  password     String
  name         String
  role         String @default("CLIENT")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  appointments Appointment[]
}

model Service {
  id           String @id @default(uuid())
  name         String @unique
  price        Float
  duration     Int
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  appointments Appointment[]
}

model Appointment {
  id           String @id @default(uuid())
  date         DateTime
  status       String @default("SCHEDULED")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  
  serviceId    String
  service      Service  @relation(fields: [serviceId], references: [id])
}
```

### Aplicar Migrações
```bash
cd backend
npx prisma migrate dev --name meus_agendamentos
```

---

## 2️⃣ Backend - Variáveis de Ambiente

### `.env` do Backend
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3000
API_URL="http://localhost:3000/api"
```

---

## 3️⃣ Frontend - Variáveis de Ambiente

### `.env.local` do Frontend
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 4️⃣ Verificar Rotas Backend

### Rotas Necessárias (AppointmentRoutes)
```javascript
POST   /api/appointments/public          ✅ Criar agendamento (público)
GET    /api/appointments/public          ✅ Listar agendamentos públicos
GET    /api/appointments/slots           ✅ Horários disponíveis
POST   /api/appointments                 ✅ Criar agendamento (autenticado)
GET    /api/appointments/me              ✅ Meus agendamentos (autenticado)
DELETE /api/appointments/:appointmentId  ✅ Cancelar agendamento (autenticado)
```

---

## 5️⃣ Verificar Middleware de Autenticação

### AuthMiddleware.js
```javascript
export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
};
```

**Certifique-se que está sendo exportado corretamente!**

---

## 6️⃣ Testar Endpoints com Postman/Insomnia

### 1. Criar Agendamento (Público)
```
POST http://localhost:3000/api/appointments/public
Content-Type: application/json

{
  "date": "2025-12-15T10:00:00",
  "serviceId": "seu-service-id-aqui",
  "name": "João Silva",
  "phone": "11987654321",
  "email": "joao@example.com"
}

Response:
{
  "id": "apt-123",
  "userId": "user-123",
  "date": "2025-12-15T10:00:00",
  "status": "CONFIRMED",
  "user": { "id": "user-123", "name": "João Silva" },
  ...
}
```

### 2. Listar Agendamentos do Usuário (Protegido)
```
GET http://localhost:3000/api/appointments/me
Authorization: Bearer seu-jwt-token-aqui
Content-Type: application/json

Response:
[
  {
    "id": "apt-123",
    "date": "2025-12-15T10:00:00",
    "status": "CONFIRMED",
    "service": {
      "name": "Corte & Barba",
      "price": 32,
      "duration": 45
    }
  },
  ...
]
```

### 3. Cancelar Agendamento
```
DELETE http://localhost:3000/api/appointments/apt-123
Authorization: Bearer seu-jwt-token-aqui
Content-Type: application/json

Response:
{
  "id": "apt-123",
  "status": "CANCELLED",
  ...
}
```

---

## 7️⃣ Iniciar Aplicação

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 8️⃣ Verificar Console

### Browser Console (F12)
```javascript
// Verificar localStorage
localStorage.getItem("userId")      // Deve retornar ID após agendar
localStorage.getItem("userName")    // Deve retornar nome
localStorage.getItem("authToken")   // Pode estar vazio (público)

// Verificar se MyAppointments está importado
window.MyAppointments              // Deve estar disponível
```

### Network Tab (F12)
```
✅ GET  /api/appointments/me        → 200 OK
✅ POST /api/appointments/public    → 201 Created
✅ DELETE /api/appointments/:id     → 200 OK
```

---

## 9️⃣ Troubleshooting

### ❌ Botão "Meus Agendamentos" não aparece
**Solução:**
1. Verifique se `userId` está em localStorage
   ```javascript
   console.log(localStorage.getItem("userId"))
   ```
2. Verifique se `Header.tsx` está importado corretamente em `App.tsx`
3. Recarregue a página (F5)

### ❌ Modal não abre
**Solução:**
1. Verifique console para erros de importação
2. Certifique-se que `MyAppointments.tsx` existe em `frontend/src/`
3. Verifique se `Dialog` está funcionando em outros componentes

### ❌ Agendamentos não carregam
**Solução:**
1. Verifique se token JWT está sendo enviado
2. Verifique middleware `protect` no backend
3. Verifique logs do backend para erros
4. Teste endpoint `/api/appointments/me` com Postman

### ❌ Cancelamento não funciona
**Solução:**
1. Verifique se DELETE foi adicionado em AppointmentRoutes
2. Teste endpoint com Postman
3. Certifique-se que `cancelAppointment` foi exportado
4. Verifique se userId bate com o do agendamento

### ❌ CORS Error
**Solução:**
1. Verifique CORS configurado no backend
2. Certifique-se que `http://localhost:3000/api` é acessível
3. Adicione headers necessários

```javascript
// No backend (server.js)
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));
```

### ❌ Dados não salvam no localStorage
**Solução:**
1. Verifique se `localStorage.setItem()` é chamado após sucesso
2. Verifique se localStorage está habilitado no navegador
3. Teste em modo incógnito se plugins estão bloqueando

---

## 🔟 Verificação Final

### Antes de fazer Deploy
- [ ] Backend rodando sem erros
- [ ] Prisma sincronizado com DB
- [ ] Todos os endpoints testados
- [ ] LocalStorage funcionando
- [ ] Botão "Meus Agendamentos" aparece após agendar
- [ ] Modal abre e lista agendamentos
- [ ] Cancelamento funciona
- [ ] Dados persistem após reload
- [ ] Design responsivo em mobile
- [ ] Sem erros no console

---

## 📞 Dúvidas Frequentes

**P: Preciso de login antes de agendar?**
R: Não! Sistema de agendamento é público. Login aparece DEPOIS que você agenda.

**P: Os dados desaparecem ao desligar o computador?**
R: Não! Estão salvos no banco de dados. LocalStorage é apenas para velocidade.

**P: Posso ter múltiplos agendamentos?**
R: Sim! O sistema permite criar vários com o mesmo email/telefone.

**P: Como um admin vê todos os agendamentos?**
R: Futura implementação. Por enquanto, apenas usuários veem seus próprios.

**P: O cancelamento é definitivo?**
R: Sim! Status muda para CANCELLED no banco de dados.

---

**✅ Pronto para começar!**
