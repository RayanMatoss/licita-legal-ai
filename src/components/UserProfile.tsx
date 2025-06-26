
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Save, Mail, Building, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface UserProfileData {
  full_name: string;
  email: string;
  orgao: string;
  cargo: string;
  role: UserRole;
}

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfileData>({
    full_name: '',
    email: '',
    orgao: '',
    cargo: '',
    role: 'servidor_publico'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          orgao: data.orgao || '',
          cargo: data.cargo || '',
          role: data.role || 'servidor_publico'
        });
      } else {
        // Se não encontrou perfil, usar dados do auth
        setProfile(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: profile.email,
          full_name: profile.full_name,
          orgao: profile.orgao,
          cargo: profile.cargo,
          role: profile.role,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const roles: Record<UserRole, string> = {
      'admin': 'Administrador',
      'servidor_publico': 'Servidor Público',
      'gestor': 'Gestor'
    };
    return roles[role];
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      'admin': 'bg-red-100 text-red-800',
      'servidor_publico': 'bg-blue-100 text-blue-800',
      'gestor': 'bg-green-100 text-green-800'
    };
    return colors[role];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Perfil do Usuário</h2>
          <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    placeholder="seu@email.com"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgao">Órgão/Entidade</Label>
                  <Input
                    id="orgao"
                    value={profile.orgao}
                    onChange={(e) => setProfile({...profile, orgao: e.target.value})}
                    placeholder="Nome do órgão ou entidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={profile.cargo}
                    onChange={(e) => setProfile({...profile, cargo: e.target.value})}
                    placeholder="Seu cargo atual"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função no Sistema</Label>
                <Select value={profile.role} onValueChange={(value: UserRole) => setProfile({...profile, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="servidor_publico">Servidor Público</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo do Perfil */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{profile.email || 'Email não informado'}</span>
              </div>
              
              {profile.orgao && (
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{profile.orgao}</span>
                </div>
              )}
              
              {profile.cargo && (
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{profile.cargo}</span>
                </div>
              )}
              
              <div className="pt-2">
                <Badge className={getRoleColor(profile.role)}>
                  {getRoleLabel(profile.role)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Dicas de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Mantenha suas informações sempre atualizadas</li>
                <li>• Use uma senha forte e única</li>
                <li>• Não compartilhe suas credenciais</li>
                <li>• Faça logout ao sair do sistema</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
