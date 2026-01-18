import { useState, useEffect } from "react";

interface City {
  id: number;
  nome: string;
}

export function useBrazilCities(stateCode: string) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stateCode) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios?orderBy=nome`
        );
        const data: City[] = await response.json();
        setCities(data.map((city) => city.nome));
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [stateCode]);

  return { cities, loading };
}
