import Image from "next/image";
import { cn } from "@/lib/utils/format";

const PLACEHOLDER = "/placeholder-product.svg";

export function ProductImage({
  src,
  alt,
  className,
  sizes = "(min-width: 768px) 33vw, 50vw",
  preload = false,
}: {
  src: string | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-amber-light/40", className)}>
      <Image
        src={src || PLACEHOLDER}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
      />
    </div>
  );
}
