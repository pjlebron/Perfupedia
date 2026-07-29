import Image from "next/image";
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = "https://lbphepwhsyskustxmjue.supabase.co";

export type BannerLocation =
  | "header" | "sidebar" | "in_article_top" | "in_article_bottom" | "article_end"
  | "ranking_cards" | "brand_page" | "perfume_page" | "mobile_sticky"
  | "home_mid" | "home_bottom" | "listing_top"
  | "rankings_list_top" | "rankings_list_bottom"
  | "ranking_detail_top" | "ranking_detail_bottom"
  | "blog_list_top" | "blog_list_bottom"
  | "brand_top" | "brand_bottom"
  | "perfume_top" | "perfume_mid" | "perfume_bottom";

export default async function BannerSlot({ location }: { location: BannerLocation }) {
  const today = new Date().toISOString().slice(0, 10);

  const { data: banner } = await supabase
    .from("banners")
    .select("id, link_url, advertiser, image_path")
    .eq("location", location)
    .eq("is_active", true)
    .or(`start_date.is.null,start_date.lte.${today}`)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order("priority", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!banner || !banner.image_path) return null;

  const imageSrc = `${SUPABASE_URL}/storage/v1/object/public/banners/${banner.image_path}`;

  return (
    <div className="my-10 flex flex-col items-center gap-1.5">
      <a
        href={banner.link_url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="relative block w-full max-w-3xl aspect-[21/9] rounded-lg overflow-hidden border border-[var(--color-line)]"
      >
        <Image
          src={imageSrc}
          alt={banner.advertiser ?? "Publicidad"}
          fill
          className="object-cover"
        />
      </a>
      <span className="text-[10px] uppercase tracking-wide text-[var(--color-ink)]/35">
        Publicidad
      </span>
    </div>
  );
}
