import React, { useState } from 'react';
import {
  TrendingUp,
  Share2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AffiliatePublicView: React.FC = () => {
  const { currentUser, applyToBecomeAffiliate, navigate } = useStore();
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isAffiliate = currentUser?.role === 'affiliate' || currentUser?.role === 'admin';
  const isPending = currentUser?.affiliateStatus === 'pending';

  const handleApply = () => {
    if (!currentUser) {
      navigate('/registar?redirect=/afiliados');
      return;
    }

    if (isAffiliate) {
      navigate('/afiliado/dashboard');
      return;
    }

    const res = applyToBecomeAffiliate();
    setFeedback({
      message: res.message,
      type: res.success ? 'success' : 'info',
    });
  };

  const faqs = [
    {
      q: 'Quanto custa aderir ao programa de afiliados da AngolaMarket?',
      a: 'A adesão é 100% gratuita. Não há mensalidades, taxas de adesão nem necessidade de comprar produtos com antecedência.',
    },
    {
      q: 'Como e quando recebo as minhas comissões?',
      a: 'As comissões são geradas a cada compra efetuada pelo seu link. Quando o pedido for entregue e concluído, a comissão passa a "Disponível". Pode solicitar levantamento via Multicaixa Express, IBAN bancário (BAI, BFA, etc.), PayPay, Unitel Money ou Afrimoney.',
    },
    {
      q: 'Como o sistema rastreia as vendas feitas por mim?',
      a: 'Cada afiliado aprovado possui um código único (ex: AF83921). Ao gerar o link de qualquer produto, o seu código fica gravado no link e no carrinho do cliente. Se o cliente finalizar a compra, a comissão é creditada automaticamente na sua conta.',
    },
    {
      q: 'Preciso ter muitos seguidores nas redes sociais?',
      a: 'Não! Pode partilhar diretamente com amigos e familiares no WhatsApp, em grupos locais do condomínio, bairro ou nas suas redes sociais favoritas.',
    },
    {
      q: 'Qual é o prazo de análise da candidatura pelo administrador?',
      a: 'As candidaturas são habitualmente analisadas em menos de 24 horas úteis pela nossa equipa de gestão.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-16 sm:py-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Programa Oficial de Afiliados de Angola
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ganhe Dinheiro Extra Divulgando Produtos na AngolaMarket
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Sem precisar de comprar estoque nem gerir entregas. Partilhe produtos no WhatsApp, Facebook, Instagram ou TikTok e receba comissões automáticas diretamente na sua conta bancária ou Multicaixa Express.
          </p>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`max-w-md mx-auto p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                  : 'bg-blue-950/80 border border-blue-500 text-blue-200'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Candidature Status & Actions (Item 13) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAffiliate ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-left">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Você já é afiliado da AngolaMarket</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Código exclusivo:{' '}
                    <strong className="font-mono text-white">{currentUser?.affiliateCode || 'AF-ATIVO'}</strong>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/afiliado/dashboard')}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-lg shrink-0 flex items-center gap-2"
                >
                  <span>Aceder ao Dashboard de Afiliado</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : isPending ? (
              <div className="bg-amber-950/70 border border-amber-500/50 rounded-2xl p-4 max-w-md text-left flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-amber-200">Candidatura em Análise</h4>
                  <p className="text-[11px] text-amber-300/80 mt-0.5 leading-relaxed">
                    A sua solicitação para tornar-se afiliado foi recebida e está a ser avaliada pelo administrador da plataforma. Será notificado assim que for aprovado.
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleApply}
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition shadow-xl flex items-center gap-2.5 group"
              >
                <span>Quero ser afiliado</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 1. Como Funciona (Item 13) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Como Funciona o Programa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Três passos práticos para começar a faturar no mercado angolano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-extrabold text-xl">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">Candidatura e Aprovação</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Crie a sua conta de cliente e clique no botão <strong>"Quero ser afiliado"</strong>. O administrador analisa e ativa o seu código exclusivo.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-extrabold text-xl">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">Escolha Produtos & Gere Links</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Com o perfil de afiliado ativo, qualquer página de produto exibirá o ganho de comissão estimado e um botão de 1 clique para gerar o seu link exclusivo.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-extrabold text-xl">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">Receba Comissões Reais</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quando a encomenda for entregue ao cliente em Luanda ou províncias, a sua comissão fica disponível para levantamento via Multicaixa Express ou IBAN.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Como Ganhar & Simulação (Item 13) */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              Kz
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Como Ganhar Comissões</h3>
              <p className="text-xs text-slate-400">Exemplo real de cálculo de comissão</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 block mb-1">Valor do Produto</span>
              <span className="text-xl font-extrabold text-white">100.000 Kz</span>
              <p className="text-[10px] text-slate-500 mt-1">Ex: Telemóvel ou vestuário</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 block mb-1">Comissão Média</span>
              <span className="text-xl font-extrabold text-blue-400">10%</span>
              <p className="text-[10px] text-slate-500 mt-1">Definida pelo produtor/admin</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-500">
              <span className="text-[11px] text-blue-200 block mb-1">Seu Ganho por Venda</span>
              <span className="text-xl font-extrabold text-amber-300">10.000 Kz</span>
              <p className="text-[10px] text-blue-200 mt-1">10 vendas = 100.000 Kz extra!</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            Não há limite para a quantidade de produtos ou número de vendas. Cada venda confirmada incrementa o seu saldo acumulado.
          </p>
        </div>
      </section>

      {/* 3. Como Divulgar (Item 13) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Como Divulgar os Produtos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Estratégias simples com as ferramentas que já utiliza todos os dias no telemóvel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
            <span className="text-2xl block">💬</span>
            <h4 className="font-bold text-sm text-slate-900">Grupos de WhatsApp</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Partilhe ofertas nos estados do WhatsApp e grupos de amigos, condomínios ou trabalho em Luanda e províncias.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
            <span className="text-2xl block">📱</span>
            <h4 className="font-bold text-sm text-slate-900">Instagram & TikTok</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Crie vídeos curtos a mostrar produtos, roupas Samakaka ou eletrónicos e coloque o seu link na biografia ou stories.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
            <span className="text-2xl block">👥</span>
            <h4 className="font-bold text-sm text-slate-900">Páginas de Facebook</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Divulgue em grupos angolanos de compra e venda com fotos profissionais fornecidas pela plataforma.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
            <span className="text-2xl block">🤝</span>
            <h4 className="font-bold text-sm text-slate-900">Recomendação Direta</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Alguém procura um presente ou telemóvel novo? Envie o seu link direto da AngolaMarket e garanta a comissão.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Regras do Programa (Item 13) */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">Regras Oficiais do Programa</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Aprovação Obrigatória:</strong> Todas as candidaturas passam pela análise da administração para garantir a segurança da comunidade.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Conclusão do Pedido:</strong> A comissão é registada como "Pendente" no momento da encomenda e transita para "Disponível" após a entrega bem-sucedida ao cliente.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Proibição de Práticas Abusivas:</strong> Não é permitido o envio de spam não solicitado ou divulgação de informações falsas sobre os produtos.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Levantamentos Transparentes:</strong> Os levantamentos são processados com uma taxa administrativa de {currentUser?.role === 'admin' ? '2%' : '2%'} para cobertura operacional bancária.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Perguntas Frequentes (FAQ) (Item 13) */}
      <section className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Perguntas Frequentes (FAQ)</h2>
          <p className="text-xs text-slate-500">Tire as suas dúvidas sobre o programa de afiliados</p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-4">
          <h3 className="text-xl sm:text-2xl font-extrabold">Pronto para Começar a Lucrar?</h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Junte-se à maior rede de afiliados do comércio eletrónico de Angola.
          </p>
          <div className="pt-2">
            {isAffiliate ? (
              <button
                onClick={() => navigate('/afiliado/dashboard')}
                className="px-8 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs transition shadow-md"
              >
                Aceder ao Dashboard de Afiliado
              </button>
            ) : isPending ? (
              <span className="inline-block px-6 py-3 rounded-xl bg-white/20 text-white font-bold text-xs">
                Candidatura enviada — Em análise
              </span>
            ) : (
              <button
                onClick={handleApply}
                className="px-8 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs transition shadow-md"
              >
                Quero ser afiliado
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
