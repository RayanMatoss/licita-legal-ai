
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Scale } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LawArticle {
  id: string;
  article_number: string;
  title: string;
  content: string;
  section: string;
  chapter: string;
  keywords: string[];
}

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<LawArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<LawArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchTerm, articles]);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('law_articles')
        .select('*')
        .order('article_number');

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (!searchTerm) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(article =>
      article.article_number.includes(searchTerm) ||
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredArticles(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Scale className="h-8 w-8 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Carregando base de conhecimento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h2>
          <p className="text-gray-600">Lei 14.133/2021 - Nova Lei de Licitações e Contratos</p>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Pesquisar artigos, palavras-chave ou conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Artigos */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                {searchTerm ? 'Nenhum artigo encontrado para sua pesquisa.' : 'Nenhum artigo disponível.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Badge variant="outline" className="mr-3">
                        Art. {article.article_number}
                      </Badge>
                      {article.title}
                    </CardTitle>
                    {(article.section || article.chapter) && (
                      <CardDescription className="mt-2">
                        {article.chapter && `${article.chapter} - `}
                        {article.section}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {article.content}
                </p>
                
                {article.keywords && article.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Resumo */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Sobre a Lei 14.133/2021</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800">
            A Lei 14.133/2021 (Nova Lei de Licitações) estabelece normas gerais de licitação e contratação 
            para as Administrações Públicas diretas, autárquicas e fundacionais da União, Estados, 
            Distrito Federal e Municípios. Esta base de conhecimento contém os principais artigos 
            relevantes para a elaboração de documentos licitatórios.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
