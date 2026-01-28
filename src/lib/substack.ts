const SUBSTACK_RSS_URL = "https://threescompany.substack.com/feed";

interface SubstackPost {
  title: string;
  excerpt: string;
  url: string;
  publishedAt: Date;
}

export async function fetchSubstackPosts(limit = 5): Promise<SubstackPost[]> {
  try {
    const response = await fetch(SUBSTACK_RSS_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch Substack RSS:", response.status);
      return [];
    }

    const xml = await response.text();
    return parseRSS(xml).slice(0, limit);
  } catch (error) {
    console.error("Error fetching Substack:", error);
    return [];
  }
}

function parseRSS(xml: string): SubstackPost[] {
  const posts: SubstackPost[] = [];

  // Simple regex-based RSS parsing
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const descRegex = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/;
  const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const titleMatch = titleRegex.exec(item);
    const linkMatch = linkRegex.exec(item);
    const descMatch = descRegex.exec(item);
    const pubDateMatch = pubDateRegex.exec(item);

    if (titleMatch && linkMatch) {
      const title = titleMatch[1] || titleMatch[2] || "";
      const description = descMatch?.[1] || descMatch?.[2] || "";
      // Strip HTML tags and limit excerpt
      const excerpt = description
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim()
        .slice(0, 200) + (description.length > 200 ? "..." : "");

      posts.push({
        title,
        excerpt,
        url: linkMatch[1],
        publishedAt: pubDateMatch ? new Date(pubDateMatch[1]) : new Date(),
      });
    }
  }

  return posts;
}
