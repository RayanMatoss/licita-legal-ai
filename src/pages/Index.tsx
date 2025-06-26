
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import LoginPage from '@/components/LoginPage';
import AppSidebar from '@/components/AppSidebar';
import ChatInterface from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, Search, History, Settings } from 'lucide-react';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState('chat');

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Aqui você implementaria a lógica real de autenticação
    console.log('Login attempt:', credentials);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentSection('chat');
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'chat':
      case 'new-chat':
        return <ChatInterface />;
      
      case 'documents':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-institutional-900 mb-4">
                Geração de Documentos
              </h2>
              <p className="text-institutional-700">
                Crie automaticamente seus documentos conforme a Lei 14.133/2021
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    DFD
                  </CardTitle>
                  <CardDescription>
                    Documento de Formalização de Demanda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Formaliza a necessidade da contratação conforme art. 18 da Lei 14.133/2021
                  </p>
                  <Button className="w-full">Gerar DFD</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    ETP
                  </CardTitle>
                  <CardDescription>
                    Estudo Técnico Preliminar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Análise técnica detalhada da contratação pretendida
                  </p>
                  <Button className="w-full">Gerar ETP</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    TR
                  </CardTitle>
                  <CardDescription>
                    Termo de Referência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define o objeto da licitação conforme art. 40 da Lei 14.133/2021
                  </p>
                  <Button className="w-full">Gerar TR</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'law':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-institutional-900 mb-4">
                Lei 14.133/2021
              </h2>
              <p className="text-institutional-700">
                Consulta especializada à Nova Lei de Licitações
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Consulta Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Use o chat para fazer perguntas específicas sobre a Lei 14.133/2021. 
                  A IA pode consultar artigos, explicar procedimentos e esclarecer dúvidas.
                </p>
                <Button onClick={() => setCurrentSection('chat')}>
                  Ir para o Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'templates':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-institutional-900 mb-4">
                Banco de Modelos
              </h2>
              <p className="text-institutional-700">
                Acesse modelos e documentos de referência
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Esta funcionalidade estará disponível em breve. 
                  Por enquanto, use o chat para gerar documentos personalizados.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'history':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-institutional-900 mb-4">
                Histórico
              </h2>
              <p className="text-institutional-700">
                Suas conversas e documentos anteriores
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Conversas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  O histórico de conversas estará disponível em uma versão futura.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'search':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-institutional-900 mb-4">
                Buscar
              </h2>
              <p className="text-institutional-700">
                Pesquise em documentos e conversas
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Busca Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidade em desenvolvimento. Use o chat para fazer consultas específicas.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-institutional-900 mb-4">
                Configurações
              </h2>
              <p className="text-institutional-700">
                Personalize sua experiência
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Preferências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configurações estarão disponíveis em versões futuras.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <ChatInterface />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          onLogout={handleLogout}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
        <main className="flex-1 flex flex-col">
          <div className="lg:hidden p-4 border-b border-border/60">
            <SidebarTrigger />
          </div>
          <div className="flex-1">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
