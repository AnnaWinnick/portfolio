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

function parseGoodreadsRSS(xml: string): Omit<GoodreadsBook, "status">[] {
  const books: Omit<GoodreadsBook, "status">[] = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const authorRegex = /<author_name>(.*?)<\/author_name>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const ratingRegex = /<user_rating>(\d+)<\/user_rating>/;
  const imageRegex = /<book_large_image_url>(.*?)<\/book_large_image_url>|<book_medium_image_url>(.*?)<\/book_medium_image_url>/;

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const titleMatch = titleRegex.exec(item);
    const authorMatch = authorRegex.exec(item);
    const linkMatch = linkRegex.exec(item);
    const ratingMatch = ratingRegex.exec(item);
    const imageMatch = imageRegex.exec(item);

    if (titleMatch && linkMatch) {
      books.push({
        title: (titleMatch[1] || titleMatch[2] || "").trim(),
        author: authorMatch?.[1] || "Unknown Author",
        goodreadsUrl: linkMatch[1],
        rating: ratingMatch ? parseInt(ratingMatch[1]) : undefined,
        coverUrl: imageMatch?.[1] || imageMatch?.[2],
      });
    }
  }

  return books;
}
