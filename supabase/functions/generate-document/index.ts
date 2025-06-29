import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import "https://deno.land/std@0.168.0/dotenv/load.ts";

// Correto: use apenas o nome da variável de ambiente
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

console.log('OPENAI_API_KEY:', openAIApiKey);
console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const documentTemplates = {
  dfd: `
# DOCUMENTO DE FORMALIZAÇÃO DE DEMANDA (DFD)

## 1. DESCRIÇÃO DA NECESSIDADE
{descricao_necessidade}

## 2. JUSTIFICATIVA
{justificativa}

## 3. OBJETO DA CONTRATAÇÃO
{objeto}

## 4. ESTIMATIVA DE CUSTOS
Valor estimado: {valor_estimado}

## 5. PRAZO DE EXECUÇÃO
{prazo_execucao}

## 6. MODALIDADE LICITATÓRIA SUGERIDA
{modalidade_licitacao}

## 7. CRITÉRIO DE JULGAMENTO
{criterio_julgamento}

## 8. FUNDAMENTAÇÃO LEGAL
Este documento está em conformidade com o Art. 18 da Lei 14.133/2021.
`,
  etp: `
# ESTUDO TÉCNICO PRELIMINAR (ETP)

## 1. OBJETO
{objeto}

## 2. JUSTIFICATIVA DA CONTRATAÇÃO
{justificativa}

## 3. DESCRIÇÃO DETALHADA
{descricao_detalhada}

## 4. ESPECIFICAÇÕES TÉCNICAS
{especificacoes_tecnicas}

## 5. ANÁLISE DE VIABILIDADE
Esta contratação é viável considerando os aspectos técnicos, econômicos e operacionais apresentados.

## 6. ESTIMATIVA DE CUSTOS
Valor estimado: {valor_estimado}

## 7. PRAZO DE EXECUÇÃO
{prazo_execucao}

## 8. FORMA DE PAGAMENTO
{forma_pagamento}

## 9. GARANTIAS
{garantias}

## 10. SUSTENTABILIDADE AMBIENTAL
A contratação observará critérios de sustentabilidade ambiental conforme legislação vigente.

## 11. FUNDAMENTAÇÃO LEGAL
Este documento está em conformidade com o Art. 18, § 1º da Lei 14.133/2021.
`,
  tr: `
# TERMO DE REFERÊNCIA (TR)

## 1. OBJETO
{objeto}

## 2. ESPECIFICAÇÕES
{especificacoes}

## 3. OBRIGAÇÕES DA CONTRATADA
{obrigacoes_contratada}

## 4. OBRIGAÇÕES DO CONTRATANTE
{obrigacoes_contratante}

## 5. PRAZO DE EXECUÇÃO
{prazo_execucao}

## 6. FORMA DE PAGAMENTO
{forma_pagamento}

## 7. PENALIDADES
{penalidades}

## 8. CRITÉRIOS DE ACEITAÇÃO
{criterios_aceitacao}

## 9. FISCALIZAÇÃO
A execução do contrato será acompanhada e fiscalizada por servidor designado pela Administração.

## 10. FUNDAMENTAÇÃO LEGAL
Este documento está em conformidade com o Art. 40 da Lei 14.133/2021.
`
};

// Definição do tipo para a resposta da OpenAI
type OpenAIResponse = {
  choices: {
    message: {
      content: string;
    }
  }[];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key não configurada');
    }

    // Analisar a mensagem para extrair informações do documento
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em licitações públicas. Analise a mensagem do usuário e extraia informações para gerar um documento (DFD, ETP ou TR).

Responda APENAS com um JSON válido no seguinte formato:
{
  "tipo_documento": "dfd|etp|tr",
  "dados": {
    "objeto": "texto",
    "descricao_necessidade": "texto",
    "justificativa": "texto",
    "valor_estimado": "texto",
    "prazo_execucao": "texto",
    "modalidade_licitacao": "texto",
    "criterio_julgamento": "texto",
    "especificacoes_tecnicas": "texto",
    "especificacoes": "texto",
    "obrigacoes_contratada": "texto",
    "obrigacoes_contratante": "texto",
    "forma_pagamento": "texto",
    "penalidades": "texto",
    "criterios_aceitacao": "texto",
    "garantias": "texto",
    "descricao_detalhada": "texto"
  },
  "titulo": "título do documento"
}

Se a mensagem não for uma solicitação de documento, retorne: {"erro": "Não é uma solicitação de documento"}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
      }),
    });

    const analysisData = await analysisResponse.json() as OpenAIResponse;
    console.log('Resposta da OpenAI:', analysisData);
    console.log('Conteúdo retornado pela OpenAI:', analysisData.choices[0]?.message?.content);
    let analysis;
    try {
      analysis = JSON.parse(analysisData.choices[0].message.content);
    } catch (e) {
      console.error('Erro ao fazer parse do conteúdo da OpenAI:', analysisData.choices[0]?.message?.content, e);
      return new Response(JSON.stringify({ 
        error: 'Não foi possível interpretar a resposta da OpenAI. Tente novamente ou refine sua solicitação.',
        rawContent: analysisData.choices[0]?.message?.content || null
      }), { status: 500 });
    }

    if (analysis.erro) {
      return new Response(JSON.stringify({ 
        isDocument: false,
        response: `Entendi sua pergunta. Para gerar documentos, você pode solicitar:

📋 **"Gere um DFD para..."** - Documento de Formalização de Demanda
📋 **"Preciso de um ETP para..."** - Estudo Técnico Preliminar  
📋 **"Crie um TR para..."** - Termo de Referência

Exemplo: "Gere um DFD para contratação de serviços de limpeza, valor estimado R$ 50.000, prazo 12 meses"

Como posso ajudá-lo?`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Gerar documento baseado no template
    const template = documentTemplates[analysis.tipo_documento as keyof typeof documentTemplates];
    let documentContent = template;

    // Substituir placeholders com dados extraídos
    Object.entries(analysis.dados).forEach(([key, value]) => {
      if (value) {
        documentContent = documentContent.replace(
          new RegExp(`{${key}}`, 'g'),
          value as string
        );
      }
    });

    // Limpar placeholders não substituídos
    documentContent = documentContent.replace(/{[^}]+}/g, 'Não especificado');

    // Salvar documento no banco
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        title: analysis.titulo,
        type: analysis.tipo_documento,
        status: 'completed',
        content: analysis.dados,
        generated_text: documentContent
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar documento:', error);
      throw error;
    }

    const documentTypeNames = {
      dfd: 'DFD - Documento de Formalização de Demanda',
      etp: 'ETP - Estudo Técnico Preliminar',
      tr: 'TR - Termo de Referência'
    };

    return new Response(JSON.stringify({
      isDocument: true,
      documentId: document.id,
      documentType: analysis.tipo_documento,
      response: `✅ **${documentTypeNames[analysis.tipo_documento as keyof typeof documentTypeNames]}** gerado com sucesso!

**Título:** ${analysis.titulo}

O documento foi salvo na sua biblioteca e está pronto para download. Você pode:
- 📋 Visualizar na aba "Documentos"
- 📥 Fazer download em PDF
- ✏️ Editar se necessário

Gostaria que eu faça alguma alteração no documento ou precisa de ajuda com algo mais?`,
      documentContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na geração do documento:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao gerar documento: ' + (error instanceof Error ? error.message : String(error))
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
