
import { Bot } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Bem-vindo à LicitaIA
        </h2>
        <p className="text-gray-500 mb-4">
          Selecione uma conversa ou inicie um novo chat para começar
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
