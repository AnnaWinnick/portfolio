import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { addHobbyImage, deleteHobbyImage, moveHobbyImage } from "@/app/actions/hobbies";

export default async function HobbiesAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const images = await prisma.hobbyImage.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main className="min-h-screen px-6 py-16 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <a
            href="/admin"
            className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            &larr; Back to Dashboard
          </a>
          <h1 className="mt-4">Creative Hobbies Gallery</h1>
          <p className="text-[var(--foreground-muted)]">
            Showcase your paintings, crochet, pottery, and other creative work
          </p>
        </header>

        {/* Add image form */}
        <form action={addHobbyImage} className="p-6 bg-[var(--background-alt)] rounded-lg space-y-4">
          <h3>Add Image</h3>
          <input
            name="url"
            type="url"
            placeholder="Image URL (e.g., https://...)"
            required
            className="w-full px-4 py-2 border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
          />
          <input
            name="caption"
            placeholder="Caption (optional)"
            className="w-full px-4 py-2 border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:opacity-90"
          >
            Add Image
          </button>
        </form>

        {/* Gallery */}
        <section className="space-y-4">
          <h3>Gallery ({images.length} images)</h3>
          {images.length === 0 ? (
            <p className="text-[var(--foreground-muted)]">No images yet.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-4">
              {images.map((img, idx) => (
                <li key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt={img.caption || "Hobby image"}
                    className="aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                    {img.caption && (
                      <p className="text-white text-sm px-2 text-center">{img.caption}</p>
                    )}
                    <div className="flex gap-2">
                      {idx > 0 && (
                        <form action={moveHobbyImage}>
                          <input type="hidden" name="id" value={img.id} />
                          <input type="hidden" name="direction" value="up" />
                          <button className="px-2 py-1 bg-white/20 text-white rounded text-sm">
                            &larr;
                          </button>
                        </form>
                      )}
                      {idx < images.length - 1 && (
                        <form action={moveHobbyImage}>
                          <input type="hidden" name="id" value={img.id} />
                          <input type="hidden" name="direction" value="down" />
                          <button className="px-2 py-1 bg-white/20 text-white rounded text-sm">
                            &rarr;
                          </button>
                        </form>
                      )}
                      <form action={deleteHobbyImage}>
                        <input type="hidden" name="id" value={img.id} />
                        <button className="px-2 py-1 bg-red-600 text-white rounded text-sm">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
