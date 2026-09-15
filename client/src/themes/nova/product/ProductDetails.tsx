interface ProductDetailsProps {
    product: any;
  }
  
  export default function ProductDetails({
    product,
  }: ProductDetailsProps) {
    return (
      <div className="space-y-6">
        {/* TÍTULO */}
        <h2
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          Detalhes do produto
        </h2>
  
        {/* INFORMAÇÕES PRINCIPAIS */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
          "
        >
          {/* CATEGORIA */}
          <div
            className="
              rounded-lg
              border
              bg-gray-50
              p-4
            "
          >
            <p className="text-sm text-gray-500">
              Categoria
            </p>
  
            <p className="font-semibold">
              {product?.category || "Sem categoria"}
            </p>
          </div>
  
          {/* DISPONIBILIDADE */}
          <div
            className="
              rounded-lg
              border
              bg-gray-50
              p-4
            "
          >
            <p className="text-sm text-gray-500">
              Disponibilidade
            </p>
  
            <p className="font-semibold text-green-600">
              {Number(product?.stock ?? 0) > 0
                ? "Em estoque"
                : "Sem estoque"}
            </p>
          </div>
  
          {/* GARANTIA */}
          <div
            className="
              rounded-lg
              border
              bg-gray-50
              p-4
            "
          >
            <p className="text-sm text-gray-500">
              Garantia
            </p>
  
            <p className="font-semibold">
              Garantia
            </p>
          </div>
  
          {/* ENVIO */}
          <div
            className="
              rounded-lg
              border
              bg-gray-50
              p-4
            "
          >
            <p className="text-sm text-gray-500">
              Envio
            </p>
  
            <p className="font-semibold">
              Internacional
            </p>
          </div>
        </div>
  
        {/* CARACTERÍSTICAS */}
        <div
          className="
            rounded-xl
            border
            p-5
          "
        >
          <h3
            className="
              mb-4
              font-bold
            "
          >
            Características
          </h3>
  
          <ul
            className="
              space-y-2
              text-sm
              text-gray-600
            "
          >
            <li>
              ✓ Produto original verificado
            </li>
  
            <li>
              ✓ Material de alta qualidade
            </li>
  
            <li>
              ✓ Compra segura
            </li>
  
            <li>
              ✓ Suporte ao cliente
            </li>
          </ul>
        </div>
      </div>
    );
  }