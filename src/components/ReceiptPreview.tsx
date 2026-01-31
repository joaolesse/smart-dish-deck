import { memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { ReceiptInfo } from "./ReceiptInfoForm";
import { ServiceType } from "./ServicesSection";
import { ServiceValue } from "./ValuesSection";
import { ExpenseItem } from "./ExpensesForm";
import { AdvanceData } from "./AdvanceForm";
import { TabType } from "./TabNavigation";
import logoGuicheWeb from "@/assets/logo-guiche-web.png";

interface ReceiptPreviewProps {
  open: boolean;
  onClose: () => void;
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
    maximumFractionDigits: 2
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
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
};

const numberToWords = (num: number): string => {
  const units = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const teens = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const tens = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const hundreds = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
  
  if (num === 0) return "zero";
  if (num === 100) return "cem";
  
  let words = "";
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    if (thousands === 1) {
      words += "mil";
    } else {
      words += units[thousands] + " mil";
    }
    num %= 1000;
    if (num > 0) words += " e ";
  }
  if (num >= 100) {
    words += hundreds[Math.floor(num / 100)];
    num %= 100;
    if (num > 0) words += " e ";
  }
  if (num >= 20) {
    words += tens[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) words += " e ";
  }
  if (num >= 10) {
    words += teens[num - 10];
    num = 0;
  }
  if (num > 0) {
    words += units[num];
  }
  return words;
};

const formatCurrencyWords = (value: number): string => {
  const intPart = Math.floor(value);
  const centPart = Math.round((value - intPart) * 100);
  let result = numberToWords(intPart);
  if (intPart === 1) {
    result += " real";
  } else {
    result += " reais";
  }
  if (centPart > 0) {
    result += " e " + numberToWords(centPart);
    if (centPart === 1) {
      result += " centavo";
    } else {
      result += " centavos";
    }
  }
  return result;
};

const serviceLabels: Record<ServiceType, string> = {
  bilheteria: "Bilheteria",
  portaria: "Portaria",
  estacionamento: "Estacionamento",
  suporte: "Suporte Online",
  bar: "Bar"
};

export const ReceiptPreview = memo(function ReceiptPreview({
  open,
  onClose,
  receiptInfo,
  activeTab,
  selectedServices,
  serviceDescription,
  serviceValues,
  expenses,
  advanceData
}: ReceiptPreviewProps) {
  // Early return - não processa nada quando fechado
  if (!open) return null;

  const getSubtotal = (expense: ExpenseItem): number => {
    if (expense.type === "quantity") {
      return expense.quantity * expense.value;
    }
    return expense.value;
  };

  const getTotal = () => {
    if (activeTab === "diarias") {
      return serviceValues.reduce((sum, v) => sum + v.quantity * v.value, 0);
    } else if (activeTab === "despesas") {
      return expenses.reduce((sum, e) => sum + getSubtotal(e), 0);
    } else {
      return advanceData.value;
    }
  };

  const total = getTotal();

  const handlePrint = () => {
    window.print();
  };

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
    const services = selectedServices.map(s => serviceLabels[s].toUpperCase());
    if (services.length === 1) return services[0];
    if (services.length === 2) return `${services[0]} e ${services[1]}`;
    return `${services.slice(0, -1).join(", ")} e ${services[services.length - 1]}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>Prévia do Recibo</DialogTitle>
        </DialogHeader>

        <div className="bg-white text-black p-8 print:p-0" id="receipt-content">
          {/* Header - Layout Vertical */}
          <div className="mb-6">
            {/* Logo no topo esquerdo */}
            <div className="mb-4">
              <img 
                alt="Guichê Web" 
                className="h-28 w-auto object-contain" 
                src={logoGuicheWeb} 
              />
            </div>
            
            {/* Título centralizado */}
            <h1 className="text-2xl font-bold text-gray-800 mb-3 text-center">
              RECIBO
            </h1>
            
            {/* Barra de tipo */}
            <div className="bg-gray-800 text-white text-center py-2 font-bold text-base">
              {activeTab === "diarias" && "RECEBIMENTO DE DIÁRIA"}
              {activeTab === "despesas" && "RECEBIMENTO DE DESPESAS"}
              {activeTab === "adiantamento" && "RECEBIMENTO DE ADIANTAMENTO"}
            </div>
          </div>

          {/* Main Text */}
          <div className="mb-6 text-justify leading-relaxed">
            <p>
              Eu, <strong>{receiptInfo.nomeCompleto || "[Nome Completo]"}</strong>, recebi do
              produtor{" "}
              <strong>{receiptInfo.produtor || "[Nome do Produtor]"}</strong>, a quantia de{" "}
              <strong>R$ {formatCurrency(total)}</strong> ({formatCurrencyWords(total)}) referente à
              prestação de serviços de{" "}
              <strong>{getServicesText() || serviceDescription || "[Serviços]"}</strong> do evento{" "}
              <strong>{receiptInfo.nomeEvento || "[Nome do Evento]"}</strong>{" "}
              {getEventDateText()}, na cidade de{" "}
              <strong>
                {receiptInfo.cidadeEvento}/{receiptInfo.estadoEvento || "[Cidade/UF]"}
              </strong>
              .
            </p>
          </div>

          {/* Signature */}
          <div className="text-center mb-8">
            <p className="mb-12">
              {receiptInfo.cidadeRecibo || "[Cidade]"},{" "}
              {formatDateExtended(receiptInfo.dataRecibo) || "[Data]"}.
            </p>
            <div className="w-72 mx-auto border-t-2 border-black pt-2">
              <p className="font-bold">{receiptInfo.nomeCompleto || "[Nome Completo]"}</p>
              {receiptInfo.cpf && <p>CPF: {receiptInfo.cpf}</p>}
            </div>
          </div>

          {/* Services Table */}
          {activeTab === "diarias" && (
            <table className="w-full border-collapse mb-6 text-sm">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="border border-gray-400 p-2 text-left">SERVIÇO</th>
                  <th className="border border-gray-400 p-2 text-center w-24">QUANTIDADE</th>
                  <th className="border border-gray-400 p-2 text-right w-28">VALOR</th>
                  <th className="border border-gray-400 p-2 text-right w-28">VALOR PAGO</th>
                </tr>
              </thead>
              <tbody>
                {serviceValues.map(v => {
                  const subtotal = v.quantity * v.value;
                  return (
                    <tr key={v.id} className="even:bg-gray-100">
                      <td className="border border-gray-400 p-2">{v.label.toUpperCase()}</td>
                      <td className="border border-gray-400 p-2 text-center">
                        {v.quantity > 0 ? v.quantity : ""}
                      </td>
                      <td className="border border-gray-400 p-2 text-right">
                        R$ {formatCurrency(v.value)}
                      </td>
                      <td className="border border-gray-400 p-2 text-right">
                        R$ {formatCurrency(subtotal)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="font-bold bg-gray-200">
                  <td className="border border-gray-400 p-2" colSpan={3}>
                    TOTAL
                  </td>
                  <td className="border border-gray-400 p-2 text-right">
                    R$ {formatCurrency(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "despesas" && (
            <table className="w-full border-collapse mb-6 text-sm">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="border border-gray-400 p-2 text-left">DESCRIÇÃO</th>
                  <th className="border border-gray-400 p-2 text-center w-24">QUANTIDADE</th>
                  <th className="border border-gray-400 p-2 text-right w-28">VALOR UNIT.</th>
                  <th className="border border-gray-400 p-2 text-right w-28">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {expenses.filter(e => getSubtotal(e) > 0).map(e => {
                  const subtotal = getSubtotal(e);
                  return (
                    <tr key={e.id} className="even:bg-gray-100">
                      <td className="border border-gray-400 p-2">{e.label.replace(" (R$)", "").toUpperCase()}</td>
                      <td className="border border-gray-400 p-2 text-center">
                        {e.type === "quantity" && e.quantity > 0 ? e.quantity : "-"}
                      </td>
                      <td className="border border-gray-400 p-2 text-right">
                        R$ {formatCurrency(e.value)}
                      </td>
                      <td className="border border-gray-400 p-2 text-right">
                        R$ {formatCurrency(subtotal)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="font-bold bg-gray-200">
                  <td className="border border-gray-400 p-2" colSpan={3}>TOTAL</td>
                  <td className="border border-gray-400 p-2 text-right">
                    R$ {formatCurrency(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "adiantamento" && (
            <table className="w-full border-collapse mb-6 text-sm">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="border border-gray-400 p-2 text-left">DESCRIÇÃO</th>
                  <th className="border border-gray-400 p-2 text-right w-32">VALOR</th>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-gray-100">
                  <td className="border border-gray-400 p-2">
                    Adiantamento - {advanceData.paymentMethod || "N/A"}
                    {advanceData.description && (
                      <span className="block text-gray-600 text-xs mt-1">
                        {advanceData.description}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-400 p-2 text-right">
                    R$ {formatCurrency(advanceData.value)}
                  </td>
                </tr>
                <tr className="font-bold bg-gray-200">
                  <td className="border border-gray-400 p-2">TOTAL</td>
                  <td className="border border-gray-400 p-2 text-right">
                    R$ {formatCurrency(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {/* PIX */}
          {receiptInfo.pix && (
            <div className="mb-6">
              <p className="font-bold">PIX: {receiptInfo.pix}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-4 text-center text-xs text-gray-600">
            <p className="font-bold">Guichê Web Comercialização de Ingressos Ltda.</p>
            <p>Av. Vale do Sol, 5236 – Salão 3 – Bairro Vale do Sol – Votuporanga/SP</p>
            <p>CEP: 15.500-269</p>
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
});
