import { Input } from "@/components/ui/input";
import { Wallet } from "lucide-react";

export interface ExpenseItem {
  id: string;
  label: string;
  type: "single" | "quantity"; // single = apenas valor, quantity = quantidade + valor
  quantity: number;
  value: number;
}

interface ExpensesFormProps {
  expenses: ExpenseItem[];
  onChange: (expenses: ExpenseItem[]) => void;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function ExpensesForm({ expenses, onChange }: ExpensesFormProps) {
  const updateExpense = (id: string, field: keyof ExpenseItem, value: number) => {
    onChange(
      expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const getSubtotal = (expense: ExpenseItem): number => {
    if (expense.type === "quantity") {
      return expense.quantity * expense.value;
    }
    return expense.value;
  };

  const total = expenses.reduce((sum, e) => sum + getSubtotal(e), 0);

  // Separate by type for layout
  const singleExpenses = expenses.filter((e) => e.type === "single");
  const quantityExpenses = expenses.filter((e) => e.type === "quantity");

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Valores das Despesas</h2>
      </div>

      {/* Grid for single value expenses (first row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {singleExpenses.slice(0, 3).map((expense) => (
          <div
            key={expense.id}
            className="p-4 rounded-lg bg-muted/50 border border-border"
          >
            <label className="form-label text-primary font-medium">{expense.label}</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={expense.value || ""}
              onChange={(e) =>
                updateExpense(expense.id, "value", parseFloat(e.target.value) || 0)
              }
              className="mt-2"
            />
          </div>
        ))}
      </div>

      {/* Grid for quantity expenses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {quantityExpenses.map((expense) => (
          <div
            key={expense.id}
            className="p-4 rounded-lg bg-muted/50 border border-border"
          >
            <label className="form-label text-primary font-medium">{expense.label}</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Quantidade</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={expense.quantity || ""}
                  onChange={(e) =>
                    updateExpense(expense.id, "quantity", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Valor</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={expense.value || ""}
                  onChange={(e) =>
                    updateExpense(expense.id, "value", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <p className="text-right text-sm text-primary mt-2">
              Subtotal: {formatCurrency(getSubtotal(expense))}
            </p>
          </div>
        ))}
      </div>

      {/* Grid for remaining single value expenses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {singleExpenses.slice(3).map((expense) => (
          <div
            key={expense.id}
            className="p-4 rounded-lg bg-muted/50 border border-border"
          >
            <label className="form-label text-primary font-medium">{expense.label}</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={expense.value || ""}
              onChange={(e) =>
                updateExpense(expense.id, "value", parseFloat(e.target.value) || 0)
              }
              className="mt-2"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-border">
        <div className="text-lg font-semibold">
          Total:{" "}
          <span className="total-display">R$ {formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
