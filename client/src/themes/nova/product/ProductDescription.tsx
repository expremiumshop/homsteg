interface DescriptionProps {
    description: string | null;
  }
  
  export default function ProductDescription({
    description,
  }: DescriptionProps) {
    return (
      <div className="mt-8 space-y-5">
        {/* TÍTULO */}
        <h2
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          Descrição do produto
        </h2>
  
        {/* DESCRIÇÃO */}
        <div
          className="
            prose
            max-w-none
            text-gray-700
            leading-relaxed
          "
        >
          {description ? (
            <p>{description}</p>
          ) : (
            <p>
              Este produto oferece qualidade e uma excelente
              experiência de compra.
            </p>
          )}
        </div>
  
        {/* INFORMAÇÕES */}
        <div
          className="
            mt-6
            rounded-xl
            bg-gray-50
            p-5
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-3
            "
          >
            {/* PRODUTOS VERIFICADOS */}
            <div>
              <p className="font-semibold">
                ✓ Produtos verificados
              </p>
  
              <p className="text-sm text-gray-500">
                Analisamos os nossos produtos antes da venda.
              </p>
            </div>
  
            {/* COMPRA PROTEGIDA */}
            <div>
              <p className="font-semibold">
                ✓ Compra protegida
              </p>
  
              <p className="text-sm text-gray-500">
                Processo seguro e transparente.
              </p>
            </div>
  
            {/* ATENDIMENTO */}
            <div>
              <p className="font-semibold">
                ✓ Atendimento
              </p>
  
              <p className="text-sm text-gray-500">
                Suporte para os nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }