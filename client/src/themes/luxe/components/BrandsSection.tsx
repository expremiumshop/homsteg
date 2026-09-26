import {
  brands,
  type LuxeBrand,
} from "../demoData";

function BrandCard({
  item,
}: {
  item: LuxeBrand;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl">
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black tracking-[0.25em] text-white">
          {item.name}
        </span>

        <span className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
          {item.text}
        </span>
      </div>
    </article>
  );
}

export function BrandsSection() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            LUXE MALL
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Marcas & coleções
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Descubra coleções que combinam
            qualidade, personalidade e estilo.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <BrandCard
              key={brand.name}
              item={brand}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandsSection;
