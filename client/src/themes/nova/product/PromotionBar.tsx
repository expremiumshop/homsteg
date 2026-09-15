import { Timer, TicketPercent } from "lucide-react";
import { useEffect, useState } from "react";

interface PromotionBarProps {
  product?: any;
}

export default function PromotionBar({
  product,
}: PromotionBarProps) {
  const [time, setTime] = useState({
    hours: 2,
    minutes: 15,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let seconds = prev.seconds - 1;
        let minutes = prev.minutes;
        let hours = prev.hours;

        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }

        if (minutes < 0) {
          minutes = 59;
          hours--;
        }

        if (hours < 0) {
          hours = 0;
          minutes = 0;
          seconds = 0;
        }

        return {
          hours,
          minutes,
          seconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
        rounded-xl
        bg-gradient-to-r
        from-orange-500
        to-red-500
        p-5
        text-white
        shadow-sm
      "
    >
      {/* TÍTULO */}
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            rounded-full
            bg-white/20
            p-2
          "
        >
          <Timer size={26} />
        </div>

        <div>
          <h3
            className="
              text-lg
              font-bold
            "
          >
            Oferta especial por tempo limitado
          </h3>

          <p
            className="
              text-sm
              opacity-90
            "
          >
            Aproveite antes que termine
          </p>
        </div>
      </div>

      {/* TEMPO + CUPOM */}
      <div
        className="
          mt-5
          flex
          flex-wrap
          items-center
          gap-4
        "
      >
        {/* CONTADOR */}
        <div
          className="
            rounded-lg
            bg-white
            px-5
            py-3
            text-lg
            font-bold
            text-red-600
          "
        >
          {String(time.hours).padStart(2, "0")}:
          {String(time.minutes).padStart(2, "0")}:
          {String(time.seconds).padStart(2, "0")}
        </div>

        {/* CUPOM */}
        <div
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-white/30
            bg-white/20
            px-5
            py-3
            font-semibold
          "
        >
          <TicketPercent size={21} />

          <div>
            <p>Cupom</p>

            <p
              className="
                text-xs
                opacity-80
              "
            >
              Economize nesta compra
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}