import { useState, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import { TabNavigation, TabType } from "@/components/TabNavigation";
import { ReceiptInfoForm, ReceiptInfo } from "@/components/ReceiptInfoForm";
import { ServicesSection, ServiceType } from "@/components/ServicesSection";
import { ValuesSection, ServiceValue } from "@/components/ValuesSection";
import { ExpensesForm, ExpenseItem } from "@/components/ExpensesForm";
import { AdvanceForm, AdvanceData } from "@/components/AdvanceForm";
import { StickyTotalBar } from "@/components/StickyTotalBar";
import { ReceiptPreview } from "@/components/ReceiptPreview";
import { ReceiptPreviewLive } from "@/components/ReceiptPreviewLive";
import { useToast } from "@/hooks/use-toast";

const initialReceiptInfo: ReceiptInfo = {
  nomeCompleto: "",
  cpf: "",
  produtor: "",
  nomeEvento: "",
  tipoData: "unico",
  dataEvento: "",
  dataEventoFim: "",
  estadoEvento: "",
  cidadeEvento: "",
  pix: "",
  dataRecibo: "",
  estadoRecibo: "",
  cidadeRecibo: "",
};

const initialServiceValues: ServiceValue[] = [
  { id: "instalacao", label: "Instalação PDV", quantity: 0, value: 0 },
  { id: "horaExtra", label: "Hora Extra", quantity: 0, value: 0 },
  { id: "diariaEvento", label: "Diária Evento", quantity: 0, value: 0 },
  { id: "diariaDeslocamento", label: "Diária Deslocamento", quantity: 0, value: 0 },
  { id: "horaExtraDeslocamento", label: "Hora Extra Deslocamento", quantity: 0, value: 0 },
];

const initialExpenses: ExpenseItem[] = [
  { id: "hospedagem", label: "Hospedagem (R$)", type: "single", quantity: 0, value: 0 },
  { id: "transporte", label: "Transporte (R$)", type: "single", quantity: 0, value: 0 },
  { id: "combustivel", label: "Combustível (R$)", type: "single", quantity: 0, value: 0 },
  { id: "alimentacao", label: "Alimentação", type: "quantity", quantity: 0, value: 0 },
  { id: "cafeManha", label: "Café da Manhã", type: "quantity", quantity: 0, value: 0 },
  { id: "alimentacaoAeroporto", label: "Alimentação Aeroporto", type: "quantity", quantity: 0, value: 0 },
  { id: "pedagio", label: "Pedágio (R$)", type: "single", quantity: 0, value: 0 },
  { id: "outros", label: "Outros (R$)", type: "single", quantity: 0, value: 0 },
];

const initialAdvanceData: AdvanceData = {
  value: 0,
  description: "",
  paymentMethod: "",
};

export default function Index() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("diarias");
  const [receiptInfo, setReceiptInfo] = useState<ReceiptInfo>(initialReceiptInfo);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceValues, setServiceValues] = useState<ServiceValue[]>(initialServiceValues);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [advanceData, setAdvanceData] = useState<AdvanceData>(initialAdvanceData);
  const [showPreview, setShowPreview] = useState(false);

  const handleReceiptInfoChange = useCallback((info: ReceiptInfo) => {
    setReceiptInfo(info);
  }, []);

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

  const handleGenerateReceipt = () => {
    if (!receiptInfo.nomeCompleto.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o nome completo.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex flex-col xl:flex-row min-h-[calc(100vh-120px)]">
        {/* Left Column - Form */}
        <div className="w-full xl:w-3/5 overflow-y-auto pb-24">
          <div className="container py-4 sm:py-6 md:py-8 px-4 sm:px-6">
            <div className="max-w-4xl">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <ReceiptInfoForm data={receiptInfo} onChange={handleReceiptInfoChange} />

                {activeTab === "diarias" && (
                  <>
                    <ServicesSection
                      selectedServices={selectedServices}
                      onServicesChange={setSelectedServices}
                      description={serviceDescription}
                      onDescriptionChange={setServiceDescription}
                    />
                    <ValuesSection values={serviceValues} onChange={setServiceValues} />
                  </>
                )}

                {activeTab === "despesas" && (
                  <ExpensesForm expenses={expenses} onChange={setExpenses} />
                )}

                {activeTab === "adiantamento" && (
                  <AdvanceForm data={advanceData} onChange={setAdvanceData} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Live Preview (Desktop only) */}
        <div className="hidden xl:block w-2/5 bg-muted/30 p-4 lg:p-6 sticky top-0 h-[calc(100vh-120px)] overflow-hidden">
          <ReceiptPreviewLive
            receiptInfo={receiptInfo}
            activeTab={activeTab}
            selectedServices={selectedServices}
            serviceDescription={serviceDescription}
            serviceValues={serviceValues}
            expenses={expenses}
            advanceData={advanceData}
          />
        </div>
      </main>

      {/* Sticky Footer */}
      <StickyTotalBar
        total={total}
        onGenerate={handleGenerateReceipt}
        onPreview={() => setShowPreview(true)}
        showPreviewButton={true}
      />

      {/* Modal Preview (for print) */}
      <ReceiptPreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        receiptInfo={receiptInfo}
        activeTab={activeTab}
        selectedServices={selectedServices}
        serviceDescription={serviceDescription}
        serviceValues={serviceValues}
        expenses={expenses}
        advanceData={advanceData}
      />
    </div>
  );
}
