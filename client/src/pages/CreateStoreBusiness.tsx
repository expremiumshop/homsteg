import { useState } from "react";

import { useLocation } from "wouter";

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
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto min-h-screen w-full max-w-4xl px-5 py-10 sm:px-8">

        {/* HEADER */}
        <div className="mb-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-neutral-500 transition hover:text-white"
          >
            Voltar
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
              <Store className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              HOMSTEG
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl">

          {/* TITLE */}
          <div className="mb-10">
            <p className="mb-4 text-sm font-medium text-neutral-400">
              Começar
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Como já vendes actualmente?
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-neutral-400">
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
                      ? "border-white bg-white text-black"
                      : "border-neutral-800 bg-neutral-950 text-white hover:border-neutral-600",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition",
                        selected
                          ? "border-black bg-black text-white"
                          : "border-neutral-800 bg-black text-neutral-400 group-hover:border-neutral-600",
                      ].join(" ")}
                    >
                      <Store className="h-5 w-5" />
                    </div>

                    <span
                      className={[
                        "text-sm font-medium sm:text-base",
                        selected
                          ? "text-black"
                          : "text-neutral-200",
                      ].join(" ")}
                    >
                      {option}
                    </span>
                  </div>

                  <div
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full border transition",
                      selected
                        ? "border-black bg-black text-white"
                        : "border-neutral-700 text-transparent",
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
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar

              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* SELECTED COUNT */}
          <div className="mt-5 text-center">
            <p className="text-xs text-neutral-600">
              {selectedTypes.length === 0
                ? "Seleciona pelo menos uma opção"
                : selectedTypes.length === 1
                  ? "1 opção selecionada"
                  : `${selectedTypes.length} opções selecionadas`}
            </p>
          </div>

          {/* PROGRESS */}
          <div className="mt-14 border-t border-neutral-900 pt-5">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>
                Configuração da loja
              </span>

              <span>1 de 3</span>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-900">
              <div className="h-full w-1/3 rounded-full bg-white" />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}