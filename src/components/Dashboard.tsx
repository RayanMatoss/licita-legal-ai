
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  LogOut,
  Scale,
  PlusCircle,
  History,
  User
} from 'lucide-react';
import ChatInterface from './ChatInterface';
import DocumentGenerator from './DocumentGenerator';
import KnowledgeBase from './KnowledgeBase';
import UserProfile from './UserProfile';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LicitaIA</h1>
                <p className="text-sm text-gray-600">Assistente para Licitações Públicas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                {user?.email}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="chat" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Base Legal
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <ChatInterface />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('documents')}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar DFD
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('documents')}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar ETP
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('documents')}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar TR
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <DocumentGenerator />
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgeBase />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atividades</CardTitle>
                <CardDescription>
                  Visualize suas conversas e documentos criados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
