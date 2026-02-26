# Hora Já - Dashboard e Conversor de Moedas

O **Hora Já** é uma aplicação web de alta performance focada na exibição de dados financeiros e fuso horário. Desenvolvido com uma arquitetura moderna (Mobile-First) e otimizado para motores de busca (Technical SEO), o sistema oferece uma interface responsiva, resiliente e veloz.

A plataforma fornece o horário oficial de Brasília (GMT-3) e exibe as principais cotações de divisas internacionais, integradas através da **AwesomeAPI**, além de contar com um conversor de câmbio interativo ao usuário.

## 🚀 Arquitetura e Tecnologias

- **Next.js 15 (App Router)**: Renderização híbrida inteligente combinando *Server Components* e *Client Components*.
- **TypeScript**: Tipagem estática estruturada visando garantir a estabilidade das informações em runtime e contratos de API seguros.
- **Tailwind CSS**: Estilização e design system suportando elementos modernos de UI e layouts fluidos em `Bento Grid`.
- **SEO & Metadados**: Implementação detalhada de OpenGraph, Twitter Cards, geração dinâmica de Sitemaps, `robots.ts` e suporte a JSON-LD Schema para otimização em motores de busca.

## 📦 Estratégia de Cache (ISR)

Uma das características de destaque na performance operacional do projeto é a implementação do ISR (*Incremental Static Regeneration*). A integração principal das Cotações conta com uma política de revalidação sistemática (`revalidate: 600`).

**Funcionamento Prático:** O servidor Next.js armazena a versão estática das cotações em cache por exatos 10 minutos (600 segundos), assegurando respostas HTTP sem latência de rede adicional. Após este período, a própria infraestrutura efetua um *re-fetch* das divisas em segundo plano, atualizando a base sem onerar a fluidez da navegação para o usuário e prevenindo timeouts.

## 🔧 Configuração e Deploy Local

### Pré-requisitos
- Ambiente contendo [Node.js](https://nodejs.org/) (recomendada versão 20 LTS ou superior).

1. **Instalação das dependências**
```bash
npm install
```

2. **Inicializando o servidor de Desenvolvimento**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) pelo navegador testar ambiente de staging local.

3. **Build para Produção (Validando Performance Estática)**
```bash
npm run build
npm start
```

## 📐 Padrões de Design (UI/UX)
O sistema visual foi arquitetado sob grades responsivas multidimensionais proporcionando leitura clara dos blocos de dados transacionais.

Utiliza como base paletas em tons Graphite e Slate fundidos com tipografia limpa. Variações financeiras de alta relevância são assinaladas organicamente por tons de Emerald (para métricas positivas/alinhamentos em tempo real) e Rose, proporcionando alertas visuais equilibrados e alinhados às melhores práticas de usabilidade.

## 🤝 Contas e Contribuições
Desenvolvimento guiado por padrões restritos de legibilidade de código. Pull Requests voltados a estabilização de layout e escalabilidade (SSR First / Suspense Bounds) são priorizados.
