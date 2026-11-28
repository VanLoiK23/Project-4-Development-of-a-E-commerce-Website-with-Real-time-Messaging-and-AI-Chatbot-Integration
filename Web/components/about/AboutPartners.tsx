import React from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export interface AboutPartnersProps {
  className?: string;
}

export function AboutPartners({ className }: AboutPartnersProps) {
  const brands = [
    { name: "Apple", desc: "iPhone & Phụ kiện" },
    { name: "Samsung", desc: "Galaxy S & Z Series" },
    { name: "Xiaomi", desc: "Xiaomi & Redmi" },
    { name: "OPPO", desc: "Find & Reno Series" },
    { name: "Google", desc: "Pixel Series" },
    { name: "Vivo", desc: "X Series & V Series" },
  ];

  return (
    <section
      aria-label="Đối tác và các thương hiệu phân phối"
      className={cn("py-8 lg:py-12 bg-surface border-y border-line", className)}
    >
      <Container size="xl">
        <div className="space-y-4">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-3">
            Hợp tác phân phối chính hãng các thương hiệu hàng đầu
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col items-center justify-center p-4 rounded-[var(--radius-lg)] bg-surface-subtle/50 border border-line hover:border-brand/40 hover:bg-surface-subtle transition-colors text-center"
              >
                <span className="font-heading font-extrabold text-base sm:text-lg text-ink tracking-tight">
                  {brand.name}
                </span>
                <span className="text-[11px] text-ink-3 mt-0.5">
                  {brand.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
