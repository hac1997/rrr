## RF01 - Login social via Google
**Descrição:** Permite que o usuário acesse o sistema com sua conta Google.
**Objetivo:** Oferecer um login rápido, seguro e sem necessidade de senha adicional.
**Sujeito principal:** Usuário (voluntário ou organização)
**Interfaces:** Tela de login, Google OAuth

### Etapas:
1. Usuário acessa a tela inicial do sistema.
2. Clica em “Entrar com Google”.
3. É redirecionado para autenticação do Google.
4. Informa e-mail e senha da conta Google.
5. Google autentica e retorna token ao sistema.
6. Sistema verifica token e cria ou acessa o perfil.
7. Redireciona para o painel do usuário.

**Considerações:**
* Se a autenticação falhar, o sistema deve exibir mensagem de erro.
* Caso o Google esteja fora do ar, o login social não funcionará.
* Precisa garantir segurança contra tokens inválidos ou vencidos.

---

## RF02 - Registrar voluntários
**Descrição:** Voluntários criam seu perfil com informações pessoais e preferências.
**Objetivo:** Incluir novos participantes na rede de forma organizada.
**Sujeito principal:** Voluntário
**Interfaces:** Tela de cadastro de voluntário

### Etapas:
1. Usuário acessa a tela de cadastro.
2. Preenche dados como nome, e-mail, telefone, área de interesse, disponibilidade.
3. Confirma envio do formulário.
4. Sistema valida os dados.
5. Se válido, armazena e direciona para o painel.

**Considerações:**
* Dados inválidos devem ser destacados com mensagens específicas.
* Se o e-mail já estiver cadastrado, exibir erro de duplicidade.

---

## RF03 - Registrar grupos
**Descrição:** Organizações criam grupos para facilitar a gestão dos voluntários.
**Objetivo:** Estruturar equipes com funções específicas.
**Sujeito principal:** Representante da organização
**Interfaces:** Painel da organização

### Etapas:
1. Organização acessa o painel.
2. Seleciona a opção “Criar grupo”.
3. Informa nome, descrição, função e critérios (ex: quantidade de pessoas).
4. Salva o grupo.

**Considerações:**
* Sistema deve impedir criação de grupos com dados incompletos.
* Nome do grupo deve ser único dentro da organização.

---

## RF04 - Registrar eventos
**Descrição:** Permite o cadastro de eventos que necessitam de voluntários.
**Objetivo:** Divulgar atividades e atrair inscrições.
**Sujeito principal:** Representante da organização
**Interfaces:** Painel da organização

### Etapas:
1. Organização acessa o painel.
2. Seleciona “Novo evento”.
3. Preenche título, descrição, data, local, funções e horários.
4. Define se o evento será público ou privado.
5. Salva o evento.

**Considerações:**
* Campos obrigatórios devem ser validados.
* Eventos sem data ou local não devem ser publicados.

---

## RF05 - Dividir voluntários em grupos
**Descrição:** Organização distribui os voluntários em grupos conforme critérios.
**Objetivo:** Organizar tarefas e equipes para atuação nos eventos.
**Sujeito principal:** Representante da organização
**Interfaces:** Gerenciamento de voluntários

### Etapas:
1. Organização acessa um evento.
2. Visualiza lista de voluntários inscritos.
3. Cria grupos ou seleciona grupos existentes.
4. Atribui voluntários a cada grupo.
5. Salva alocação.

**Considerações:**
* Deve alertar sobre excesso de pessoas em um grupo.
* Deve permitir reorganizar ou remover voluntários com facilidade.

---

## RF06 - Alocar grupos a eventos
**Descrição:** Grupos são vinculados a funções e horários nos eventos.
**Objetivo:** Planejar a execução das atividades por equipe.
**Sujeito principal:** Representante da organização
**Interfaces:** Painel de eventos

### Etapas:
1. Acessa o evento criado.
2. Escolhe grupos disponíveis.
3. Associa cada grupo a uma função/horário.
4. Confirma a alocação.

**Considerações:**
* Sistema deve impedir sobreposição de horários para o mesmo grupo.
* Alterações devem notificar os voluntários alocados.

---

## RF07 - Notificar voluntários via aplicativo
**Descrição:** Envia mensagens rápidas diretamente aos dispositivos dos usuários.
**Objetivo:** Garantir que informações urgentes sejam vistas rapidamente.
**Sujeito principal:** Sistema ou organização
**Interfaces:** Painel de notificações

### Etapas:
1. Organização acessa painel de envio.
2. Cria a mensagem.
3. Seleciona os destinatários.
4. Envia a notificação.

**Considerações:**
* Se o voluntário não tiver o aplicativo, não receberá a notificação.
* Mensagens devem ter tamanho limitado para push notification.

---

## RF08 - Notificar voluntários via e-mail
**Descrição:** Permite envio de e-mails com informações relevantes.
**Objetivo:** Comunicar oficialmente os usuários sobre eventos e alterações.
**Sujeito principal:** Sistema ou organização
**Interfaces:** Painel de notificações

### Etapas:
1. Acessa painel de envio.
2. Cria a mensagem de e-mail.
3. Define os voluntários destinatários.
4. Envia mensagem.

**Considerações:**
* E-mails podem cair em spam se não houver configuração adequada.
* Sistema deve registrar logs de envio para verificação posterior.

---

## RF09 - Notificar voluntários via SMS ou WhatsApp
**Descrição:** Permite comunicação via mensagens diretas ao celular.
**Objetivo:** Ampliar o alcance da comunicação com o voluntário.
**Sujeito principal:** Sistema ou organização
**Interfaces:** Painel de notificações

### Etapas:
1. Acessa painel de mensagens.
2. Redige o texto.
3. Seleciona canal: SMS ou WhatsApp.
4. Envia mensagem.

**Considerações:**
* Custo por envio deve ser considerado.
* Voluntários devem ter número válido e autorizado para receber mensagens.

---

## RF10 - Gerar relatórios de participação dos voluntários
**Descrição:** Mostra dados sobre atuação dos voluntários nos eventos.
**Objetivo:** Avaliar desempenho e engajamento.
**Sujeito principal:** Representante da organização
**Interfaces:** Painel de relatórios

### Etapas:
1. Acessa área de relatórios.
2. Define filtros: evento, período, voluntário, grupo.
3. Gera visualização dos dados.
4. Exporta ou imprime o relatório.

**Considerações:**
* Relatórios com muitos dados devem ter paginação ou exportação otimizada.
* Dados pessoais devem ser protegidos conforme LGPD.
