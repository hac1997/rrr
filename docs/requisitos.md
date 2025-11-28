## Descrição geral do Sistema

 O sistema REVO - Rede Voluntária é uma plataforma digital desenvolvida para facilitar a conexão entre voluntários e organizações que promovem eventos de diversas naturezas, como esportivos, culturais ou de caridade. A proposta é oferecer uma solução integrada que permita o cadastro de voluntários, a divulgação de oportunidades de voluntariado, o gerenciamento de escalas e a comunicação eficiente entre os envolvidos. A plataforma será acessível tanto por meio de uma aplicação web quanto por futuramente um aplicativo móvel, ampliando o alcance e facilitando o uso para diferentes perfis de usuários.

 A aplicação será dividida em dois perfis principais: voluntários e organizações. As organizações poderão criar eventos, definir funções e horários de atuação, além de selecionar voluntários com base em perfil e disponibilidade. Já os voluntários poderão se inscrever em eventos, visualizar suas escalas, receber notificações e acompanhar seu histórico de participação. O sistema também contará com funcionalidades como feedback pós-evento, envio de comunicados em massa e recompensas simbólicas oferecidas pelas organizações. Dessa forma, o REVO busca ser uma solução completa, moderna e escalável para gestão de ações voluntárias.


## Requisitos Funcionais

<table>
  <thead>
    <tr>
      <th>Código</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>RF01</td>
      <td>Login social via Google</td>
    </tr>
    <tr>
      <td>RF02</td>
      <td>Registrar voluntários</td>
    </tr>
    <tr>
      <td>RF03</td>
      <td>Registrar grupos</td>
    </tr>
    <tr>
      <td>RF04</td>
      <td>Registrar eventos</td>
    </tr>
    <tr>
      <td>RF05</td>
      <td>Dividir voluntários em grupos</td>
    </tr>
    <tr>
      <td>RF06</td>
      <td>Alocar grupos a eventos</td>
    </tr>
    <tr>
      <td>RF07</td>
      <td>Notificar voluntários via aplicativo</td>
    </tr>
    <tr>
      <td>RF08</td>
      <td>Notificar voluntários via e-mail</td>
    </tr>
    <tr>
      <td>RF09</td>
      <td>Notificar voluntários via SMS/WhatsApp</td>
    </tr>
    <tr>
      <td>RF10</td>
      <td>Gerar relatórios de participação dos voluntários</td>
    </tr>
  </tbody>
</table>

## Requisitos Não Funcionais

<table>
  <thead>
    <tr>
      <th>Código</th>
      <th>Tipo</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>RNF01</td>
      <td>Desempenho</td>
      <td>O sistema deve garantir o carregamento das principais funcionalidades (login, visualização de eventos, notificações) de forma agil.</td>
    </tr>
    <tr>
      <td>RNF02</td>
      <td>Custo</td>
      <td>A plataforma não deve ter custo altos, tanto ao hosteador quanto ao usuário. Utilizando tecnologias mais baratas quanto possivel.</td>
    </tr>
    <tr>
      <td>RNF03</td>
      <td>Memória</td>
      <td>O aplicativo deve funcionar adequadamente em dispositivos com o minimo possivel de memória, com cache & CDN se possivél.</td>
    </tr>
    <tr>
      <td>RNF04</td>
      <td>Energia</td>
      <td>O consumo de bateria do aplicativo deve ser otimizado, com uso mínimo de recursos em segundo plano, evitando impacto significativo.</td>
    </tr>
    <tr>
      <td>RNF05</td>
      <td>Tempo</td>
      <td>As notificações (app, e-mail, SMS, WhatsApp) devem ser entregues a tempo. Alem disso, o aplicativo não deve ter tempo de aprendizado alto para aprender a utiliza-lo.</td>
    </tr>
    <tr>
      <td>RNF06</td>
      <td>Extra (Gamificação)</td>
      <td>Recompensas baseadas em pontos vindas dos provedores do voluntariados e/ou o proprio site.</td>
    </tr>
  </tbody>
</table>

### Histórico do documento: 
- 19/08/2025: versão 1.0
