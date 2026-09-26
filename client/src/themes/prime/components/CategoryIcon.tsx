import {
  Crown,
  Flame,
  Gift,
  Grid2X2,
  Home,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Zap,
} from "lucide-react";

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Todos: Grid2X2,
  Moda: Sparkles,
  Beleza: Gift,
  Calçados: ShoppingBag,
  Tecnologia: Zap,
  Casa: Home,
  Acessórios: Tag,
  Joias: Crown,
  Desporto: Flame,
  Escritório: Store,
  Produtos: Grid2X2,
};

type CategoryIconProps = {
  name: string;
  className?: string;
};

export function CategoryIcon({
  name,
  className = "h-5 w-5",
}: CategoryIconProps) {
  const Icon =
    iconMap[name] ?? Grid2X2;

  return (
    <Icon
      className={className}
    />
  );
}

export default CategoryIcon;
