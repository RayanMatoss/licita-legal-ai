
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

const ChatHeader = () => {
  return (
    <div className="border-b border-gray-200 p-4 bg-white">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-blue-600 text-white">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">LicitaIA</h3>
          <p className="text-sm text-gray-600">
            Assistente para Lei 14.133/2021
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
