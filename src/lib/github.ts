interface GitHubCommit {
  sha: string;
  message: string;
  repo: string;
  url: string;
  date: Date;
}

export async function getRecentCommits(username: string, limit = 5): Promise<GitHubCommit[]> {
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch GitHub events:", response.status);
      return [];
    }

    const events = await response.json();

    const commits: GitHubCommit[] = [];
    for (const event of events) {
      if (event.type === "PushEvent" && event.payload.commits) {
        for (const commit of event.payload.commits) {
          commits.push({
            sha: commit.sha.slice(0, 7),
            message: commit.message.split("\n")[0].slice(0, 50) +
              (commit.message.length > 50 ? "..." : ""),
            repo: event.repo.name.split("/")[1],
            url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
            date: new Date(event.created_at),
          });
          if (commits.length >= limit) break;
        }
      }
      if (commits.length >= limit) break;
    }

    return commits;
  } catch (error) {
    console.error("Error fetching GitHub:", error);
    return [];
  }
}
