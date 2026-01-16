import { useState } from "react";
import { Header } from "@/components/Header";
import { TabNavigation, TabType } from "@/components/TabNavigation";
import { ReceiptInfoForm, ReceiptInfo } from "@/components/ReceiptInfoForm";
import { ServicesSection, ServiceType } from "@/components/ServicesSection";
import { ValuesSection, ServiceValue } from "@/components/ValuesSection";
import { ExpensesForm, Expense } from "@/components/ExpensesForm";
import { AdvanceForm, AdvanceData } from "@/components/AdvanceForm";
import { GenerateReceiptButton } from "@/components/GenerateReceiptButton";
import { ReceiptPreview } from "@/components/ReceiptPreview";
import { useToast } from "@/hooks/use-toast";

const initialReceiptInfo: ReceiptInfo = {
  nomeCompleto: "",
  cpf: "",
  produtor: "",
  nomeEvento: "",
  dataEvento: "",
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [advanceData, setAdvanceData] = useState<AdvanceData>(initialAdvanceData);
  const [showPreview, setShowPreview] = useState(false);

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

      <main className="container py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="space-y-6 mt-6">
            <ReceiptInfoForm data={receiptInfo} onChange={setReceiptInfo} />

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

            <GenerateReceiptButton onClick={handleGenerateReceipt} />
          </div>
        </div>
      </main>

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
