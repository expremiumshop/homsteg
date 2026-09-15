import {
  ShieldCheck,
  Share2,
  Lock,
} from "lucide-react";

export default function GuaranteeCard() {
  return (
    <div
      className="
        rounded-xl
        p-5
        bg-white
        space-y-5
      "
    >
      {/* PRODUTO PROTEGIDO */}
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <ShieldCheck
          className="
            text-green-600
            w-6
            h-6
          "
        />

        <div>
          <p
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            Produto protegido
          </p>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Garantia
          </p>
        </div>
      </div>

      {/* GARANTIA */}
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <Lock
          className="
            text-purple-600
            w-6
            h-6
          "
        />

        <div>
          <p
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            Pagamento seguro
          </p>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Dados protegidos
          </p>
        </div>
      </div>

      {/* PARTILHAR */}
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <Share2
          className="
            text-gray-600
            w-6
            h-6
          "
        />

        <div>
          <p
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            Partilhar
          </p>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Envie para amigos
          </p>
        </div>
      </div>
    </div>
  );
}