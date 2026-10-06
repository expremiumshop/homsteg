import { useState } from "react";

import { useLocation } from "wouter";
import HomstegLogo from "@/components/HomstegLogo";

import {
  ArrowRight,
  Check,
  Store,
} from "lucide-react";

const BUSINESS_OPTIONS = [
  "Já tive uma loja online",
  "Tenho uma loja física",
  "Tenho um grupo de WhatsApp",
  "Sou afiliado",
  "Outro",
];

export default function CreateStoreBusiness() {
  const [, navigate] = useLocation();

  const [selectedTypes, setSelectedTypes] =
    useState<string[]>(() => {
      try {
        const saved = sessionStorage.getItem(
          "homsteg_business_types",
        );

        if (!saved) {
          return [];
        }

        const parsed = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          return parsed;
        }

        return [];
      } catch (error) {
        console.error(
          "[CreateStoreBusiness] Erro ao carregar dados:",
          error,
        );

        sessionStorage.removeItem(
          "homsteg_business_types",
        );

        return [];
      }
    });

  function toggleBusinessType(type: string) {
    setSelectedTypes((current) => {
      if (current.includes(type)) {
        return current.filter(
          (item) => item !== type,
        );
      }

      return [...current, type];
    });
  }

  function handleContinue() {
    if (selectedTypes.length === 0) {
      return;
    }

    sessionStorage.setItem(
      "homsteg_business_types",
      JSON.stringify(selectedTypes),
    );

    navigate("/criar-loja/dados");
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto min-h-screen w-full max-w-4xl px-5 py-10 sm:px-8">
        {/* HEADER */}
        <div className="mb-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-slate-500 transition hover:text-black"
          >
            Voltar
          </button>

          <HomstegLogo size={42} />
        </div>

        <div className="mx-auto w-full max-w-2xl">
          {/* TITLE */}
          <div className="mb-10">
            <p className="mb-4 text-sm font-medium text-slate-500">
              Começar
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Como já vendes actualmente?
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
              Queremos conhecer um pouco melhor o
              teu negócio para preparar a tua loja
              da melhor forma.
            </p>
          </div>

          {/* OPTIONS */}
          <div className="space-y-3">
            {BUSINESS_OPTIONS.map((option) => {
              const selected =
                selectedTypes.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    toggleBusinessType(option)
                  }
                  className={[
                    "group flex w-full items-center justify-between rounded-2xl border p-5 text-left transition",
                    selected
                      ? "border-black bg-black text-white"
                      : "border-slate-200 bg-white text-black hover:border-slate-400 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition",
                        selected
                          ? "border-white bg-white text-black"
                          : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-400",
                      ].join(" ")}
                    >
                      <Store className="h-5 w-5" />
                    </div>

                    <span
                      className={[
                        "text-sm font-medium sm:text-base",
                        selected
                          ? "text-white"
                          : "text-slate-800",
                      ].join(" ")}
                    >
                      {option}
                    </span>
                  </div>

                  <div
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full border transition",
                      selected
                        ? "border-white bg-white text-black"
                        : "border-slate-300 text-transparent",
                    ].join(" ")}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* CONTINUE */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleContinue}
              disabled={selectedTypes.length === 0}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-7 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* SELECTED COUNT */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-400">
              {selectedTypes.length === 0
                ? "Seleciona pelo menos uma opção"
                : selectedTypes.length === 1
                  ? "1 opção selecionada"
                  : `${selectedTypes.length} opções selecionadas`}
            </p>
          </div>

          {/* PROGRESS */}
          <div className="mt-14 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Configuração da loja
              </span>

              <span>1 de 3</span>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/3 rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
