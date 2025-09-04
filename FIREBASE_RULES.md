# 🔥 URGENTE: Atualizar Regras do Firebase

## ⚠️ O app não funciona porque as regras de segurança do Firebase precisam ser atualizadas!

### 🛠️ **Como corrigir (PASSO A PASSO):**

1. **Acesse o [Firebase Console](https://console.firebase.google.com)**

2. **Selecione seu projeto**: `lista-de-compras-pwa-9d312`

3. **Menu lateral** → **Firestore Database**

4. **Aba "Regras"** (Rules)

5. **SUBSTITUA todas as regras atuais** por estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lista familiar global - todos podem ler e escrever
    match /lista-familia/{itemId} {
      allow read, write: if true;
    }
  }
}
```

6. **Clique em "Publicar"** (Publish)

### ❗ **IMPORTANTE:**

- As regras antigas eram para `/listas/{listaId}/itens/{itemId}`
- As novas regras são para `/lista-familia/{itemId}` (mais simples)
- Isso permite que todos acessem a mesma lista global da família

### ✅ **Após atualizar as regras:**

O app funcionará perfeitamente:
- ✅ Adicionar itens
- ✅ Remover itens  
- ✅ Marcar como comprados
- ✅ Sincronização em tempo real

### 🔍 **Para testar se funcionou:**

1. Atualize a página do app
2. Tente adicionar um item
3. Não deve dar mais erro de permissões

---

**Qualquer dúvida, me chame!** 🚀