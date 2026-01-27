import { memo, useMemo } from "react";
import { ReceiptInfo } from "./ReceiptInfoForm";
import { ServiceType } from "./ServicesSection";
import { ServiceValue } from "./ValuesSection";
import { ExpenseItem } from "./ExpensesForm";
import { AdvanceData } from "./AdvanceForm";
import { TabType } from "./TabNavigation";
import logoGuicheWeb from "@/assets/logo-guiche-web.png";

interface ReceiptPreviewLiveProps {
  receiptInfo: ReceiptInfo;
  activeTab: TabType;
  selectedServices: ServiceType[];
  serviceDescription: string;
  serviceValues: ServiceValue[];
  expenses: ExpenseItem[];
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

const formatDateExtended = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
};

const serviceLabels: Record<ServiceType, string> = {
  bilheteria: "Bilheteria",
  portaria: "Portaria",
  estacionamento: "Estacionamento",
  suporte: "Suporte Online",
  bar: "Bar",
};

export const ReceiptPreviewLive = memo(function ReceiptPreviewLive({
  receiptInfo,
  activeTab,
  selectedServices,
  serviceDescription,
  serviceValues,
  expenses,
  advanceData,
}: ReceiptPreviewLiveProps) {
  const getSubtotal = (expense: ExpenseItem): number => {
    if (expense.type === "quantity") {
      return expense.quantity * expense.value;
    }
    return expense.value;
  };

  const total = useMemo(() => {
    if (activeTab === "diarias") {
      return serviceValues.reduce((sum, v) => sum + v.quantity * v.value, 0);
    } else if (activeTab === "despesas") {
      return expenses.reduce((sum, e) => sum + getSubtotal(e), 0);
    } else {
      return advanceData.value;
    }
  }, [activeTab, serviceValues, expenses, advanceData.value]);

  const getEventDateText = () => {
    if (receiptInfo.tipoData === "periodo" && receiptInfo.dataEvento && receiptInfo.dataEventoFim) {
      return `no período de ${formatDate(receiptInfo.dataEvento)} a ${formatDate(receiptInfo.dataEventoFim)}`;
    } else if (receiptInfo.dataEvento) {
      return `no dia ${formatDate(receiptInfo.dataEvento)}`;
    }
    return "";
  };

  const getServicesText = () => {
    if (selectedServices.length === 0) return "";
    return selectedServices.map((s) => serviceLabels[s].toUpperCase()).join(" E ");
  };

  return (
    <div className="preview-panel p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Prévia em Tempo Real
        </h3>
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Atualização ao vivo" />
      </div>

      <div className="flex-1 overflow-hidden">
        <div 
          className="preview-paper p-6 origin-top-left"
          style={{ 
            transform: "scale(0.58)",
            width: "172%",
            height: "172%",
          }}
        >
          {/* Header */}
          <div className="mb-4">
            <div className="mb-3">
              <img
                alt="Guichê Web"
                className="h-20 w-auto object-contain"
                src={logoGuicheWeb}
              />
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">
              RECIBO
            </h1>
            <div className="bg-gray-800 text-white text-center py-1.5 font-bold text-sm">
              {activeTab === "diarias" && "RECEBIMENTO DE DIÁRIA"}
              {activeTab === "despesas" && "RECEBIMENTO DE DESPESAS"}
              {activeTab === "adiantamento" && "RECEBIMENTO DE ADIANTAMENTO"}
            </div>
          </div>

          {/* Main Text */}
          <div className="mb-4 text-justify leading-relaxed text-sm">
            <p>
              Eu, <strong>{receiptInfo.nomeCompleto || "[Nome Completo]"}</strong>, recebi do
              produtor <strong>{receiptInfo.produtor || "[Nome do Produtor]"}</strong>, a
              quantia de <strong>R$ {formatCurrency(total)}</strong> referente à prestação
              de serviços de <strong>{getServicesText() || serviceDescription || "[Serviços]"}</strong>{" "}
              do evento <strong>{receiptInfo.nomeEvento || "[Nome do Evento]"}</strong>{" "}
              {getEventDateText()}, na cidade de{" "}
              <strong>
                {receiptInfo.cidadeEvento}/{receiptInfo.estadoEvento || "[Cidade/UF]"}
              </strong>
              .
            </p>
          </div>

          {/* Signature */}
          <div className="text-center mb-4">
            <p className="mb-6 text-sm">
              {receiptInfo.cidadeRecibo || "[Cidade]"},{" "}
              {formatDateExtended(receiptInfo.dataRecibo) || "[Data]"}.
            </p>
            <div className="w-56 mx-auto border-t-2 border-black pt-1">
              <p className="font-bold text-sm">{receiptInfo.nomeCompleto || "[Nome Completo]"}</p>
              {receiptInfo.cpf && <p className="text-xs">CPF: {receiptInfo.cpf}</p>}
            </div>
          </div>

          {/* Services Table (simplified for preview) */}
          {activeTab === "diarias" && serviceValues.some(v => v.quantity > 0) && (
            <table className="w-full border-collapse mb-4 text-xs">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="border border-gray-400 p-1 text-left">SERVIÇO</th>
                  <th className="border border-gray-400 p-1 text-center w-16">QTD</th>
                  <th className="border border-gray-400 p-1 text-right w-20">VALOR</th>
                </tr>
              </thead>
              <tbody>
                {serviceValues.filter(v => v.quantity > 0).map((v) => (
                  <tr key={v.id} className="even:bg-gray-100">
                    <td className="border border-gray-400 p-1">{v.label}</td>
                    <td className="border border-gray-400 p-1 text-center">{v.quantity}</td>
                    <td className="border border-gray-400 p-1 text-right">
                      R$ {formatCurrency(v.quantity * v.value)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-200">
                  <td className="border border-gray-400 p-1" colSpan={2}>TOTAL</td>
                  <td className="border border-gray-400 p-1 text-right">
                    R$ {formatCurrency(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {/* Footer */}
          <div className="border-t border-gray-300 pt-2 text-center text-[10px] text-gray-600">
            <p className="font-bold">Guichê Web Comercialização de Ingressos Ltda.</p>
            <p>Av. Vale do Sol, 5236 – Salão 3 – Votuporanga/SP</p>
          </div>
        </div>
      </div>
    </div>
  );
});
