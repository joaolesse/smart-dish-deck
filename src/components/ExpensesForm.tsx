import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface Expense {
  id: string;
  description: string;
  value: number;
}

interface ExpensesFormProps {
  expenses: Expense[];
  onChange: (expenses: Expense[]) => void;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function ExpensesForm({ expenses, onChange }: ExpensesFormProps) {
  const addExpense = () => {
    onChange([
      ...expenses,
      { id: crypto.randomUUID(), description: "", value: 0 },
    ]);
  };

  const removeExpense = (id: string) => {
    onChange(expenses.filter((e) => e.id !== id));
  };

  const updateExpense = (id: string, field: keyof Expense, value: string | number) => {
    onChange(
      expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const total = expenses.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Despesas</h2>
        </div>
        <Button onClick={addExpense} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>

      {expenses.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Nenhuma despesa adicionada. Clique em "Adicionar" para começar.
        </p>
      ) : (
        <div className="space-y-4 mb-6">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex gap-4 items-start p-4 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex-1">
                <label className="form-label">Descrição</label>
                <Input
                  placeholder="Descrição da despesa"
                  value={expense.description}
                  onChange={(e) =>
                    updateExpense(expense.id, "description", e.target.value)
                  }
                />
              </div>
              <div className="w-32">
                <label className="form-label">Valor (R$)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={expense.value || ""}
                  onChange={(e) =>
                    updateExpense(
                      expense.id,
                      "value",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="mt-6 text-destructive hover:text-destructive"
                onClick={() => removeExpense(expense.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end pt-4 border-t border-border">
        <div className="text-lg font-semibold">
          Total:{" "}
          <span className="total-display">R$ {formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
