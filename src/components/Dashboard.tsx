
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import AppSidebar from './AppSidebar';
import ChatInterface from './ChatInterface';
import DocumentGenerator from './DocumentGenerator';
import KnowledgeBase from './KnowledgeBase';
import UserProfile from './UserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState('chat');
  
  const {
    currentConversationId,
    messages,
    loading,
    addMessage,
    updateMessage,
    removeMessage,
    startNewChat,
    selectConversation,
  } = useConversations();

  const handleNewChat = async () => {
    await startNewChat();
    setCurrentSection('chat');
  };

  const handleConversationSelect = (conversationId: string | null) => {
    selectConversation(conversationId);
    setCurrentSection('chat');
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'chat':
        return (
          <ChatInterface
            messages={messages}
            onAddMessage={addMessage}
            onUpdateMessage={updateMessage}
            onRemoveMessage={removeMessage}
            conversationId={currentConversationId}
          />
        );
      
      case 'documents':
        return <DocumentGenerator />;
      
      case 'law':
        return <KnowledgeBase />;
      
      case 'profile':
        return <UserProfile />;
      
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Funcionalidade em Desenvolvimento</CardTitle>
                <CardDescription>
                  Esta seção estará disponível em breve.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Por enquanto, você pode usar o chat principal para todas as funcionalidades.
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (loading && currentConversationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AppSidebar
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onNewChat={handleNewChat}
        onSectionChange={setCurrentSection}
        currentSection={currentSection}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {renderContent()}
      </div>
    </div>
  );
}
