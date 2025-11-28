# Casos de Uso da Aplicação

A aplicação suporta as seguintes funcionalidades, organizadas por recurso.

---

## 1. Usuários e Autenticação (`/users`)

| Caso de Uso | Método HTTP | Endpoint | Descrição |
| :--- | :--- | :--- | :--- |
| **Autenticação (Login)** | `POST` | `/users/auth` | Permite ao usuário logar no sistema, geralmente enviando credenciais (e-mail/senha) e recebendo um token de autenticação (`AuthResponse`). |
| **Criação de Usuário** | `POST` | `/users` | Realiza o cadastro de um novo usuário na plataforma. |
| **Atualização de Usuário e Perfil** | `PUT` | `/users/{userId}` | Modifica os dados cadastrais e as informações do perfil de um usuário específico. |
| **Desativação de Usuário** | `PATCH` | `/users/{userId}/deactivate` | Altera o status do usuário para inativo ou desativado, impedindo seu acesso futuro. |
| **Visualização de Estatísticas/Dashboard** | `GET` | `/users/{userId}/stats` | Obtém dados consolidados e estatísticos (por exemplo, progresso, métricas de desempenho) para o painel de controle do usuário. |

---

## 2. Organizações (`/organizations`)

| Caso de Uso | Método HTTP | Endpoint | Descrição |
| :--- | :--- | :--- | :--- |
| **Criação de Organização** | `POST` | `/organizations` | Registra uma nova entidade de organização na plataforma. |
| **Atualização de Organização** | `PUT` | `/organizations` | Atualiza as informações cadastrais de uma organização existente. |
| **Alternância de Membro** | `PATCH` | `/organizations/{cnpj}/members/{memberId}` | Adiciona ou remove um membro (identificado por `memberId`) de uma organização (identificada pelo `cnpj`). |
| **Desativação de Organização** | `PATCH` | `/organizations/{orgId}/deactivate` | Altera o status da organização para inativa ou desativada. |

---

## 3. Eventos (`/events`)

| Caso de Uso | Método HTTP | Endpoint | Descrição |
| :--- | :--- | :--- | :--- |
| **Criação de Evento** | `POST` | `/events` | Agenda e registra um novo evento no sistema. |
| **Atualização de Evento** | `PUT` | `/events/{eventId}` | Modifica os detalhes de um evento existente, como data, hora ou descrição. |
| **Desativação de Evento** | `PATCH` | `/events/{eventId}/deactivate` | Marca um evento como inativo ou cancelado. |
| **Conclusão de Evento** | `PATCH` | `/events/{eventId}/complete` | Marca um evento como finalizado ou concluído. |

---

## 4. Notícias/Feed (`/news`)

| Caso de Uso | Método HTTP | Endpoint | Descrição |
| :--- | :--- | :--- | :--- |
| **Obtenção de Notícias por Usuário** | `GET` | `/news/{userId}` | Recupera um *feed* ou lista de notícias personalizadas, relevantes para o usuário especificado. |

## Execução 

Para executar o backend, primeiro suba o container docker 

para isso, abra um terminal no diretório "backend" na raiz do projeto e execute:
```
docker compose up -d
```
(em caso de windows, instale o docker desktop primeiro)

Em seguida, no mesmo terminal, execute

```
gradle bootRun
```

Após a finalização da execução do gradle, abra um terminal em "frontend" na raiz do projeto e execute: 

```
npm i
```
em seguida: 

```
npm run dev
```

Isto deve abrir uma porta local e subir a aplicação, geralmente em http://localhost:3000

