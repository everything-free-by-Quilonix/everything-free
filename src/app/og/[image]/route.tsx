import { getFreeStatus } from "@/config/free-status";
import { isFactConfirmed } from "@/lib/resources/evidence";
import { getResourceBySlug, listResourceIndexEntries } from "@/lib/repository";
import { renderOgImage, SITE_OG_IMAGE } from "@/lib/seo/og-image";

/**
 * OpenGraph images, written as real `.png` files at build time.
 *
 * Why not the `opengraph-image.tsx` file convention: under `output: export` it emits
 * files named `opengraph-image` with no extension. Static hosts that cannot set
 * headers — GitHub Pages, the production host — pick `Content-Type` from the file
 * extension, so those images were served as `application/octet-stream` and some
 * link-preview scrapers rejected them.
 *
 * A route handler whose dynamic segment *is* the filename (`gimp.png`) makes the
 * export write `out/og/gimp.png`. The extension is real, the host infers
 * `image/png`, and there is still no server: `force-static` plus
 * `generateStaticParams` means every image is rendered once during the build.
 *
 * `site.png` is the site-wide default; every other file is a resource.
 */

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = await listResourceIndexEntries();
  return [{ image: SITE_OG_IMAGE }, ...entries.map((entry) => ({ image: `${entry.slug}.png` }))];
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params;

  if (image === SITE_OG_IMAGE) {
    return renderOgImage({
      title: "The free-resource ecosystem",
      subtitle: "Free status, limitations and verification stated plainly",
    });
  }

  const slug = image.replace(/\.png$/, "");
  const resource = await getResourceBySlug(slug);

  // Unreachable in the export — `dynamicParams = false` limits the set to the
  // params above — but a direct call should still fail honestly.
  if (!resource) {
    return new Response("Not found", { status: 404 });
  }

  const status = getFreeStatus(resource.freeStatus);
  // Link previews travel without the page around them, so an unchecked status has
  // to say so in the image itself.
  const label = isFactConfirmed(resource, "freeStatus") ? status.label : `${status.label} (not verified)`;
  return renderOgImage({
    title: resource.name,
    subtitle: `${label} · ${resource.shortDescription}`,
  });
}
