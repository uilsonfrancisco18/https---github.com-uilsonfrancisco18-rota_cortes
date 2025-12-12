# 🚀 QUICK START - Meus Agendamentos

## ⚡ 5 Minutos para Começar

### 1️⃣ Verifique os Arquivos Criados (30 segundos)

```bash
# Frontend - Novo componente
ls -la frontend/src/MyAppointments.tsx

# Deve retornar algo como:
# -rw-r--r--  1 user  group  8234 Dec 11 10:30 MyAppointments.tsx
```

### 2️⃣ Inicie o Backend (2 minutos)

```bash
cd backend
npm install    # Se não tiver dependências instaladas
npm start      # Deve abrir em http://localhost:3000

# Log esperado:
# Servidor rodando na porta 3000
# Banco de dados sincronizado
```

### 3️⃣ Inicie o Frontend (2 minutos)

```bash
cd frontend
npm install    # Se não tiver dependências instaladas
npm run dev    # Deve abrir em http://localhost:5173

# Log esperado:
# ➜  frontend  VITE v4.x.x ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

---

## ✅ Testes Rápidos

### Teste 1: Agendar (1 minuto)
1. Abra http://localhost:5173
2. Clique em **"Agendar Agora"**
3. Preencha formulário:
   - Nome: "Teste Silva"
   - Email: "teste@email.com"
   - Telefone: "11987654321"
   - Serviço: Qualquer um
   - Data/Hora: Qualquer disponível
4. Clique **"Confirmar"**
5. ✅ Deve ver: "Agendamento realizado com sucesso!"

### Teste 2: Ver Botão (30 segundos)
1. Após agendar, feche modal
2. Olhe para o **Header**
3. ✅ Deve ver novo botão: **"📅 Meus Agendamentos"**

### Teste 3: Abrir Modal (30 segundos)
1. Clique em **"Meus Agendamentos"**
2. ✅ Modal abre com lista
3. ✅ Mostra: Data, Hora, Serviço, Preço

### Teste 4: Persistência (1 minuto)
1. Com modal aberto, aperte **F5** (reload)
2. ✅ Botão continua lá
3. ✅ Dados continuam salvos

---

## 🔍 Verificação de Logs

### Frontend Console (F12)
```javascript
// Deverá ver algo como:
// Agendamento confirmado
// userId salvo

// Verificar localStorage
localStorage.getItem("userId")   // ✅ Deve retornar um UUID
localStorage.getItem("userName") // ✅ Deve retornar o nome
```

### Backend Console
```bash
# Deverá ver requisições como:
POST /api/appointments/public          201 Created
GET  /api/appointments/me              200 OK
DELETE /api/appointments/:id           200 OK
```

---

## 🐛 Problemas Comuns

### ❌ Botão não aparece
```
Causa: localStorage não salvou
Solução: 
1. Abra DevTools (F12)
2. Verifique: localStorage.getItem("userId")
3. Se vazio, faça novo agendamento
```

### ❌ Erro ao cancelar
```
Causa: Token não enviado
Solução:
1. Verifique backend logs
2. Certifique-se que middleware protect está ativo
3. Teste com Postman se necessário
```

### ❌ Agendamentos não carregam
```
Causa: API não respondendo
Solução:
1. Verifique se backend está rodando
2. Teste: curl http://localhost:3000/api
3. Verifique CORS configurado
```

---

## 📋 Arquivos Principais

| Arquivo | O Que Faz |
|---------|-----------|
| `frontend/src/MyAppointments.tsx` | 💫 Modal de agendamentos |
| `frontend/src/Header.tsx` | 🎯 Botão "Meus Agendamentos" |
| `frontend/src/App.tsx` | 🔗 Integração |
| `backend/.../AppointmentController.js` | 🚀 Lógica backend |
| `backend/.../AppointmentRoutes.js` | 🛣️ Rotas API |

---

## 🔄 Fluxo de Teste Completo

```
1. AGENDAR
   └─ Preencha form → Confirme → Ver mensagem sucesso

2. VERIFICAR
   └─ Botão aparece no header → localStorage tem dados

3. ABRIR MODAL
   └─ Click "Meus Agendamentos" → Modal abre → Lista mostra

4. TESTAR PERSISTÊNCIA
   └─ Reload página (F5) → Dados continuam → Modal ainda funciona

5. CANCELAR (OPCIONAL)
   └─ Clique trash → Confirme → Agendamento sai da lista

6. FINAL
   └─ Reload novamente → Status permanece "Cancelado"
```

---

## 💡 Dicas Úteis

### Para Debug
```javascript
// Abra console (F12) e execute:
localStorage.getItem("userId")      // Ver ID
localStorage.getItem("authToken")   // Ver token
JSON.stringify(localStorage)         // Ver tudo
```

### Para Testar API Diretamente
```bash
# Terminal 1 - Teste agendamento público
curl -X POST http://localhost:3000/api/appointments/public \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-15T10:00:00",
    "serviceId": "seu-id-aqui",
    "name": "João",
    "phone": "11987654321",
    "email": "joao@email.com"
  }'

# Terminal 2 - Teste listar agendamentos
curl -X GET http://localhost:3000/api/appointments/me \
  -H "Authorization: Bearer seu-token-aqui"
```

---

## 📞 Contatos Rápidos

Se algo não funcionar:

1. **Verifique logs** - F12 no navegador ou terminal
2. **Leia documentação** - IMPLEMENTACAO_MEUS_AGENDAMENTOS.md
3. **Teste endpoint** - Use Postman ou curl
4. **Reinicie** - Às vezes recarregar resolve
5. **Limpe cache** - Ctrl+Shift+Del (browser)

---

## ✨ Próximos Passos

Após confirmar que está funcionando:

- [ ] Fazer deploy em produção
- [ ] Coletar feedback de usuários
- [ ] Adicionar notificações por email
- [ ] Integrar SMS de lembrete
- [ ] Implementar dashboard admin

---

## 🎉 Pronto!

Se todos os testes passarem:

✅ Sistema está funcionando  
✅ Dados sendo salvos  
✅ API respondendo  
✅ Frontend integrado  

**Você está pronto para produção!** 🚀

---

*Última atualização: 11 de dezembro de 2025*
