import StepIndicator from "./StepIndicator";
import { ArrowLeft } from "lucide-react";

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

interface FormStep5Props {
  formData: FormData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const FormStep5 = ({ formData, onEdit, onSubmit, onBack }: FormStep5Props) => {
  const formatFaixas = () => {
    const entries = Object.entries(formData.faixasEtarias).filter(([_, count]) => count > 0);
    return entries.map(([faixa, count]) => `${faixa}: ${count}`).join(", ") || "Nenhuma";
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="w-full max-w-md">
      <StepIndicator currentStep={4} totalSteps={4} />
      
      <h2 className="text-2xl font-bold text-primary-foreground text-center mb-6">
        Confirme seus dados
      </h2>

      <div>
        <div className="bg-primary-foreground/10 rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="py-3 px-4 flex justify-between items-start">
            <div>
              <span className="text-primary-foreground/70 text-sm">Nome</span>
              <p className="text-primary-foreground font-medium">{formData.nome || "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(1)}
              className="text-primary-foreground text-sm font-medium hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="py-3 px-4 flex justify-between items-start">
            <div>
              <span className="text-primary-foreground/70 text-sm">Telefone</span>
              <p className="text-primary-foreground font-medium">{formData.telefone || "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(1)}
              className="text-primary-foreground text-sm font-medium hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="py-3 px-4 flex justify-between items-start">
            <div>
              <span className="text-primary-foreground/70 text-sm">E-mail</span>
              <p className="text-primary-foreground font-medium">{formData.email || "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(1)}
              className="text-primary-foreground text-sm font-medium hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="py-3 px-4 flex justify-between items-start">
            <div>
              <span className="text-primary-foreground/70 text-sm">Investimento Atual</span>
              <p className="text-primary-foreground font-medium">{formData.investimentoAtual || "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(1)}
              className="text-primary-foreground text-sm font-medium hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="py-3 px-4 flex justify-between items-start">
            <div>
              <span className="text-primary-foreground/70 text-sm">Plano Atual</span>
              <p className="text-primary-foreground font-medium">{formData.planoAtual || "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(1)}
              className="text-primary-foreground text-sm font-medium hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="py-3 px-4 flex justify-between items-start">
            <div>
              <span className="text-primary-foreground/70 text-sm">Porte da Empresa</span>
              <p className="text-primary-foreground font-medium">{formData.porteEmpresa || "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(1)}
              className="text-primary-foreground text-sm font-medium hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="py-3 px-4 flex justify-between items-start">
            <div>
              <span className="text-primary-foreground/70 text-sm">Faixas Etárias</span>
              <p className="text-primary-foreground font-medium">{formatFaixas()}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(2)}
              className="text-primary-foreground text-sm font-medium hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="py-3 px-4 flex justify-between items-start">
            <div>
              <span className="text-primary-foreground/70 text-sm">Hospitais de Preferência</span>
              <p className="text-primary-foreground font-medium">{formData.hospitais || "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(3)}
              className="text-primary-foreground text-sm font-medium hover:underline"
            >
              Editar
            </button>
          </div>

        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="submit"
            className="w-full py-4 bg-card text-primary font-semibold rounded-md hover:bg-card/90 transition-colors"
          >
            CONFIRMAR E ENVIAR
          </button>
          <button
            type="button"
            onClick={() => onBack()}
            className="flex items-center justify-center gap-2 text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormStep5;
