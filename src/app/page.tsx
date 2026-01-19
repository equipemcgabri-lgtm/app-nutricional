'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, Shield, Star, TrendingUp, Users, Zap, CreditCard, Check, QrCode, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);

  const quizQuestions = [
    {
      question: "Qual é o seu principal objetivo?",
      options: [
        "Perder peso de forma saudável",
        "Controlar diabetes tipo 2",
        "Melhorar hábitos alimentares",
        "Acompanhar tratamento médico"
      ]
    },
    {
      question: "Você já utiliza algum medicamento para controle de peso?",
      options: [
        "Sim, Mounjaro",
        "Sim, outro medicamento",
        "Não, mas tenho interesse",
        "Não, apenas acompanhamento"
      ]
    },
    {
      question: "Como você prefere acompanhar seu progresso?",
      options: [
        "Gráficos e estatísticas detalhadas",
        "Registro diário simples",
        "Lembretes e notificações",
        "Todas as opções acima"
      ]
    }
  ];

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswers({ ...quizAnswers, [quizStep]: answer });
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz finalizado - mostrar página de pagamento
      setShowQuiz(false);
      setShowPayment(true);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setQuizStep(0);
    setQuizAnswers({});
  };

  const handleSelectPlan = (plan: 'monthly' | 'annual') => {
    setSelectedPlan(plan);
    setShowPayment(false);
    setShowCheckout(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Processando pagamento... Em breve você receberá acesso ao app!');
    // Aqui você integraria com gateway de pagamento (Stripe, Mercado Pago, etc)
  };

  const copyPixCode = () => {
    const pixCode = '00020126580014br.gov.bcb.pix013607117840196520400005303986540539.905802BR5925Gabriel Maier Mathei6009SAO PAULO62070503***63041D3D';
    
    // Método de fallback confiável sem usar Clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = pixCode;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Silenciosamente falha sem gerar erro no console
      console.log('Copiar não disponível');
    } finally {
      document.body.removeChild(textArea);
    }
  };

  // Página de Checkout (Formas de Pagamento)
  if (showCheckout && selectedPlan) {
    const planDetails = selectedPlan === 'monthly' 
      ? { name: 'Plano Mensal', price: 'R$ 39,90', period: '/mês' }
      : { name: 'Plano Anual', price: 'R$ 29,90', period: '/mês', total: 'R$ 358,80/ano' };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
              🔒 Checkout Seguro
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
              Finalizar Pagamento
            </h1>
            <p className="text-gray-600">
              {planDetails.name} - {planDetails.price}{planDetails.period}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário de Pagamento */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Escolha a forma de pagamento
                  </h2>

                  {/* Seleção de Método */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                        paymentMethod === 'pix'
                          ? 'border-blue-600 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <QrCode className={`w-8 h-8 mx-auto mb-2 ${
                        paymentMethod === 'pix' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <p className="font-semibold text-gray-800">PIX</p>
                      <p className="text-xs text-gray-500 mt-1">Aprovação instantânea</p>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('credit')}
                      className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                        paymentMethod === 'credit'
                          ? 'border-blue-600 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <CreditCard className={`w-8 h-8 mx-auto mb-2 ${
                        paymentMethod === 'credit' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <p className="font-semibold text-gray-800">Cartão de Crédito</p>
                      <p className="text-xs text-gray-500 mt-1">Parcelamento disponível</p>
                    </button>
                  </div>

                  {/* Formulário PIX */}
                  {paymentMethod === 'pix' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                        <div className="text-center mb-4">
                          <QrCode className="w-32 h-32 mx-auto text-gray-800 mb-4" />
                          <p className="text-sm text-gray-600 mb-2">
                            Escaneie o QR Code com o app do seu banco
                          </p>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Ou copie o código PIX:</p>
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-gray-100 p-2 rounded flex-1 overflow-x-auto">
                                00020126580014br.gov.bcb.pix0136071178...
                              </code>
                              <Button
                                size="sm"
                                onClick={copyPixCode}
                                className={`${
                                  copied 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                              >
                                {copied ? (
                                  <>
                                    <Check className="w-4 h-4 mr-1" />
                                    Copiado!
                                  </>
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-800 mb-1">
                            Valor: {planDetails.price}
                          </p>
                          <p className="text-xs text-gray-600">
                            Após o pagamento, seu acesso será liberado automaticamente
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={handlePaymentSubmit}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg"
                      >
                        Confirmar Pagamento PIX
                      </Button>
                    </div>
                  )}

                  {/* Formulário Cartão de Crédito */}
                  {paymentMethod === 'credit' && (
                    <form onSubmit={handlePaymentSubmit} className="space-y-6 animate-in fade-in duration-300">
                      <div>
                        <Label htmlFor="cardNumber" className="text-gray-700 font-semibold">
                          Número do Cartão
                        </Label>
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          required
                          className="mt-2 h-12 text-lg"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardName" className="text-gray-700 font-semibold">
                          Nome no Cartão
                        </Label>
                        <Input
                          id="cardName"
                          type="text"
                          placeholder="NOME COMPLETO"
                          required
                          className="mt-2 h-12"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry" className="text-gray-700 font-semibold">
                            Validade
                          </Label>
                          <Input
                            id="cardExpiry"
                            type="text"
                            placeholder="MM/AA"
                            maxLength={5}
                            required
                            className="mt-2 h-12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvv" className="text-gray-700 font-semibold">
                            CVV
                          </Label>
                          <Input
                            id="cardCvv"
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            required
                            className="mt-2 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardCpf" className="text-gray-700 font-semibold">
                          CPF do Titular
                        </Label>
                        <Input
                          id="cardCpf"
                          type="text"
                          placeholder="000.000.000-00"
                          maxLength={14}
                          required
                          className="mt-2 h-12"
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Parcelamento:</strong>
                        </p>
                        <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                          <option>1x de {planDetails.price} sem juros</option>
                          {selectedPlan === 'annual' && (
                            <>
                              <option>2x de R$ 179,40 sem juros</option>
                              <option>3x de R$ 119,60 sem juros</option>
                            </>
                          )}
                        </select>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg"
                      >
                        <CreditCard className="mr-2 w-5 h-5" />
                        Finalizar Pagamento
                      </Button>
                    </form>
                  )}

                  {!paymentMethod && (
                    <div className="text-center py-8 text-gray-500">
                      Selecione uma forma de pagamento acima
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    Resumo do Pedido
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>{planDetails.name}</span>
                      <span className="font-semibold">{planDetails.price}</span>
                    </div>
                    {selectedPlan === 'annual' && (
                      <div className="text-sm text-gray-600">
                        <p>Cobrança anual: {planDetails.total}</p>
                        <p className="text-emerald-600 font-semibold">
                          Economize R$ 240/ano
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-blue-600">{planDetails.price}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Acesso imediato após pagamento</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Garantia de 30 dias</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Cancele quando quiser</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Suporte prioritário</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>Pagamento 100% seguro</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => {
                setShowCheckout(false);
                setShowPayment(true);
                setPaymentMethod(null);
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Voltar para escolha de planos
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Página de Pagamento (Escolha de Planos)
  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
              🎉 Parabéns! Você está a um passo de transformar sua saúde
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
              Escolha seu Plano
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Acesso completo a todas as funcionalidades do app
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            {/* Plano Mensal */}
            <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">Plano Mensal</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      R$ 39,90
                    </span>
                    <span className="text-gray-500">/mês</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Cancele quando quiser
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Registro ilimitado de injeções com fotos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Acompanhamento nutricional completo</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Gráficos de progresso detalhados</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Notificações personalizadas</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Suporte prioritário</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Atualizações gratuitas</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectPlan('monthly')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CreditCard className="mr-2 w-5 h-5" />
                  Escolher Plano Mensal
                </Button>
              </CardContent>
            </Card>

            {/* Plano Anual - Destaque */}
            <Card className="border-4 border-gradient-to-r from-blue-600 to-indigo-600 relative hover:shadow-2xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-4 py-1 text-sm font-bold">
                  🔥 MAIS POPULAR - 40% OFF
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">Plano Anual</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                      R$ 29,90
                    </span>
                    <span className="text-gray-500">/mês</span>
                  </div>
                  <p className="text-sm text-gray-500 line-through mb-1">
                    R$ 49,90/mês
                  </p>
                  <p className="text-sm font-semibold text-emerald-600">
                    Economize R$ 240 por ano!
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Cobrado R$ 358,80 anualmente
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">Tudo do plano mensal +</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">40% de desconto permanente</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Acesso antecipado a novos recursos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Consultoria nutricional mensal (bônus)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Suporte VIP 24/7</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Garantia de 30 dias</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectPlan('annual')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <CreditCard className="mr-2 w-5 h-5" />
                  Escolher Plano Anual
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Garantias e Segurança */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold text-gray-800 mb-1">Pagamento Seguro</h4>
                    <p className="text-sm text-gray-600">Criptografia SSL de ponta a ponta</p>
                  </div>
                  <div>
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold text-gray-800 mb-1">Garantia de 30 dias</h4>
                    <p className="text-sm text-gray-600">Devolução do dinheiro sem perguntas</p>
                  </div>
                  <div>
                    <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-semibold text-gray-800 mb-1">+10.000 usuários</h4>
                    <p className="text-sm text-gray-600">Confiança comprovada</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => {
                setShowPayment(false);
                resetQuiz();
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Voltar para o início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz
  if (showQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-sm">
                  Pergunta {quizStep + 1} de {quizQuestions.length}
                </Badge>
                <button
                  onClick={resetQuiz}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Voltar
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {quizQuestions[quizStep].question}
            </h2>

            <div className="space-y-3">
              {quizQuestions[quizStep].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(option)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 group-hover:text-blue-700 font-medium">
                      {option}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
              🎯 Solução Completa para Seu Tratamento
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent leading-tight">
              Acompanhamento Nutricional Inteligente para Usuários de Mounjaro
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A ferramenta definitiva para usuários de Mounjaro e outros medicamentos. 
              Monitore suas injeções, nutrição e progresso em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => setShowQuiz(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-2"
              >
                Ver Demonstração
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ✨ Responda 3 perguntas rápidas antes de começar
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                R$ 39,90/mês
              </span>
              <span className="text-gray-600">• Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
              Por que escolher nosso app?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Desenvolvido especialmente para quem busca resultados reais e acompanhamento profissional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Registro Rápido</h3>
                <p className="text-gray-600">
                  Registre suas injeções com foto em segundos. Interface intuitiva e fácil de usar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Acompanhamento Completo</h3>
                <p className="text-gray-600">
                  Monitore proteínas, fibras e veja seu progresso em gráficos detalhados.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">100% Privado</h3>
                <p className="text-gray-600">
                  Seus dados ficam salvos localmente no seu dispositivo. Total privacidade.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Metas Personalizadas</h3>
                <p className="text-gray-600">
                  Defina suas metas diárias de proteína e fibra de acordo com seu tratamento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Suporte Dedicado</h3>
                <p className="text-gray-600">
                  Equipe pronta para ajudar você a alcançar seus objetivos de saúde.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Resultados Comprovados</h3>
                <p className="text-gray-600">
                  Milhares de usuários já transformaram sua saúde com nosso app.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
              O que nossos usuários dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Perdi 15kg em 3 meses acompanhando tudo pelo app. A facilidade de registrar as injeções com foto me ajudou muito!"
                </p>
                <p className="font-semibold text-gray-800">Maria Silva</p>
                <p className="text-sm text-gray-500">São Paulo, SP</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Finalmente consigo acompanhar minha ingestão de proteínas de forma simples. Os gráficos são incríveis!"
                </p>
                <p className="font-semibold text-gray-800">João Santos</p>
                <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Melhor investimento que fiz na minha saúde. O app me mantém motivada e organizada todos os dias."
                </p>
                <p className="font-semibold text-gray-800">Ana Costa</p>
                <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para transformar sua saúde?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão alcançando seus objetivos
          </p>
          <Button
            size="lg"
            onClick={() => setShowQuiz(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Responder Quiz e Começar
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-blue-100 mt-4">
            ⚡ Apenas 3 perguntas rápidas • Sem compromisso
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Acompanhamento Nutricional. Todos os direitos reservados.
          </p>
          <p className="text-xs mt-2">
            Este aplicativo é uma ferramenta de acompanhamento pessoal. Sempre consulte seu médico.
          </p>
        </div>
      </footer>
    </div>
  );
}
