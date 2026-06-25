import { useState } from "react";
import StepIndicator from "./StepIndicator";

interface FormStep1Props {
  onContinue: (data: { nome: string; telefone: string; email: string; investimentoAtual: string; planoAtual: string; porteEmpresa: string }) => void;
}

const FormStep1 = ({ onContinue }: FormStep1Props) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [investimentoAtual, setInvestimentoAtual] = useState("");
  const [planoAtual, setPlanoAtual] = useState("");
  const [porteEmpresa, setPorteEmpresa] = useState("");

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
  };

  const handleSubmit = () => {
    const digits = telefone.replace(/\D/g, '');
    if (digits.length < 11) {
      alert("WhatsApp inválido. O número deve ter no mínimo 11 dígitos.");
      return;
    }
    const uniqueDigits = new Set(digits.split('')).size;
    if (uniqueDigits < 4) {
      alert("WhatsApp inválido.");
      return;
    }
    if (!nome || !email || !investimentoAtual || !planoAtual || !porteEmpresa) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    onContinue({ nome, telefone, email, investimentoAtual, planoAtual, porteEmpresa });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-md">
      <StepIndicator currentStep={1} totalSteps={4} />
      
      <h2 className="text-2xl font-bold text-primary-foreground text-center mb-8">
        Simule seu Plano de Saúde<br />usando seu CNPJ.
      </h2>

      <div onKeyDown={handleKeyDown} className="space-y-4">
        <div>
          <label className="block text-primary-foreground text-sm mb-2">Nome*</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
              setNome(value);
            }}
            placeholder="Digite aqui seu nome"
            className="w-full px-4 py-3 rounded-md bg-card text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-primary-foreground text-sm mb-2">Telefone com DDD *</label>
            <input
              type="tel"
              value={telefone}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className="w-full px-4 py-3 rounded-md bg-card text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-primary-foreground text-sm mb-2">Plano Atual *</label>
            <input
              type="text"
              value={planoAtual}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                setPlanoAtual(value);
              }}
              placeholder="Seu plano atual?"
              className="w-full px-4 py-3 rounded-md bg-card text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-primary-foreground text-sm mb-2">E-mail *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className="w-full px-4 py-3 rounded-md bg-card text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div>
          <label className="block text-primary-foreground text-sm mb-2">Quanto investe hoje em plano de saúde? *</label>
          <input
            type="text"
            value={investimentoAtual}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              if (!raw) { setInvestimentoAtual(''); return; }
              const value = (parseInt(raw, 10) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              setInvestimentoAtual(value);
            }}
            placeholder="R$ 0,00"
            className="w-full px-4 py-3 rounded-md bg-card text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div>
          <label className="block text-primary-foreground text-sm mb-2">Porte da Empresa *</label>
          <div className="relative">
            <select
              value={porteEmpresa}
              onChange={(e) => setPorteEmpresa(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-md bg-card text-foreground appearance-none cursor-pointer"
              required
            >
              <option value="" disabled>Selecione...</option>
              <option value="MEI">MEI</option>
              <option value="EI">EI</option>
              <option value="SLU">SLU</option>
              <option value="LTDA">LTDA</option>
              <option value="SA">SA</option>
              <option value="EIRELI">EIRELI</option>
            </select>
            <svg 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-4 bg-card text-primary font-semibold rounded-md hover:bg-card/90 transition-colors mt-6"
        >
          ENVIAR
        </button>

        <p className="text-primary-foreground/80 text-xs text-center mt-4">
          Ao enviar os seus dados pessoais, você fica ciente do Comunicado de<br />
          Privacidade e Termos de Uso e confirma que tem CNPJ.
        </p>
      </div>
    </div>
  );
};

export default FormStep1;
