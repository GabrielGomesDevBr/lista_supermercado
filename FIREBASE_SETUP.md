# 🔧 Configuração das Permissões do Firebase

O erro "Missing or insufficient permissions" indica que o Firestore está com regras de segurança muito restritivas.

## ⚡ Solução Rápida (Para Desenvolvimento/Teste)

1. **Acesse o Console do Firebase:**
   - Vá para: https://console.firebase.google.com/
   - Selecione seu projeto: `lista-de-compras-pwa-9d312`

2. **Configure as Regras do Firestore:**
   - No menu lateral, clique em **"Firestore Database"**
   - Clique na aba **"Regras"** (Rules)
   - Substitua as regras existentes por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso público à coleção lista-familia
    match /lista-familia/{document} {
      allow read, write: if true;
    }
  }
}
```

3. **Publique as Regras:**
   - Clique em **"Publicar"** (Publish)

## 🔐 Solução Mais Segura (Para Produção)

Se você quiser mais segurança, use estas regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /lista-familia/{document} {
      // Permitir leitura para todos
      allow read: if true;
      
      // Permitir escrita apenas para itens válidos
      allow write: if resource.data.keys().hasAll(['nome', 'quantidade', 'comprado']) &&
                      resource.data.nome is string &&
                      resource.data.quantidade is number &&
                      resource.data.comprado is bool;
    }
  }
}
```

## 🚀 Teste Após Configuração

1. Recarregue a aplicação completamente
2. Teste adicionar um item
3. Verifique se não há mais erros de permissão no console

## 🔐 Configuração Local Segura

Para desenvolvimento local SEM vazar chaves no GitHub:

1. **Crie uma cópia local do env-config.js:**
```bash
cp env-config.js env-config.local.js
```

2. **Edite env-config.local.js com suas chaves reais:**
```javascript
window.FIREBASE_API_KEY = "AIzaSyCGEhMkaeE_s-m3sVEn3Pj-pzbBFP01Sw4";
window.FIREBASE_AUTH_DOMAIN = "lista-de-compras-pwa-9d312.firebaseapp.com";
window.FIREBASE_PROJECT_ID = "lista-de-compras-pwa-9d312";
window.FIREBASE_STORAGE_BUCKET = "lista-de-compras-pwa-9d312.firebasestorage.app";
window.FIREBASE_MESSAGING_SENDER_ID = "654454254654";
window.FIREBASE_APP_ID = "1:654454254654:web:db0cf0f11bfa1f72e4356f";
```

3. **Atualize o index.html temporariamente:**
Substitua `env-config.js` por `env-config.local.js` no script tag

4. **NUNCA commite o arquivo .local.js** - ele está no .gitignore

## ⚠️ IMPORTANTE - Segurança

- ✅ `env-config.js` (vazio) - pode ser commitado
- ❌ `env-config.local.js` (com chaves) - NUNCA commitar
- ❌ `firebase-config.js` - NUNCA commitar

## 📝 Notas

- A solução rápida permite acesso total à coleção `lista-familia`
- Para uma app familiar simples, isso é aceitável
- Se quiser mais segurança, considere implementar autenticação Firebase