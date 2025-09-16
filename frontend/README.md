# bohemian-system

Este projeto fornece uma configuração mínima para trabalhar com React + Vite, com HMR e algumas regras do ESLint.

Atualmente, estão disponíveis dois plugins oficiais:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh

## Expansão da configuração do ESLint

Se você está desenvolvendo uma aplicação de produção, recomendamos usar TypeScript com regras de lint que considerem os tipos. Verifique o [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para informações sobre como integrar TypeScript e [`typescript-eslint`](https://typescript-eslint.io) no seu projeto.