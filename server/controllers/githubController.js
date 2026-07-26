import GitHubCache from '../models/GitHubCache.js';

const USERNAME = 'csakib049';
const REFRESH_MS = 6 * 60 * 60 * 1000; // 6 hours

function getDateRange() {
  const now = new Date();
  const from = new Date(now);
  from.setFullYear(from.getFullYear() - 1);
  from.setDate(from.getDate() - 1);
  return {
    from: from.toISOString().split('T')[0] + 'T00:00:00Z',
    to: now.toISOString().split('T')[0] + 'T23:59:59Z',
  };
}

function getDateRangeForYear(year) {
  return {
    from: `${year}-01-01T00:00:00Z`,
    to: `${year}-12-31T23:59:59Z`,
  };
}

function calculateStreaks(weeks) {
  const days = weeks
    .flatMap(w => w.contributionDays)
    .map(d => ({ date: d.date.slice(0, 10), count: d.contributionCount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0;
  let currentRun = 0;

  for (const day of days) {
    if (day.count > 0) {
      currentRun++;
      if (currentRun > longest) longest = currentRun;
    } else {
      currentRun = 0;
    }
  }

  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      currentStreak++;
    } else {
      if (days[i].date !== today) break;
    }
  }

  return { currentStreak, longestStreak: longest };
}

function calculateLanguageStats(repos) {
  const counts = {};
  let total = 0;
  for (const repo of repos) {
    const lang = repo.language;
    if (lang) {
      counts[lang] = (counts[lang] || 0) + 1;
      total++;
    }
  }
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      count,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

function formatEvent(event) {
  switch (event.type) {
    case 'PushEvent':
      return {
        type: 'push',
        text: `Pushed ${event.payload.size} commit${event.payload.size > 1 ? 's' : ''} to ${event.repo.name}`,
        repo: event.repo.name,
      };
    case 'PullRequestEvent':
      return {
        type: event.payload.action === 'closed' && event.payload.pull_request?.merged ? 'merge' : 'pr',
        text: `${event.payload.action === 'closed' && event.payload.pull_request?.merged ? 'Merged' : event.payload.action === 'opened' ? 'Opened' : event.payload.action} PR in ${event.repo.name}`,
        repo: event.repo.name,
      };
    case 'IssuesEvent':
      return {
        type: 'issue',
        text: `${event.payload.action === 'opened' ? 'Opened' : event.payload.action === 'closed' ? 'Closed' : event.payload.action} issue in ${event.repo.name}`,
        repo: event.repo.name,
      };
    case 'CreateEvent':
      return {
        type: 'create',
        text: `Created ${event.payload.ref_type}${event.payload.ref ? ` ${event.payload.ref}` : ''} in ${event.repo.name}`,
        repo: event.repo.name,
      };
    case 'ForkEvent':
      return {
        type: 'fork',
        text: `Forked ${event.repo.name}`,
        repo: event.repo.name,
      };
    case 'WatchEvent':
      return {
        type: 'star',
        text: `Starred ${event.repo.name}`,
        repo: event.repo.name,
      };
    case 'DeleteEvent':
      return {
        type: 'delete',
        text: `Deleted ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`,
        repo: event.repo.name,
      };
    case 'PublicEvent':
      return {
        type: 'public',
        text: `Made ${event.repo.name} public`,
        repo: event.repo.name,
      };
    case 'MemberEvent':
      return {
        type: 'member',
        text: `${event.payload.action === 'added' ? 'Added' : 'Removed'} collaborator in ${event.repo.name}`,
        repo: event.repo.name,
      };
    default:
      return {
        type: 'other',
        text: `${event.type} on ${event.repo.name}`,
        repo: event.repo.name,
      };
  }
}

async function fetchAllGitHubData(year) {
  const token = process.env.GITHUB_TOKEN;
  const headers = { Authorization: `Bearer ${token}` };
  const { from, to } = year ? getDateRangeForYear(year) : getDateRange();

  // 1. GraphQL — contribution calendar, pinned repos, user stats
  const graphqlQuery = {
    query: `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          repositories { totalCount }
          followers { totalCount }
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                primaryLanguage { name color }
                stargazerCount
                forkCount
                url
              }
            }
          }
        }
      }
    `,
    variables: { username: USERNAME, from, to },
  };

  const gqlRes = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(graphqlQuery),
  });

  if (!gqlRes.ok) {
    const errText = await gqlRes.text();
    throw new Error(`GraphQL API error: ${gqlRes.status} ${errText}`);
  }

  const gqlData = await gqlRes.json();
  if (gqlData.errors) throw new Error(`GraphQL errors: ${JSON.stringify(gqlData.errors)}`);

  const userData = gqlData.data.user;

  // 2. REST — repos for star count & language stats
  const reposRes = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`,
    { headers }
  );
  if (!reposRes.ok) throw new Error(`Repos API error: ${reposRes.status}`);
  const repos = await reposRes.json();

  // 3. REST — recent events
  const eventsRes = await fetch(
    `https://api.github.com/users/${USERNAME}/events?per_page=30`,
    { headers }
  );

  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const languageStats = calculateLanguageStats(repos);

  const streaks = calculateStreaks(
    userData.contributionsCollection.contributionCalendar.weeks
  );

  let recentActivity = [];
  if (eventsRes.ok) {
    const events = await eventsRes.json();
    recentActivity = events.slice(0, 15).map(e => ({
      ...formatEvent(e),
      createdAt: e.created_at,
      id: e.id,
    }));
  }

  return {
    totalRepos: userData.repositories.totalCount,
    totalCommits: userData.contributionsCollection.totalCommitContributions,
    totalPRs: userData.contributionsCollection.totalPullRequestContributions,
    totalStars,
    followers: userData.followers.totalCount,
    contributionCalendar: userData.contributionsCollection.contributionCalendar,
    pinnedItems: (userData.pinnedItems?.nodes || []).filter(Boolean),
    languageStats,
    streaks,
    recentActivity,
  };
}

export const getGitHubData = async (req, res) => {
  const year = req.query.year || null;
  const cacheKey = year ? `main-${year}` : 'main';

  try {
    let cache = await GitHubCache.findOne({ key: cacheKey });
    const now = Date.now();

    const isStale = !cache || !cache.lastSynced ||
      (now - new Date(cache.lastSynced).getTime() > REFRESH_MS);

    if (isStale) {
      try {
        const data = await fetchAllGitHubData(year);
        if (cache) {
          cache.data = data;
          cache.lastSynced = new Date();
          await cache.save();
        } else {
          cache = await GitHubCache.create({
            key: cacheKey,
            data,
            lastSynced: new Date(),
          });
        }
      } catch (fetchErr) {
        console.error('GitHub fetch failed, serving cached:', fetchErr.message);
        if (cache && cache.data) {
          return res.json({ data: cache.data, lastSynced: cache.lastSynced });
        }
        throw fetchErr;
      }
    }

    res.json({
      data: cache.data,
      lastSynced: cache.lastSynced,
    });
  } catch (err) {
    console.error('GitHub controller error:', err.message);
    const cache = await GitHubCache.findOne({ key: cacheKey });
    if (cache && cache.data) {
      return res.json({ data: cache.data, lastSynced: cache.lastSynced });
    }
    res.status(503).json({
      message: 'GitHub data unavailable',
      data: null,
      lastSynced: null,
    });
  }
};
