import { Input } from "@/components/ui/input";
import { Briefcase } from "lucide-react";

export interface ServiceValue {
  id: string;
  label: string;
  quantity: number;
  value: number;
}

interface ValuesSectionProps {
  values: ServiceValue[];
  onChange: (values: ServiceValue[]) => void;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function ValuesSection({ values, onChange }: ValuesSectionProps) {
  const updateValue = (
    id: string,
    field: "quantity" | "value",
    newValue: number
  ) => {
    onChange(
      values.map((v) => (v.id === id ? { ...v, [field]: newValue } : v))
    );
  };

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Valores dos Serviços
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {values.map((item) => {
          const subtotal = item.quantity * item.value;
          return (
            <div key={item.id} className="value-row flex-col items-stretch">
              <div className="font-medium text-foreground mb-3">
                {item.label}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Quantidade</label>
                  <Input
                    type="number"
                    min="0"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateValue(
                        item.id,
                        "quantity",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    className="bg-background/80"
                  />
                </div>
                <div>
                  <label className="form-label">Valor</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.value || ""}
                    onChange={(e) =>
                      updateValue(
                        item.id,
                        "value",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0,00"
                    className="bg-background/80"
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-3">
                Subtotal:{" "}
                <span className="font-medium text-primary">
                  R$ {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
