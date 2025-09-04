// Configuração de ambiente para o Render.com ou outros serviços
// Este arquivo será usado para definir as variáveis de ambiente em produção

// Para desenvolvimento local, crie um arquivo firebase-config.js (não commitado)
// Para produção no Render, defina as variáveis de ambiente no painel

if (typeof window !== 'undefined') {
  // Configurações para produção (Render.com)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Em produção, essas variáveis serão injetadas via Render
    window.FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
    window.FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
    window.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
    window.FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
    window.FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID;
    window.FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;
  }
}