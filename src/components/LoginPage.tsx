
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Scale, Shield, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string }) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulação de autenticação (substitua pela sua lógica real)
    setTimeout(() => {
      onLogin({ email, password });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-institutional-50 to-institutional-100 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Lado esquerdo - Informações */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="p-3 rounded-xl bg-primary text-white">
                <Scale className="h-8 w-8" />
              </div>
              <h1 className="ml-3 text-3xl font-bold text-gradient">
                LicitaIA
              </h1>
            </div>
            
            <h2 className="text-4xl font-bold text-institutional-900 mb-4">
              Inteligência Artificial para Licitações Públicas
            </h2>
            
            <p className="text-xl text-institutional-700 mb-8">
              Especialista em Lei 14.133/2021 para geração automatizada de documentos DFD, ETP e TR.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-institutional-200 mr-4">
                  <Shield className="h-5 w-5 text-institutional-600" />
                </div>
                <span className="text-institutional-700">
                  Conformidade total com a Lei 14.133/2021
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-institutional-200 mr-4">
                  <FileText className="h-5 w-5 text-institutional-600" />
                </div>
                <span className="text-institutional-700">
                  Geração inteligente de documentos técnicos
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-institutional-200 mr-4">
                  <Scale className="h-5 w-5 text-institutional-600" />
                </div>
                <span className="text-institutional-700">
                  Consultoria jurídica especializada em tempo real
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="p-3 rounded-xl bg-primary text-white">
                  <Scale className="h-8 w-8" />
                </div>
                <h1 className="ml-3 text-2xl font-bold text-gradient">
                  LicitaIA
                </h1>
              </div>
              <CardTitle className="text-2xl font-bold text-institutional-900">
                Acesso Autorizado
              </CardTitle>
              <CardDescription className="text-institutional-600">
                Entre com suas credenciais para acessar a plataforma
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-institutional-700">
                    Email institucional
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@orgao.gov.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-institutional-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-institutional-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-institutional-500" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 gradient-institutional text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Autenticando...' : 'Entrar'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-institutional-600">
                  Acesso restrito a servidores públicos autorizados
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
