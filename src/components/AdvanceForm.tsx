import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Banknote } from "lucide-react";

export interface AdvanceData {
  value: number;
  description: string;
  paymentMethod: string;
}

interface AdvanceFormProps {
  data: AdvanceData;
  onChange: (data: AdvanceData) => void;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function AdvanceForm({ data, onChange }: AdvanceFormProps) {
  const updateField = (field: keyof AdvanceData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Banknote className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Adiantamento</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="form-label">Valor do Adiantamento (R$)</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={data.value || ""}
            onChange={(e) =>
              updateField("value", parseFloat(e.target.value) || 0)
            }
          />
        </div>
        <div>
          <label className="form-label">Forma de Pagamento</label>
          <Input
            placeholder="PIX, Transferência, Dinheiro..."
            value={data.paymentMethod}
            onChange={(e) => updateField("paymentMethod", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="form-label">Observações</label>
        <Textarea
          placeholder="Observações sobre o adiantamento..."
          className="min-h-[100px] resize-none"
          value={data.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end pt-4 mt-6 border-t border-border">
        <div className="text-lg font-semibold">
          Total:{" "}
          <span className="total-display">R$ {formatCurrency(data.value)}</span>
        </div>
      </div>
    </div>
  );
}
