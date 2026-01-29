interface GitHubCommit {
  sha: string;
  message: string;
  repo: string;
  url: string;
  date: Date;
}

export async function getRecentCommits(username: string, limit = 5): Promise<GitHubCommit[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    // First get recent push events to find repos with activity
    const eventsResponse = await fetch(
      `https://api.github.com/users/${username}/events/public`,
      {
        headers,
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!eventsResponse.ok) {
      console.error("Failed to fetch GitHub events:", eventsResponse.status);
      return [];
    }

    const events = await eventsResponse.json();

    // Get unique repos from push events
    const pushEvents = events
      .filter((e: { type: string }) => e.type === "PushEvent")
      .slice(0, 3); // Check up to 3 recent push events

    const commits: GitHubCommit[] = [];

    for (const event of pushEvents) {
      if (commits.length >= limit) break;

      const repoName = event.repo.name;
      const headSha = event.payload.head;

      // Fetch the actual commit details
      const commitResponse = await fetch(
        `https://api.github.com/repos/${repoName}/commits/${headSha}`,
        {
          headers,
          next: { revalidate: 300 },
        }
      );

      if (commitResponse.ok) {
        const commitData = await commitResponse.json();
        commits.push({
          sha: commitData.sha.slice(0, 7),
          message:
            commitData.commit.message.split("\n")[0].slice(0, 50) +
            (commitData.commit.message.split("\n")[0].length > 50 ? "..." : ""),
          repo: repoName.split("/")[1],
          url: commitData.html_url,
          date: new Date(commitData.commit.author.date),
        });
      }
    }

    return commits;
  } catch (error) {
    console.error("Error fetching GitHub:", error);
    return [];
  }
}
