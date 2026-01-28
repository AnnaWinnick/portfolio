// Goodreads RSS feed integration
// User needs to set their Goodreads user ID in env (GOODREADS_USER_ID)
// RSS feeds: https://www.goodreads.com/review/list_rss/{USER_ID}?shelf=currently-reading

interface GoodreadsBook {
  title: string;
  author: string;
  status: "reading" | "finished";
  rating?: number;
  goodreadsUrl: string;
  coverUrl?: string;
  startedAt?: string;
}

export async function getBooks(): Promise<GoodreadsBook[]> {
  const userId = process.env.GOODREADS_USER_ID;
  if (!userId) {
    console.log("GOODREADS_USER_ID not configured");
    return [];
  }

  const books: GoodreadsBook[] = [];

  try {
    // Fetch currently reading
    const currentlyReading = await fetchShelf(userId, "currently-reading");
    books.push(...currentlyReading.map((b) => ({ ...b, status: "reading" as const })));

    // Fetch recently read
    const read = await fetchShelf(userId, "read");
    books.push(...read.slice(0, 5).map((b) => ({ ...b, status: "finished" as const })));

    return books;
  } catch (error) {
    console.error("Error fetching Goodreads:", error);
    return [];
  }
}

async function fetchShelf(
  userId: string,
  shelf: string
): Promise<Omit<GoodreadsBook, "status">[]> {
  const url = `https://www.goodreads.com/review/list_rss/${userId}?shelf=${shelf}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch Goodreads ${shelf}:`, response.status);
      return [];
    }

    const xml = await response.text();
    return parseGoodreadsRSS(xml);
  } catch (error) {
    console.error(`Error fetching Goodreads ${shelf}:`, error);
    return [];
  }
}

// Helper to extract content, stripping CDATA wrapper if present
function extractContent(content: string | undefined): string | undefined {
  if (!content) return undefined;
  // Strip CDATA wrapper: <![CDATA[content]]> -> content
  const cdataMatch = content.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return cdataMatch ? cdataMatch[1].trim() : content.trim();
}

function parseGoodreadsRSS(xml: string): Omit<GoodreadsBook, "status">[] {
  const books: Omit<GoodreadsBook, "status">[] = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title>(<!\[CDATA\[.*?\]\]>|[^<]*)<\/title>/;
  const authorRegex = /<author_name>(<!\[CDATA\[.*?\]\]>|[^<]*)<\/author_name>/;
  const linkRegex = /<link>(<!\[CDATA\[.*?\]\]>|[^<]*)<\/link>/;
  const ratingRegex = /<user_rating>(\d+)<\/user_rating>/;
  // Handle both CDATA-wrapped and plain URLs
  const largeImageRegex = /<book_large_image_url>(<!\[CDATA\[.*?\]\]>|[^<]*)<\/book_large_image_url>/;
  const mediumImageRegex = /<book_medium_image_url>(<!\[CDATA\[.*?\]\]>|[^<]*)<\/book_medium_image_url>/;
  const smallImageRegex = /<book_small_image_url>(<!\[CDATA\[.*?\]\]>|[^<]*)<\/book_small_image_url>/;
  // Date when book was added to shelf (start date for currently-reading)
  const dateAddedRegex = /<user_date_added>(<!\[CDATA\[.*?\]\]>|[^<]*)<\/user_date_added>/;

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const titleMatch = titleRegex.exec(item);
    const authorMatch = authorRegex.exec(item);
    const linkMatch = linkRegex.exec(item);
    const ratingMatch = ratingRegex.exec(item);
    const largeImageMatch = largeImageRegex.exec(item);
    const mediumImageMatch = mediumImageRegex.exec(item);
    const smallImageMatch = smallImageRegex.exec(item);
    const dateAddedMatch = dateAddedRegex.exec(item);

    if (titleMatch && linkMatch) {
      // Try large, then medium, then small image
      const coverUrl = extractContent(largeImageMatch?.[1])
        || extractContent(mediumImageMatch?.[1])
        || extractContent(smallImageMatch?.[1]);

      // Parse date added (format: "Sat, 25 Jan 2025 12:34:56 -0800")
      const dateAddedRaw = extractContent(dateAddedMatch?.[1]);
      let startedAt: string | undefined;
      if (dateAddedRaw) {
        const date = new Date(dateAddedRaw);
        if (!isNaN(date.getTime())) {
          startedAt = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        }
      }

      books.push({
        title: extractContent(titleMatch[1]) || "Untitled",
        author: extractContent(authorMatch?.[1]) || "Unknown Author",
        goodreadsUrl: extractContent(linkMatch[1]) || "",
        rating: ratingMatch ? parseInt(ratingMatch[1]) : undefined,
        coverUrl,
        startedAt,
      });
    }
  }

  return books;
}
