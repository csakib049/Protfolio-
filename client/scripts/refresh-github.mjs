import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const username = 'csakib049';
const dataPath = fileURLToPath(new URL('../src/data/github-years.json', import.meta.url));
const apiHeaders = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-static-refresh',
};

async function getJson(url) {
  const response = await fetch(url, { headers: apiHeaders });
  if (!response.ok) throw new Error(`GitHub request failed (${response.status}): ${url}`);
  return response.json();
}

function getAttribute(attributes, name) {
  return attributes.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1] ?? '';
}

function parseContributionDays(html) {
  const days = new Map();
  const cellPattern = /<td\b([^>]*)><\/td>\s*<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g;

  for (const match of html.matchAll(cellPattern)) {
    const [, cellAttributes, tipAttributes, tooltip] = match;
    const date = getAttribute(cellAttributes, 'data-date');
    const id = getAttribute(cellAttributes, 'id');
    if (!date || getAttribute(tipAttributes, 'for') !== id) continue;

    const text = tooltip.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const count = Number(text.match(/([\d,]+) contribution/)?.[1]?.replace(/,/g, '') ?? 0);
    const level = Number(getAttribute(cellAttributes, 'data-level') ?? 0);
    days.set(date, { count, level });
  }

  return days;
}

function createCalendar(contributions, start, end) {
  const days = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay());
  const last = new Date(`${end}T00:00:00Z`);
  last.setUTCDate(last.getUTCDate() + (6 - last.getUTCDay()));

  while (cursor <= last) {
    const date = cursor.toISOString().slice(0, 10);
    const { count = 0, level = 0 } = contributions.get(date) ?? {};
    days.push({
      contributionCount: count,
      date,
      color: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'][level] ?? '#ebedf0',
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const contributionDays = days.filter((day) => day.date >= start && day.date <= end);
  let currentStreak = 0;
  let streakDate = new Date(`${end}T00:00:00Z`);
  if ((contributions.get(end)?.count ?? 0) === 0) streakDate.setUTCDate(streakDate.getUTCDate() - 1);
  while (streakDate >= new Date(`${start}T00:00:00Z`)) {
    const date = streakDate.toISOString().slice(0, 10);
    if ((contributions.get(date)?.count ?? 0) === 0) break;
    currentStreak += 1;
    streakDate.setUTCDate(streakDate.getUTCDate() - 1);
  }

  let longestStreak = 0;
  let run = 0;
  for (const day of contributionDays) {
    run = day.contributionCount > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
  }

  return {
    totalContributions: contributionDays.reduce((sum, day) => sum + day.contributionCount, 0),
    weeks: Array.from({ length: Math.ceil(days.length / 7) }, (_, index) => ({
      contributionDays: days.slice(index * 7, index * 7 + 7),
    })),
    streaks: { currentStreak, longestStreak },
  };
}

function formatEvent(event) {
  const repo = event.repo?.name ?? 'GitHub';
  const payload = event.payload ?? {};
  switch (event.type) {
    case 'PushEvent': {
      const count = payload.commits?.length ?? payload.size ?? 1;
      return `Pushed ${count} commit${count === 1 ? '' : 's'} to ${repo}`;
    }
    case 'WatchEvent': return `Starred ${repo}`;
    case 'PullRequestEvent': return `${payload.action ?? 'Updated'} a pull request in ${repo}`;
    case 'PullRequestReviewEvent': return `Reviewed a pull request in ${repo}`;
    case 'IssuesEvent': return `${payload.action ?? 'Updated'} an issue in ${repo}`;
    case 'IssueCommentEvent': return `Commented on an issue in ${repo}`;
    case 'CreateEvent': return `Created ${payload.ref_type ?? 'a resource'}${payload.ref ? ` ${payload.ref}` : ''} in ${repo}`;
    case 'ForkEvent': return `Forked ${repo}`;
    case 'PublicEvent': return `Made ${repo} public`;
    default: return `${event.type?.replace(/Event$/, '').replace(/([a-z])([A-Z])/g, '$1 $2') ?? 'Activity'} in ${repo}`;
  }
}

function currentPinnedRepos(html, repos) {
  const repoByName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));
  const markers = [...html.matchAll(/pinned-item-list-item-content/g)];
  const pinned = [];

  for (let index = 0; index < markers.length; index += 1) {
    const start = markers[index].index;
    const end = markers[index + 1]?.index ?? Math.min(html.length, start + 10000);
    const snippet = html.slice(start, end);
    const name = snippet.match(new RegExp(`href="/${username}/([^"/?#]+)"`, 'i'))?.[1];
    const repo = name && repoByName.get(name.toLowerCase());
    if (!repo) continue;
    pinned.push({
      name: repo.name,
      description: repo.description,
      primaryLanguage: repo.language ? { name: repo.language, color: '#8b949e' } : null,
      stargazerCount: repo.stargazers_count,
      forkCount: repo.forks_count,
      url: repo.html_url,
    });
  }

  return pinned.slice(0, 6);
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const startDate = new Date(`${today}T00:00:00Z`);
  startDate.setUTCDate(startDate.getUTCDate() - 364);
  const start = startDate.toISOString().slice(0, 10);
  const range = `${start}..${today}`;
  const encodedCommitQuery = encodeURIComponent(`author:${username} author-date:${range}`);
  const encodedPrQuery = encodeURIComponent(`author:${username} type:pr created:${range}`);

  const [profile, repos, events, calendarHtml, profileHtml, commitSearch, prSearch] = await Promise.all([
    getJson(`https://api.github.com/users/${username}`),
    getJson(`https://api.github.com/users/${username}/repos?per_page=100`),
    getJson(`https://api.github.com/users/${username}/events/public?per_page=100`),
    fetch(`https://github.com/users/${username}/contributions?from=${start}&to=${today}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    }).then((response) => {
      if (!response.ok) throw new Error(`Contribution calendar request failed (${response.status})`);
      return response.text();
    }),
    fetch(`https://github.com/${username}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then((response) => {
      if (!response.ok) throw new Error(`GitHub profile request failed (${response.status})`);
      return response.text();
    }),
    getJson(`https://api.github.com/search/commits?q=${encodedCommitQuery}&per_page=1`),
    getJson(`https://api.github.com/search/issues?q=${encodedPrQuery}&per_page=1`),
  ]);

  const contributionMap = parseContributionDays(calendarHtml);
  if (contributionMap.size < 300) {
    throw new Error(`GitHub returned only ${contributionMap.size} contribution days; refusing to replace the saved snapshot.`);
  }

  const calendar = createCalendar(contributionMap, start, today);
  const languageCounts = new Map();
  for (const repo of repos) {
    if (repo.language) languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
  }
  const languageTotal = [...languageCounts.values()].reduce((sum, count) => sum + count, 0);
  const languageStats = [...languageCounts.entries()]
    .map(([name, count]) => ({ name, count, percentage: Math.round((count / languageTotal) * 100) }))
    .sort((a, b) => b.count - a.count);

  const oldSnapshots = JSON.parse(await readFile(dataPath, 'utf8'));
  const oldData = oldSnapshots['last-year']?.data ?? {};
  const snapshot = {
    lastSynced: new Date().toISOString(),
    data: {
      ...oldData,
      totalRepos: profile.public_repos,
      totalCommits: commitSearch.total_count,
      totalPRs: prSearch.total_count,
      totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      followers: profile.followers,
      contributionCalendar: { totalContributions: calendar.totalContributions, weeks: calendar.weeks },
      pinnedItems: currentPinnedRepos(profileHtml, repos),
      languageStats,
      streaks: calendar.streaks,
      recentActivity: events.slice(0, 12).map((event) => ({
        type: event.type,
        text: formatEvent(event),
        repo: event.repo?.name ?? '',
        createdAt: event.created_at,
        id: event.id,
      })),
    },
  };

  oldSnapshots['last-year'] = snapshot;
  await writeFile(dataPath, `${JSON.stringify(oldSnapshots, null, 2)}\n`, 'utf8');
  console.log(`Updated ${username}: ${calendar.totalContributions} contributions, ${profile.public_repos} repositories, ${events.length} recent events.`);
  console.log(`Snapshot saved to ${dataPath}`);
}

main().catch((error) => {
  console.error(`GitHub activity refresh failed: ${error.message}`);
  process.exitCode = 1;
});
