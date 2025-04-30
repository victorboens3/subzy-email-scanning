# Email Sync Backend

Este repositório contém apenas as **Netlify Functions** e configuração para deploy.

## Estrutura

- **functions/**  
  - auth-google.js  
  - auth-google-callback.js  
  - auth-microsoft.js  
  - auth-microsoft-callback.js  
  - emails.js  

- **netlify.toml** – configuração do Netlify  
- **package.json** – definições de script  
- **.env.example** – exemplo de variáveis de ambiente  

## Deploy Manual

1. **Deploy manual** no Netlify com este ZIP (via “Deploy manually”).
2. Configure as variáveis de ambiente conforme `.env.example`.
3. Aponte seu front (Framer) para os endpoints em `/.netlify/functions/...`.
