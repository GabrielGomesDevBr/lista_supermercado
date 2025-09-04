# 🛒 Lista de Compras Colaborativa

Uma aplicação PWA moderna e responsiva para gerenciar listas de compras em família, com sincronização em tempo real via Firebase.

## ✨ Funcionalidades

- 📱 **PWA** - Instalável no celular via navegador
- 🌙 **Modo escuro/claro** com preferência salva
- 🔍 **Busca e filtros** em tempo real
- 🏷️ **10 categorias** com 150+ itens pré-definidos
- ✅ **Sincronização em tempo real** entre dispositivos
- 📊 **Contador inteligente** de itens pendentes
- 🎯 **Interface intuitiva** com micro-interações
- ♿ **Acessível** com suporte completo ao teclado

## 🚀 Como usar

### Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/GabrielGomesDevBr/lista_supermercado.git
cd lista_supermercado
```

2. **IMPORTANTE**: Crie o arquivo `firebase-config.js` na raiz (este arquivo não será commitado):
```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

3. Inicie um servidor local:
```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .
npx http-server

# Live Server (VS Code)
# Instale a extensão e clique direito no index.html
```

4. Acesse: `http://localhost:8000`

### Deploy no Render.com

1. Conecte este repositório ao Render
2. **Configure as variáveis de ambiente no painel do Render**:
   - `FIREBASE_API_KEY` = sua api key
   - `FIREBASE_AUTH_DOMAIN` = seu-projeto.firebaseapp.com
   - `FIREBASE_PROJECT_ID` = seu-projeto-id
   - `FIREBASE_STORAGE_BUCKET` = seu-projeto.appspot.com
   - `FIREBASE_MESSAGING_SENDER_ID` = 123456789
   - `FIREBASE_APP_ID` = 1:123456789:web:abcdef

3. O deploy será automático!

## 🔥 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative o **Firestore Database**
3. Configure as regras de segurança (aba "Regras"):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /listas/{listaId}/{documents=**} {
      allow read, write: if true; // Para uso familiar sem autenticação
    }
  }
}
```

4. Na seção "Project Settings" > "Your apps", adicione um web app
5. Copie as credenciais e use conforme instruído acima

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase Firestore (tempo real)
- **PWA**: Service Worker, Web App Manifest
- **Deploy**: Render.com (ou qualquer hosting estático)

## 📱 PWA Features

- ✅ Instalável no dispositivo
- ✅ Funciona offline (cache básico)
- ✅ Ícones e splash screens
- ✅ Tema customizável

## 🎨 Categorias de Itens

- 🌾 **Mantimentos** (20 itens): Arroz, Feijão, Óleo, Açúcar, etc.
- 🧽 **Limpeza** (15 itens): Detergente, Sabão, Amaciante, etc.
- 🧴 **Higiene** (15 itens): Shampoo, Sabonete, Creme dental, etc.
- 🥩 **Carnes** (15 itens): Frango, Carne bovina, Peixe, etc.
- 🍎 **Frutas** (20 itens): Banana, Maçã, Laranja, etc.
- 🥬 **Verduras** (20 itens): Alface, Tomate, Cebola, etc.
- 🧀 **Laticínios** (15 itens): Queijo, Iogurte, Leite, etc.
- 🥤 **Bebidas** (15 itens): Água, Refrigerante, Suco, etc.
- 🧊 **Congelados** (15 itens): Pizza, Sorvete, Açaí, etc.
- 🍿 **Petiscos** (15 itens): Biscoito, Chocolate, Chips, etc.

## 💡 Como Usar

1. **Compartilhar lista**: Clique em "Compartilhar" e envie o link
2. **Modo escuro**: Toggle no header (🌙/☀️)
3. **Buscar**: Clique na lupa para filtrar itens
4. **Adicionar rápido**: Selecione uma categoria e clique nos itens
5. **Marcar como comprado**: Clique no círculo ao lado do item
6. **Limpar comprados**: Botão no header remove todos os itens marcados

## 🔒 Segurança

- ❌ Credenciais do Firebase **nunca** são commitadas
- ✅ Configuração via variáveis de ambiente em produção
- ✅ Arquivo `.gitignore` protege dados sensíveis
- ✅ Uso familiar seguro sem necessidade de login

## 📄 Licença

MIT License - sinta-se livre para usar e modificar!

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças importantes, abra uma issue primeiro.

---

Feito com ❤️ para facilitar as compras em família!
