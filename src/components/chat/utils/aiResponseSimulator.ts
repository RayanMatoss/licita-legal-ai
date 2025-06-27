
export const simulateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('dfd') || lowerMessage.includes('documento de formalização')) {
    return `**Documento de Formalização de Demanda (DFD)**

O DFD é um documento obrigatório conforme o art. 18 da Lei 14.133/2021. Ele deve conter:

**Estrutura básica:**
1. **Descrição da necessidade** - O que será contratado
2. **Justificativa** - Por que é necessário
3. **Estimativa de custos** - Valores de referência
4. **Prazo de execução** - Cronograma previsto
5. **Fontes de recurso** - Origem do financiamento

**Para gerar um DFD automaticamente, me informe:**
- Qual o objeto da contratação?
- Qual a justificativa da necessidade?
- Há estimativa de valor?

**Exemplo de solicitação:**
"Gere um DFD para contratação de serviços de limpeza, valor estimado R$ 50.000, prazo 12 meses"`;
  }
  
  if (lowerMessage.includes('etp') || lowerMessage.includes('estudo técnico')) {
    return `**Estudo Técnico Preliminar (ETP)**

O ETP é previsto no art. 18, § 1º da Lei 14.133/2021 e deve abordar:

**Elementos obrigatórios:**
1. **Análise de viabilidade** da contratação
2. **Requisitos da contratação**
3. **Estimativa de custos**
4. **Cronograma físico-financeiro**
5. **Sustentabilidade ambiental**
6. **Acessibilidade**
7. **Padronização**
8. **Economicidade**

**Para gerar um ETP automaticamente, me informe:**
- Tipo de contratação (obra, serviço, fornecimento)?
- Especificações técnicas necessárias?
- Prazo estimado?

**Exemplo de solicitação:**
"Preciso de um ETP para aquisição de equipamentos de informática, valor R$ 100.000"`;
  }
  
  if (lowerMessage.includes('termo de referência') || lowerMessage.includes(' tr ')) {
    return `**Termo de Referência (TR)**

O TR é o documento que define o objeto da licitação (art. 40 da Lei 14.133/2021).

**Conteúdo mínimo:**
1. **Definição do objeto** - Especificação detalhada
2. **Fundamentação da contratação**
3. **Descrição da solução**
4. **Requisitos da contratação**
5. **Modelo de execução do objeto**
6. **Modelo de gestão do contrato**
7. **Critérios de medição e pagamento**
8. **Forma de seleção do fornecedor**

**Para gerar um TR automaticamente, me informe:**
- Objeto específico da licitação?
- Especificações técnicas detalhadas?
- Obrigações da contratada e contratante?

**Exemplo de solicitação:**
"Crie um TR para prestação de serviços de segurança, 24h por dia, valor R$ 200.000 anuais"`;
  }
  
  if (lowerMessage.includes('lei') || lowerMessage.includes('14.133')) {
    return `**Lei 14.133/2021 - Nova Lei de Licitações**

Esta lei institui normas gerais de licitação e contratação para as Administrações Públicas.

**Principais novidades:**
- **Diálogo competitivo** (modalidade nova)
- **Credenciamento** (modalidade reformulada)  
- **Portal Nacional de Contratações Públicas**
- **Contratação integrada**
- **Remuneração variável**

**Artigos mais consultados:**
- Art. 18 - Fase de planejamento
- Art. 40 - Termo de referência
- Art. 54 - Modalidades licitatórias
- Art. 75 - Critérios de julgamento

Sobre qual artigo específico gostaria de saber mais?`;
  }
  
  return `Entendi sua pergunta sobre "${userMessage}". 

Para oferecer a resposta mais precisa possível, preciso de um pouco mais de contexto. Você está buscando informações sobre:

🔹 **Elaboração de documentos** (DFD, ETP, TR)?
🔹 **Consulta à Lei 14.133/2021**?
🔹 **Procedimentos licitatórios**?
🔹 **Dúvidas específicas** sobre algum processo?

**Para gerar documentos automaticamente, você pode usar comandos como:**
- "Gere um DFD para..."
- "Preciso de um ETP para..."
- "Crie um TR para..."

Quanto mais detalhes você fornecer, melhor poderei ajudá-lo!`;
};
