import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { ReceiptInfo } from "./ReceiptInfoForm";
import { ServiceType } from "./ServicesSection";
import { ServiceValue } from "./ValuesSection";
import { Expense } from "./ExpensesForm";
import { AdvanceData } from "./AdvanceForm";
import { TabType } from "./TabNavigation";

interface ReceiptPreviewProps {
  open: boolean;
  onClose: () => void;
  receiptInfo: ReceiptInfo;
  activeTab: TabType;
  selectedServices: ServiceType[];
  serviceDescription: string;
  serviceValues: ServiceValue[];
  expenses: Expense[];
  advanceData: AdvanceData;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR");
};

const serviceLabels: Record<ServiceType, string> = {
  bilheteria: "Bilheteria",
  portaria: "Portaria",
  estacionamento: "Estacionamento",
  suporte: "Suporte Online",
  bar: "Bar",
};

export function ReceiptPreview({
  open,
  onClose,
  receiptInfo,
  activeTab,
  selectedServices,
  serviceDescription,
  serviceValues,
  expenses,
  advanceData,
}: ReceiptPreviewProps) {
  const getTotal = () => {
    if (activeTab === "diarias") {
      return serviceValues.reduce((sum, v) => sum + v.quantity * v.value, 0);
    } else if (activeTab === "despesas") {
      return expenses.reduce((sum, e) => sum + e.value, 0);
    } else {
      return advanceData.value;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible">
        <DialogHeader className="print:hidden">
          <DialogTitle>Prévia do Recibo</DialogTitle>
        </DialogHeader>

        <div className="bg-card p-8 rounded-lg border border-border print:border-none print:p-0">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">RECIBO</h1>
            <p className="text-muted-foreground">
              {activeTab === "diarias" && "Diárias"}
              {activeTab === "despesas" && "Despesas"}
              {activeTab === "adiantamento" && "Adiantamento"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="text-muted-foreground">Nome:</span>
              <p className="font-medium">{receiptInfo.nomeCompleto || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">CPF:</span>
              <p className="font-medium">{receiptInfo.cpf || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Evento:</span>
              <p className="font-medium">{receiptInfo.nomeEvento || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Data do Evento:</span>
              <p className="font-medium">
                {formatDate(receiptInfo.dataEvento) || "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Local:</span>
              <p className="font-medium">
                {receiptInfo.cidadeEvento && receiptInfo.estadoEvento
                  ? `${receiptInfo.cidadeEvento} - ${receiptInfo.estadoEvento}`
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Produtor:</span>
              <p className="font-medium">{receiptInfo.produtor || "-"}</p>
            </div>
          </div>

          {activeTab === "diarias" && (
            <>
              {selectedServices.length > 0 && (
                <div className="mb-6">
                  <p className="text-muted-foreground text-sm mb-2">
                    Serviços:
                  </p>
                  <p className="font-medium">
                    {selectedServices
                      .map((s) => serviceLabels[s])
                      .join(", ")}
                  </p>
                </div>
              )}

              {serviceDescription && (
                <div className="mb-6">
                  <p className="text-muted-foreground text-sm mb-2">
                    Descrição:
                  </p>
                  <p className="text-foreground">{serviceDescription}</p>
                </div>
              )}

              <table className="w-full text-sm mb-6">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2">Descrição</th>
                    <th className="text-center py-2">Qtd</th>
                    <th className="text-right py-2">Valor</th>
                    <th className="text-right py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceValues
                    .filter((v) => v.quantity > 0 && v.value > 0)
                    .map((v) => (
                      <tr key={v.id} className="border-b border-border/50">
                        <td className="py-2">{v.label}</td>
                        <td className="text-center py-2">{v.quantity}</td>
                        <td className="text-right py-2">
                          R$ {formatCurrency(v.value)}
                        </td>
                        <td className="text-right py-2">
                          R$ {formatCurrency(v.quantity * v.value)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "despesas" && (
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Descrição</th>
                  <th className="text-right py-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {expenses
                  .filter((e) => e.value > 0)
                  .map((e) => (
                    <tr key={e.id} className="border-b border-border/50">
                      <td className="py-2">{e.description || "-"}</td>
                      <td className="text-right py-2">
                        R$ {formatCurrency(e.value)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {activeTab === "adiantamento" && (
            <div className="mb-6">
              {advanceData.paymentMethod && (
                <div className="mb-4">
                  <p className="text-muted-foreground text-sm">
                    Forma de Pagamento:
                  </p>
                  <p className="font-medium">{advanceData.paymentMethod}</p>
                </div>
              )}
              {advanceData.description && (
                <div>
                  <p className="text-muted-foreground text-sm">Observações:</p>
                  <p>{advanceData.description}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end text-xl font-bold border-t border-border pt-4">
            Total: R$ {formatCurrency(getTotal())}
          </div>

          <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>
                {receiptInfo.cidadeRecibo && receiptInfo.estadoRecibo
                  ? `${receiptInfo.cidadeRecibo} - ${receiptInfo.estadoRecibo}`
                  : ""}
              </span>
              <span>{formatDate(receiptInfo.dataRecibo)}</span>
            </div>
            {receiptInfo.pix && (
              <div className="mt-2">
                <span>PIX: {receiptInfo.pix}</span>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-dashed border-border text-center">
            <div className="w-64 mx-auto border-t border-foreground pt-2">
              <p className="font-medium">{receiptInfo.nomeCompleto}</p>
              {receiptInfo.cpf && (
                <p className="text-sm text-muted-foreground">
                  CPF: {receiptInfo.cpf}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 print:hidden">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          <Button onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Imprimir / Salvar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
