
-- Criar enum para tipos de documentos
CREATE TYPE document_type AS ENUM ('dfd', 'etp', 'tr');

-- Criar enum para status de documentos
CREATE TYPE document_status AS ENUM ('draft', 'completed', 'archived');

-- Criar enum para roles de usuários
CREATE TYPE user_role AS ENUM ('admin', 'servidor_publico', 'gestor');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  orgao TEXT,
  cargo TEXT,
  role user_role DEFAULT 'servidor_publico',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conversas
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Nova Conversa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de documentos gerados
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type document_type NOT NULL,
  status document_status DEFAULT 'draft',
  content JSONB NOT NULL,
  generated_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de templates
CREATE TABLE public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type document_type NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de artigos da Lei 14.133/2021
CREATE TABLE public.law_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_number TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  section TEXT,
  chapter TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.law_articles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para conversations
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON public.conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para messages
CREATE POLICY "Users can view messages from own conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- Políticas RLS para documents
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para templates (público para leitura)
CREATE POLICY "Everyone can view active templates" ON public.templates
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Políticas RLS para law_articles (público para leitura)
CREATE POLICY "Everyone can view law articles" ON public.law_articles
  FOR SELECT TO authenticated USING (TRUE);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando usuário se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir alguns artigos básicos da Lei 14.133/2021
INSERT INTO public.law_articles (article_number, title, content, section, chapter, keywords) VALUES
('18', 'Fase de planejamento da contratação', 'A fase de planejamento da contratação será iniciada com a demanda do órgão ou entidade, que deverá ser formalizada por meio de documento que contenha, no mínimo: I - a descrição da necessidade; II - a análise de viabilidade da contratação; III - os requisitos da contratação; IV - as estimativas de preços obtidas por meio da adoção dos parâmetros de preços de que trata o § 2º do art. 23 desta Lei; V - o cronograma de contratação; VI - a previsão orçamentária; VII - os critérios de sustentabilidade ambiental, quando aplicáveis.', 'Seção I', 'Capítulo II', ARRAY['planejamento', 'dfd', 'demanda', 'viabilidade']),
('40', 'Instrumento convocatório', 'O instrumento convocatório conterá: I - a definição do objeto da licitação; II - os critérios de aceitação das propostas; III - as sanções aplicáveis; IV - as cláusulas do contrato, inclusive as relacionadas ao preço; V - a indicação dos prazos de fornecimento, execução ou prestação do serviço; VI - as condições equivalentes de pagamento; VII - os critérios de julgamento, com disposições claras e parâmetros objetivos; VIII - as condições de participação na licitação; IX - a exigência de garantias e seguros, quando aplicáveis.', 'Seção I', 'Capítulo III', ARRAY['edital', 'termo de referência', 'objeto', 'critérios']),
('54', 'Modalidades de licitação', 'São modalidades de licitação: I - pregão; II - concorrência; III - concurso; IV - leilão; V - diálogo competitivo.', 'Seção II', 'Capítulo III', ARRAY['modalidades', 'pregão', 'concorrência', 'concurso', 'leilão', 'diálogo competitivo']);
