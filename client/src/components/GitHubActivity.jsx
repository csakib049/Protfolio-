import { useEffect, useRef, useState } from 'react';
import {
  GitFork, GitCommitHorizontal, GitPullRequest, Star, Users,
  Flame, Code, ExternalLink, Clock, BookOpen,
} from 'lucide-react';
import api from '@/api';

const LEVEL_COLORS = [
  'rgba(255,255,255,0.04)',
  'rgba(168,85,247,0.15)',
  'rgba(168,85,247,0.30)',
  'rgba(168,85,247,0.50)',
  'rgba(168,85,247,0.80)',
];

const CELL = 11;
const GAP = 2;
const STEP = CELL + GAP;

function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 7) return 2;
  if (count <= 15) return 3;
  return 4;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function getDayLabel(row) {
  return ['Mon', '', 'Wed', '', 'Fri', '', ''][row];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GitHubActivity() {
  const [data, setData] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/github')
      .then(({ data: res }) => {
        setData(res.data);
        setLastSynced(res.lastSynced);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !data) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll('.reveal').forEach((r, i) => {
              setTimeout(() => r.classList.add('visible'), i * 80);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [data]);

  if (loading) {
    return (
      <section className="py-24 relative" ref={ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-80 bg-glass/5 rounded-xl mx-auto" />
            <div className="h-6 w-48 bg-glass/5 rounded-xl mx-auto" />
            <div className="grid grid-cols-5 gap-4">
              {[1,2,3,4,5].map(i => <div key={i} className="h-24 bg-glass/5 rounded-2xl" />)}
            </div>
            <div className="h-48 bg-glass/5 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const {
    totalRepos, totalCommits, totalPRs, totalStars, followers,
    contributionCalendar, pinnedItems, languageStats, streaks,
  } = data;

  const weeks = contributionCalendar?.weeks || [];
  const cellSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 9 : CELL;
  const step = cellSize + GAP;

  const monthLabels = [];
  if (weeks.length > 0) {
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstDay = week.contributionDays?.[0];
      if (firstDay) {
        const m = new Date(firstDay.date).getMonth();
        if (m !== lastMonth) {
          monthLabels.push({ label: MONTHS[m], x: wi * step });
          lastMonth = m;
        }
      }
    });
  }

  const statCards = [
    { icon: BookOpen, label: 'Repositories', value: totalRepos },
    { icon: GitCommitHorizontal, label: 'Commits (1y)', value: totalCommits?.toLocaleString() || 0 },
    { icon: GitPullRequest, label: 'Pull Requests (1y)', value: totalPRs?.toLocaleString() || 0 },
    { icon: Star, label: 'Stars Received', value: totalStars?.toLocaleString() || 0 },
    { icon: Users, label: 'Followers', value: followers || 0 },
  ];

  const syncedText = lastSynced
    ? `Last synced ${timeAgo(lastSynced)}`
    : '';

  const graphWidth = weeks.length * step + 40;
  const graphHeight = 7 * step + 20;

  return (
    <section id="github" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            <span className="text-primary glow-text">GITHUB ACTIVITY</span>
          </h2>
          <p className="text-muted mt-4 text-sm tracking-wider uppercase">
            Building. Learning. Shipping.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12 reveal">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="glass rounded-2xl p-4 md:p-5 text-center border border-glass/5">
                <Icon size={22} className="text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{card.value}</div>
                <div className="text-[10px] text-muted font-medium tracking-wider mt-1 uppercase">{card.label}</div>
              </div>
            );
          })}
        </div>

        {/* Contribution Heatmap */}
        {weeks.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-12 reveal">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                {contributionCalendar.totalContributions.toLocaleString()} contributions in the last year
              </h3>
              {syncedText && (
                <span className="text-[10px] text-muted flex items-center gap-1">
                  <Clock size={10} /> {syncedText}
                </span>
              )}
            </div>
            <div className="overflow-x-auto pb-2">
              <svg width={graphWidth} height={graphHeight} className="min-w-[600px] sm:min-w-0">
                {monthLabels.map((m, i) => (
                  <text key={i} x={m.x + 40} y={10} fontSize="9" fill="rgb(var(--color-muted-rgb) / 0.7)" className="select-none">
                    {m.label}
                  </text>
                ))}
                {[0, 2, 4].map(row => (
                  <text key={row} x={0} y={row * step + 30} fontSize="9" fill="rgb(var(--color-muted-rgb) / 0.7)" className="select-none">
                    {getDayLabel(row)}
                  </text>
                ))}
                {weeks.map((week, wi) =>
                  (week.contributionDays || []).map((day, di) => {
                    const row = (di + 6) % 7;
                    const level = getLevel(day.contributionCount);
                    const x = wi * step + 40;
                    const y = row * step + 24;
                    return (
                      <rect
                        key={`${wi}-${di}`}
                        x={x}
                        y={y}
                        width={cellSize}
                        height={cellSize}
                        rx="2"
                        fill={LEVEL_COLORS[level]}
                        className="cursor-pointer transition-all duration-100 hover:brightness-150"
                        onMouseEnter={(e) => {
                          const rect = e.target.getBoundingClientRect();
                          setTooltip({
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                            count: day.contributionCount,
                            date: day.date,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })
                )}
              </svg>
            </div>
            <div className="flex items-center justify-end gap-1 mt-3">
              <span className="text-[10px] text-muted mr-1">Less</span>
              {LEVEL_COLORS.map((c, i) => (
                <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
              <span className="text-[10px] text-muted ml-1">More</span>
            </div>
          </div>
        )}

        {tooltip && (
          <div
            className="fixed z-50 px-2.5 py-1.5 rounded-lg bg-black/90 backdrop-blur-sm border border-white/10 text-xs text-white pointer-events-none whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
          >
            {tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''} on {tooltip.date}
          </div>
        )}

        {/* Languages + Streaks */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 reveal">
          <div className="glass rounded-2xl p-6 border border-glass/5">
            <div className="flex items-center gap-2 mb-4">
              <Code size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-white">Most Used Languages</h3>
            </div>
            {languageStats?.length > 0 ? (
              <div className="space-y-3">
                {languageStats.slice(0, 8).map((lang, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white truncate">{lang.name}</span>
                        <span className="text-muted shrink-0 ml-2">{lang.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/60 transition-all"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No language data available.</p>
            )}
          </div>

          <div className="glass rounded-2xl p-6 border border-glass/5">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-white">Streaks</h3>
            </div>
            {streaks ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-glass/5 rounded-xl p-4 text-center border border-glass/10">
                  <div className="text-3xl font-bold text-white">{streaks.currentStreak}</div>
                  <div className="text-[10px] text-muted font-medium tracking-wider mt-1 uppercase">Current Streak</div>
                  <div className="text-[10px] text-muted mt-1">days</div>
                </div>
                <div className="bg-glass/5 rounded-xl p-4 text-center border border-glass/10">
                  <div className="text-3xl font-bold text-white">{streaks.longestStreak}</div>
                  <div className="text-[10px] text-muted font-medium tracking-wider mt-1 uppercase">Longest Streak</div>
                  <div className="text-[10px] text-muted mt-1">days</div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted">No streak data available.</p>
            )}
          </div>
        </div>

        {/* Pinned Repositories */}
        {pinnedItems?.length > 0 && (
          <div className="mb-12 reveal">
            <h3 className="text-sm font-semibold text-white mb-4">Pinned Repositories</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedItems.map((repo, i) => (
                <a
                  key={i}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-2xl p-5 border border-glass/5 hover:border-primary/20 transition-all group block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GitFork size={14} className="text-muted shrink-0" />
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                      {repo.name}
                    </h4>
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted line-clamp-2 mb-3 leading-relaxed">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-4">
                    {repo.primaryLanguage && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.primaryLanguage.color || 'rgb(var(--color-primary-rgb))' }} />
                        <span className="text-[10px] text-muted">{repo.primaryLanguage.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-muted" />
                      <span className="text-[10px] text-muted">{repo.stargazerCount || 0}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <a
              href={`https://github.com/csakib049`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-4"
            >
              View all repositories <ExternalLink size={10} />
            </a>
          </div>
        )}


      </div>
    </section>
  );
}
