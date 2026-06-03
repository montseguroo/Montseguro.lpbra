import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import FormStep5 from "./FormStep5";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  nome: string;
  telefone: string;
  email: string;
  investimentoAtual: string;
  planoAtual: string;
  porteEmpresa: string;
  faixasEtarias: { [key: string]: number };
  hospitais: string;
}

const HeroSection = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    telefone: "",
    email: "",
    investimentoAtual: "",
    planoAtual: "",
    porteEmpresa: "",
    faixasEtarias: {},
    hospitais: "",
  });

  const handleStartForm = () => {
    setStep(1);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleStep1 = (data: { nome: string; telefone: string; email: string; investimentoAtual: string; planoAtual: string; porteEmpresa: string }) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2 = (data: { [key: string]: number }) => {
    setFormData(prev => ({ ...prev, faixasEtarias: data }));
    setStep(3);
  };

  const handleStep3 = (data: string) => {
    setFormData(prev => ({ ...prev, hospitais: data }));
    setStep(5);
  };

  const handleEdit = (editStep: number) => {
    setStep(editStep);
  };

  const formatFaixas = () => {
    const entries = Object.entries(formData.faixasEtarias).filter(([_, count]) => count > 0);
    return entries.map(([faixa, count]) => `${faixa}: ${count}`).join(", ") || "Nenhuma";
  };

  const getUtmParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
      utm_id: urlParams.get('utm_id') || '',
      gclid: urlParams.get('gclid') || '',
      keyword: urlParams.get('keyword') || '',
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      const utmParams = getUtmParams();
      
      // Campos principais
      formDataToSend.append("fields[name][value]", formData.nome);
      formDataToSend.append("fields[name][required]", "1");
      
      formDataToSend.append("fields[phone][value]", formData.telefone.replace(/\D/g, ''));
      formDataToSend.append("fields[phone][required]", "1");
      
      formDataToSend.append("fields[email][value]", formData.email || "");
      formDataToSend.append("fields[email][required]", "1");
      
      formDataToSend.append("fields[current_investment][value]", formData.investimentoAtual || "");
      formDataToSend.append("fields[current_investment][required]", "0");

      formDataToSend.append("fields[current_plan][value]", formData.planoAtual || "");
      formDataToSend.append("fields[current_plan][required]", "0");
      
      formDataToSend.append("fields[company_size][value]", formData.porteEmpresa);
      formDataToSend.append("fields[company_size][required]", "1");
      
      // Faixas etárias
      formDataToSend.append("fields[age_00-18][value]", String(formData.faixasEtarias["00-18"] || 0));
      formDataToSend.append("fields[age_19-23][value]", String(formData.faixasEtarias["19-23"] || 0));
      formDataToSend.append("fields[age_24-28][value]", String(formData.faixasEtarias["24-28"] || 0));
      formDataToSend.append("fields[age_29-33][value]", String(formData.faixasEtarias["29-33"] || 0));
      formDataToSend.append("fields[age_34-38][value]", String(formData.faixasEtarias["34-38"] || 0));
      formDataToSend.append("fields[age_39-43][value]", String(formData.faixasEtarias["39-43"] || 0));
      formDataToSend.append("fields[age_44-48][value]", String(formData.faixasEtarias["44-48"] || 0));
      formDataToSend.append("fields[age_49-53][value]", String(formData.faixasEtarias["49-53"] || 0));
      formDataToSend.append("fields[age_54-58][value]", String(formData.faixasEtarias["54-58"] || 0));
      formDataToSend.append("fields[age_59+][value]", String(formData.faixasEtarias["59+"] || 0));
      
      formDataToSend.append("fields[preferred_hospitals][value]", formData.hospitais || "");
      formDataToSend.append("fields[preferred_hospitals][required]", "0");
      
      // UTM params capturados da URL
      formDataToSend.append("fields[utm_source][value]", utmParams.utm_source);
      formDataToSend.append("fields[utm_source][required]", "0");
      formDataToSend.append("fields[utm_medium][value]", utmParams.utm_medium);
      formDataToSend.append("fields[utm_medium][required]", "0");
      formDataToSend.append("fields[utm_campaign][value]", utmParams.utm_campaign);
      formDataToSend.append("fields[utm_campaign][required]", "0");
      formDataToSend.append("fields[utm_term][value]", utmParams.utm_term);
      formDataToSend.append("fields[utm_term][required]", "0");
      formDataToSend.append("fields[utm_content][value]", utmParams.utm_content);
      formDataToSend.append("fields[utm_content][required]", "0");
      formDataToSend.append("fields[utm_id][value]", utmParams.utm_id);
      formDataToSend.append("fields[utm_id][required]", "0");
      formDataToSend.append("fields[gclid][value]", utmParams.gclid);
      formDataToSend.append("fields[gclid][required]", "0");
      formDataToSend.append("fields[keyword][value]", utmParams.keyword);
      formDataToSend.append("fields[keyword][required]", "0");
      
      // Total de vidas (soma de todas as faixas etárias)
      const totalVidas = Object.values(formData.faixasEtarias).reduce((sum, count) => sum + count, 0);
      formDataToSend.append("fields[Total de Vidas][value]", String(totalVidas));
      formDataToSend.append("fields[Total de Vidas][required]", "0");
      
      // Metadados
      const now = new Date();
      const registrationDate = now.toLocaleDateString('pt-BR');
      const registrationTime = now.toLocaleTimeString('pt-BR');
      
      formDataToSend.append("page_url", window.location.href);
      formDataToSend.append("user_agent", navigator.userAgent);
      formDataToSend.append("form_token", btoa(Date.now() + "-" + Math.random().toString(36).substring(2)));
      formDataToSend.append("timestamp", String(Date.now()));
      formDataToSend.append("fields[registration_date][value]", registrationDate);
      formDataToSend.append("fields[registration_time][value]", registrationTime);

      // Enviar para n8n
      await fetch("https://n8n.montseguro.link/webhook/planos", {
        method: "POST",
        mode: "no-cors",
        body: formDataToSend,
      });

      // Enviar para Google Sheets via backend e aguardar antes do redirect
      const sheetsPayload = {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        investimentoAtual: formData.investimentoAtual,
        porteEmpresa: formData.porteEmpresa,
        planoAtual: formData.planoAtual,
        faixasEtarias: formData.faixasEtarias,
        hospitais: formData.hospitais,
        ...utmParams,
      };

      const { error: sheetsError } = await supabase.functions.invoke("send-to-sheets", {
        body: sheetsPayload,
      });

      if (sheetsError) {
        throw new Error(sheetsError.message || "Erro ao enviar para Google Sheets");
      }

      // Push conversion event to GTM dataLayer
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'form_submission',
          form_name: 'cotacao_plano_saude',
          company_size: formData.porteEmpresa,
          ...utmParams
        });
      }

      window.location.href = "https://obrigado.montseguro.com.br/";
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao enviar seus dados. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <section className="hero-gradient min-h-[700px] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-primary-foreground">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span>O cuidado que</span><br />
              <span>sua família precisa</span>
            </h1>
            
            <p className="text-xl lg:text-2xl opacity-90 mb-8">
              Planos de saúde empresarial completo para você, sua<br />
              família e sua empresa.
            </p>

            <div className="discount-badge rounded-lg p-4 mb-8 max-w-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">💰</span>
                <span className="font-semibold">CNPJ: Até 40% de desconto</span>
              </div>
              <p className="text-sm opacity-80">
                Já tem plano? Podemos aproveitar carência a partir de 12 meses
              </p>
            </div>

            <button
              onClick={handleStartForm}
              className="inline-flex items-center gap-2 bg-card text-primary px-8 py-4 rounded-md font-semibold text-lg hover:bg-card/90 transition-colors"
            >
              Simule seu Plano de Saúde
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Form */}
          <div ref={formRef} className="flex justify-center lg:justify-end">
            
            {step === 1 && <FormStep1 onContinue={handleStep1} />}
            {step === 2 && <FormStep2 onContinue={handleStep2} onBack={() => setStep(1)} />}
            {step === 3 && <FormStep3 onContinue={handleStep3} onBack={() => setStep(2)} />}
            {step === 5 && (
              <FormStep5
                formData={formData}
                onEdit={handleEdit}
                onSubmit={handleSubmit}
                onBack={() => setStep(3)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Decorative overlay for doctor image effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }}
      />
    </section>
  );
};

export default HeroSection;
