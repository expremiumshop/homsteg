import {
  Shirt,
  UserRound,
  Baby,
  Gem,
  Footprints,
  Sparkles,
  House,
  Smartphone,
} from "lucide-react";
import { Link } from "wouter";

const categories = [
  {
    name: "Moda Feminina",
    slug: "moda-feminina",
    icon: Shirt,
  },
  {
    name: "Moda Masculina",
    slug: "moda-masculina",
    icon: UserRound,
  },
  {
    name: "Roupas Infantis",
    slug: "roupas-infantis",
    icon: Baby,
  },
  {
    name: "Acessórios",
    slug: "acessorios",
    icon: Gem,
  },
  {
    name: "Calçados",
    slug: "calcados",
    icon: Footprints,
  },
  {
    name: "Beleza",
    slug: "beleza",
    icon: Sparkles,
  },
  {
    name: "Casa",
    slug: "casa",
    icon: House,
  },
  {
    name: "Eletrónica",
    slug: "eletronica",
    icon: Smartphone,
  },
];

export function CategoryMenu() {
  return (
    <section className="w-full bg-white px-4 py-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            Categorias
          </h2>
        </div>

        <div
          className="
            flex
            gap-3
            overflow-x-auto
            pb-1
            scrollbar-none
            snap-x
            snap-mandatory
          "
        >
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                href={`/themes/nova/categoria/${category.slug}`}
                className="
                  group
                  flex
                  w-[88px]
                  min-w-[88px]
                  shrink-0
                  snap-start
                  flex-col
                  items-center
                  rounded-xl
                  px-1
                  py-2
                  text-center
                  transition-all
                  duration-200
                  hover:bg-gray-50
                  sm:w-[100px]
                  sm:min-w-[100px]
                  md:w-[110px]
                  md:min-w-[110px]
                  lg:w-[120px]
                  lg:min-w-[120px]
                "
              >
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-50
                    transition-all
                    duration-200
                    group-hover:bg-emerald-50
                    sm:h-16
                    sm:w-16
                    md:h-[68px]
                    md:w-[68px]
                  "
                >
                  <Icon
                    className="
                      h-7
                      w-7
                      text-gray-700
                      transition-all
                      duration-200
                      group-hover:scale-110
                      group-hover:text-emerald-600
                      sm:h-8
                      sm:w-8
                    "
                    strokeWidth={1.6}
                  />
                </div>

                <span
                  className="
                    mt-2
                    line-clamp-2
                    text-[11px]
                    font-semibold
                    leading-4
                    text-gray-800
                    transition-colors
                    group-hover:text-emerald-600
                    sm:text-xs
                  "
                >
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoryMenu;