
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type DocumentType = Database['public']['Enums']['document_type'];

export default function DocumentGenerator() {
  const { user } = useAuth();
  const [activeDocument, setActiveDocument] = useState<DocumentType>('dfd');
  const [loading, setLoading] = useState(false);

  // Estados para DFD
  const [dfdData, setDfdData] = useState({
    descricao_necessidade: '',
    justificativa: '',
    objeto: '',
    valor_estimado: '',
    prazo_execucao: '',
    modalidade_licitacao: 'pregao',
    criterio_julgamento: 'menor_preco'
  });

  // Estados para ETP
  const [etpData, setEtpData] = useState({
    objeto: '',
    justificativa: '',
    descricao_detalhada: '',
    especificacoes_tecnicas: '',
    valor_estimado: '',
    prazo_execucao: '',
    forma_pagamento: '',
    garantias: ''
  });

  // Estados para TR
  const [trData, setTrData] = useState({
    objeto: '',
    especificacoes: '',
    obrigacoes_contratada: '',
    obrigacoes_contratante: '',
    prazo_execucao: '',
    forma_pagamento: '',
    penalidades: '',
    criterios_aceitacao: ''
  });

  const saveDocument = async (type: DocumentType, data: any, title: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title,
          type,
          content: data,
          status: 'draft' as const
        });

      if (error) throw error;
      toast.success('Documento salvo com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao salvar documento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateDocument = async (type: DocumentType, data: any) => {
    // Aqui seria implementada a geração do documento com IA
    toast.success('Documento gerado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerador de Documentos</h2>
          <p className="text-gray-600">Crie DFD, ETP e Termo de Referência conforme a Lei 14.133/2021</p>
        </div>
      </div>

      <Tabs value={activeDocument} onValueChange={(value) => setActiveDocument(value as DocumentType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dfd">DFD - Documento de Formalização de Demanda</TabsTrigger>
          <TabsTrigger value="etp">ETP - Estudo Técnico Preliminar</TabsTrigger>
          <TabsTrigger value="tr">TR - Termo de Referência</TabsTrigger>
        </TabsList>

        <TabsContent value="dfd">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documento de Formalização de Demanda (DFD)
              </CardTitle>
              <CardDescription>
                Conforme Art. 18 da Lei 14.133/2021 - Formalização da necessidade de contratação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dfd-objeto">Objeto da Contratação</Label>
                  <Input
                    id="dfd-objeto"
                    value={dfdData.objeto}
                    onChange={(e) => setDfdData({...dfdData, objeto: e.target.value})}
                    placeholder="Descrição do objeto a ser contratado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dfd-valor">Valor Estimado (R$)</Label>
                  <Input
                    id="dfd-valor"
                    type="number"
                    value={dfdData.valor_estimado}
                    onChange={(e) => setDfdData({...dfdData, valor_estimado: e.target.value})}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dfd-descricao">Descrição da Necessidade</Label>
                <Textarea
                  id="dfd-descricao"
                  value={dfdData.descricao_necessidade}
                  onChange={(e) => setDfdData({...dfdData, descricao_necessidade: e.target.value})}
                  placeholder="Descreva detalhadamente a necessidade que motivou a contratação"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dfd-justificativa">Justificativa</Label>
                <Textarea
                  id="dfd-justificativa"
                  value={dfdData.justificativa}
                  onChange={(e) => setDfdData({...dfdData, justificativa: e.target.value})}
                  placeholder="Justifique a necessidade da contratação"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dfd-modalidade">Modalidade de Licitação</Label>
                  <Select value={dfdData.modalidade_licitacao} onValueChange={(value) => setDfdData({...dfdData, modalidade_licitacao: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pregao">Pregão</SelectItem>
                      <SelectItem value="concorrencia">Concorrência</SelectItem>
                      <SelectItem value="concurso">Concurso</SelectItem>
                      <SelectItem value="leilao">Leilão</SelectItem>
                      <SelectItem value="dialogo_competitivo">Diálogo Competitivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dfd-criterio">Critério de Julgamento</Label>
                  <Select value={dfdData.criterio_julgamento} onValueChange={(value) => setDfdData({...dfdData, criterio_julgamento: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menor_preco">Menor Preço</SelectItem>
                      <SelectItem value="maior_desconto">Maior Desconto</SelectItem>
                      <SelectItem value="melhor_tecnica">Melhor Técnica</SelectItem>
                      <SelectItem value="tecnica_preco">Técnica e Preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => saveDocument('dfd', dfdData, `DFD - ${dfdData.objeto || 'Novo Documento'}`)}
                  disabled={loading}
                  variant="outline"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Rascunho
                </Button>
                <Button 
                  onClick={() => generateDocument('dfd', dfdData)}
                  disabled={loading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar DFD
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="etp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Estudo Técnico Preliminar (ETP)
              </CardTitle>
              <CardDescription>
                Análise detalhada da viabilidade e especificações técnicas da contratação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="etp-objeto">Objeto</Label>
                <Input
                  id="etp-objeto"
                  value={etpData.objeto}
                  onChange={(e) => setEtpData({...etpData, objeto: e.target.value})}
                  placeholder="Objeto do ETP"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="etp-descricao">Descrição Detalhada</Label>
                <Textarea
                  id="etp-descricao"
                  value={etpData.descricao_detalhada}
                  onChange={(e) => setEtpData({...etpData, descricao_detalhada: e.target.value})}
                  placeholder="Descrição detalhada do objeto"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="etp-especificacoes">Especificações Técnicas</Label>
                <Textarea
                  id="etp-especificacoes"
                  value={etpData.especificacoes_tecnicas}
                  onChange={(e) => setEtpData({...etpData, especificacoes_tecnicas: e.target.value})}
                  placeholder="Especificações técnicas detalhadas"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="etp-valor">Valor Estimado (R$)</Label>
                  <Input
                    id="etp-valor"
                    type="number"
                    value={etpData.valor_estimado}
                    onChange={(e) => setEtpData({...etpData, valor_estimado: e.target.value})}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="etp-prazo">Prazo de Execução</Label>
                  <Input
                    id="etp-prazo"
                    value={etpData.prazo_execucao}
                    onChange={(e) => setEtpData({...etpData, prazo_execucao: e.target.value})}
                    placeholder="Ex: 12 meses"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => saveDocument('etp', etpData, `ETP - ${etpData.objeto || 'Novo Documento'}`)}
                  disabled={loading}
                  variant="outline"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Rascunho
                </Button>
                <Button 
                  onClick={() => generateDocument('etp', etpData)}
                  disabled={loading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar ETP
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tr">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Termo de Referência (TR)
              </CardTitle>
              <CardDescription>
                Documento que estabelece as condições e especificações para a contratação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tr-objeto">Objeto</Label>
                <Input
                  id="tr-objeto"
                  value={trData.objeto}
                  onChange={(e) => setTrData({...trData, objeto: e.target.value})}
                  placeholder="Objeto do Termo de Referência"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tr-especificacoes">Especificações</Label>
                <Textarea
                  id="tr-especificacoes"
                  value={trData.especificacoes}
                  onChange={(e) => setTrData({...trData, especificacoes: e.target.value})}
                  placeholder="Especificações detalhadas do objeto"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tr-obrigacoes-contratada">Obrigações da Contratada</Label>
                  <Textarea
                    id="tr-obrigacoes-contratada"
                    value={trData.obrigacoes_contratada}
                    onChange={(e) => setTrData({...trData, obrigacoes_contratada: e.target.value})}
                    placeholder="Lista das obrigações da empresa contratada"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tr-obrigacoes-contratante">Obrigações do Contratante</Label>
                  <Textarea
                    id="tr-obrigacoes-contratante"
                    value={trData.obrigacoes_contratante}
                    onChange={(e) => setTrData({...trData, obrigacoes_contratante: e.target.value})}
                    placeholder="Lista das obrigações do órgão contratante"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tr-criterios">Critérios de Aceitação</Label>
                <Textarea
                  id="tr-criterios"
                  value={trData.criterios_aceitacao}
                  onChange={(e) => setTrData({...trData, criterios_aceitacao: e.target.value})}
                  placeholder="Critérios para aceitação dos produtos/serviços"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => saveDocument('tr', trData, `TR - ${trData.objeto || 'Novo Documento'}`)}
                  disabled={loading}
                  variant="outline"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Rascunho
                </Button>
                <Button 
                  onClick={() => generateDocument('tr', trData)}
                  disabled={loading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar TR
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
