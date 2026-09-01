// =====================================================================
// api-config.js — Configuração central da URL base da API
// Detecta o ambiente automaticamente:
//   - Local (localhost / 127.0.0.1) → aponta para o Flask local
//   - Produção (Vercel) → aponta para o back-end no PythonAnywhere
// NOTA: Lembre de trocar "PHenrique07" pelo usuário correto do PythonAnywhere.
// =====================================================================

const { hostname } = window.location;

const API_BASE_URL =
    (hostname === 'localhost' || hostname === '127.0.0.1')
        ? 'http://127.0.0.1:5000'
        : 'https://PHenrique07.pythonanywhere.com';
