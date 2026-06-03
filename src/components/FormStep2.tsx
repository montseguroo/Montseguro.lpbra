import { useState } from "react";
import StepIndicator from "./StepIndicator";
import AgeCounter from "./AgeCounter";
import { ArrowLeft } from "lucide-react";

interface AgeData {
  [key: string]: number;
}

interface FormStep2Props {
  onContinue: (data: AgeData) => void;
  onBack: () => void;
}

const FormStep2 = ({ onContinue, onBack }: FormStep2Props) => {
  const [ages, setAges] = useState<AgeData>({
    "00-18": 0,
    "19-23": 0,
    "24-28": 0,
    "29-33": 0,
    "34-38": 0,
    "39-43": 0,
    "44-48": 0,
    "49-53": 0,
    "54-58": 0,
    "59+": 0,
  });
  const [error, setError] = useState("");

  const updateAge = (key: string, value: number) => {
    setAges(prev => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Object.values(ages).reduce((sum, v) => sum + v, 0);
    if (total < 1) {
      setError("Selecione pelo menos 1 vida.");
      return;
    }
    onContinue(ages);
  };


  return (
    <div className="w-full max-w-md">
      <StepIndicator currentStep={2} totalSteps={4} />
      
      <h2 className="text-2xl font-bold text-primary-foreground text-center mb-8">
        Quais seriam as idades que<br />gostaria de adicionar ao plano?
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.keys(ages).map(range => (
            <AgeCounter
              key={range}
              label={range}
              value={ages[range]}
              onChange={(value) => updateAge(range, value)}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-300 text-sm text-center font-medium">{error}</p>
        )}

        <div className="flex flex-col gap-3 mt-6">
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

export default FormStep2;
