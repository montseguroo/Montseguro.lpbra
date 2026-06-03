import { useState } from "react";
import StepIndicator from "./StepIndicator";
import { ArrowLeft } from "lucide-react";

interface FormStep3Props {
  onContinue: (data: string) => void;
  onBack: () => void;
}

const FormStep3 = ({ onContinue, onBack }: FormStep3Props) => {
  const [hospitais, setHospitais] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(hospitais);
  };

  return (
    <div className="w-full max-w-md">
      <StepIndicator currentStep={3} totalSteps={4} />
      
      <h2 className="text-2xl font-bold text-primary-foreground text-center mb-8">
        Possui hospitais ou regiões de<br />preferência?
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-primary-foreground text-sm mb-2">
            Hospitais ou Regiões de Preferência *
          </label>
          <textarea
            value={hospitais}
            onChange={(e) => setHospitais(e.target.value)}
            placeholder="Ex: Hospital Albert Einstein, Sírio-Libanês, Zona Sul de SP..."
            className="w-full px-4 py-3 rounded-md bg-card text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="w-full py-4 bg-card text-primary font-semibold rounded-md hover:bg-card/90 transition-colors"
          >
            CONTINUAR
          </button>
          <button
            type="button"
            onClick={onBack}
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

export default FormStep3;
