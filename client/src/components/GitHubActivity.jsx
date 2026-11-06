import { useEffect, useRef, useState } from 'react';
import {
  BookOpen, GitCommitHorizontal, GitPullRequest, Star, Users,
  Flame, Code, Clock, GitFork, ChevronRight,
} from 'lucide-react';
import DecryptedText from './DecryptedText';
import githubYears from '@/data/github-years.json';

const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;

const LEVEL_COLORS = [
  'rgba(255,255,255,0.04)',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353',
];

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

const STAT_ACCENTS = [
  'var(--color-primary-rgb)',
  '168, 85, 247',
  '236, 72, 153',
  '245, 158, 11',
  '6, 182, 212',
];

const LANG_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Kotlin: '#A97BFF',
  'C++': '#f34b7d',
  'C#': '#178600',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Dart: '#00B4AB',
  Shell: '#89e051',
};

const YEAR_OPTIONS = [
  { value: 'last-year', label: 'Last year' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];

export default function GitHubActivity() {
  const [selectedYear, setSelectedYear] = useState('last-year');
  const [data, setData] = useState(githubYears['last-year']?.data ?? null);
  const [lastSynced, setLastSynced] = useState(githubYears['last-year']?.lastSynced ?? null);
  const [tooltip, setTooltip] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const snapshot = githubYears[selectedYear];
    setData(snapshot?.data ?? null);
    setLastSynced(snapshot?.lastSynced ?? null);
  }, [selectedYear]);

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

  if (!data) return null;

  const {
    totalRepos, totalCommits, totalPRs, totalStars, followers,
    contributionCalendar, pinnedItems, languageStats, streaks, recentActivity,
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
    { icon: GitCommitHorizontal, label: 'Commits', value: totalCommits?.toLocaleString() || 0 },
    { icon: GitPullRequest, label: 'Pull Requests', value: totalPRs?.toLocaleString() || 0 },
    { icon: Star, label: 'Stars Received', value: totalStars?.toLocaleString() || 0 },
    { icon: Users, label: 'Followers', value: followers || 0 },
  ];

  const syncedText = lastSynced ? timeAgo(lastSynced) : '';

  const graphWidth = weeks.length * step + 40;
  const graphHeight = 7 * step + 20;

  const yearLabel = selectedYear === 'last-year' ? 'the last year' : selectedYear;

  return (
    <section id="github" className="py-16 relative overflow-hidden" ref={ref}>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* ── Header ── */}
        <div className="mb-8 reveal">
          <div className="flex items-center gap-3">
            <span className="text-primary font-bold text-xl leading-none font-mono">&gt;_</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none">
              <DecryptedText
                text="GITHUB ACTIVITY"
                animateOn="view"
                sequential
                revealDirection="start"
                className="text-primary glow-text"
                encryptedClassName="text-primary/40"
              />
            </h2>
          </div>
          <p className="text-muted mt-2 text-xs tracking-wider uppercase">
            Building. Learning. Shipping.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8 reveal">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="glass rounded-xl p-3 md:p-4 text-center border border-glass/5 hover:border-glass/10 transition-all">
                <Icon size={18} className="mx-auto mb-1.5" style={{ color: `rgb(${STAT_ACCENTS[i]})` }} />
                <div className="text-xl md:text-2xl font-bold text-white">{card.value}</div>
                <div className="text-[10px] text-muted font-medium tracking-wider mt-0.5 uppercase">{card.label}</div>
              </div>
            );
          })}
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-5">
          {/* ═══════ LEFT COLUMN ═══════ */}
          <div className="space-y-5">

            {/* ── Contribution Calendar ── */}
            {weeks.length > 0 && (
              <div className="glass rounded-2xl p-4 reveal">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    {contributionCalendar.totalContributions.toLocaleString()} contributions in {yearLabel}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {YEAR_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSelectedYear(opt.value)}
                          className={`px-2 py-1 text-[10px] rounded-md font-medium transition-all ${
                            selectedYear === opt.value
                              ? 'bg-primary/20 text-primary'
                              : 'text-muted hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <span className="w-px h-4 bg-white/10" />
                    {lastSynced && (
                      <span className="text-[10px] text-muted flex items-center gap-1">
                        <Clock size={10} /> {syncedText}
                      </span>
                    )}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto pb-2">
                  <svg width={graphWidth} height={graphHeight} className="min-w-[600px] sm:min-w-0">
                    {monthLabels.map((m, i) => (
                      <text key={i} x={m.x + 40} y={10} fontSize="9" fill="rgb(var(--color-text-muted-rgb) / 0.7)" className="select-none">
                        {m.label}
                      </text>
                    ))}
                    {[0, 2, 4].map(row => (
                      <text key={row} x={0} y={row * step + 30} fontSize="9" fill="rgb(var(--color-text-muted-rgb) / 0.7)" className="select-none">
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
                              const r = e.target.getBoundingClientRect();
                              setTooltip({
                                x: r.left + r.width / 2,
                                y: r.top - 8,
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
                <div className="flex items-center justify-end gap-1 mt-2">
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

            {/* ── Pinned Repositories ── */}
            {pinnedItems?.length > 0 && (
              <div className="glass rounded-2xl p-4 reveal">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />
                    Pinned Repositories
                  </h3>
                  <a
                    href="https://github.com/csakib049?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    View all <ChevronRight size={12} />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pinnedItems.slice(0, 4).map((repo, i) => (
                    <a
                      key={i}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-strong rounded-xl p-3.5 border border-glass/5 hover:border-primary/20 transition-all group block"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <GitFork size={13} className="text-muted shrink-0" />
                        <h4 className="text-sm font-semibold text-primary truncate">{repo.name}</h4>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-muted line-clamp-2 mb-2.5 leading-relaxed">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-3">
                        {repo.primaryLanguage && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.primaryLanguage.color || 'rgb(var(--color-primary-rgb))' }} />
                            <span className="text-[10px] text-muted">{repo.primaryLanguage.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star size={9} className="text-muted" />
                          <span className="text-[10px] text-muted">{repo.stargazerCount || 0}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {recentActivity?.length > 0 && (
              <div className="glass rounded-2xl p-4 reveal">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-primary" />
                  <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {recentActivity.slice(0, 8).map((activity) => (
                    <a
                      key={activity.id}
                      href={`https://github.com/${activity.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 rounded-lg hover:bg-white/5 p-2 -mx-2 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-main leading-relaxed">{activity.text}</span>
                        <span className="block text-[10px] text-muted mt-1">{timeAgo(activity.createdAt)}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══════ RIGHT SIDEBAR ═══════ */}
          <div className="space-y-5">

            {/* ── Most Used Languages ── */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Code size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-white">Most Used Languages</h3>
              </div>
              {languageStats && languageStats.length > 0 ? (
                <div className="space-y-3">
                  {languageStats.slice(0, 8).map((lang, i) => {
                    const barColor = LANG_COLORS[lang.name] || 'rgb(var(--color-primary-rgb))';
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: barColor }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white truncate">{lang.name}</span>
                            <span className="text-muted shrink-0 ml-2">{lang.percentage}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${lang.percentage}%`, backgroundColor: barColor }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted">No language data available.</p>
              )}
            </div>

            {/* ── Current Streak ── */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={16} className="text-orange-500" />
                <h3 className="text-sm font-semibold text-white">Current Streak</h3>
              </div>
              {streaks ? (
                <div className="text-center">
                  <Flame size={32} className="mx-auto mb-1 text-orange-500" />
                  <div className="text-3xl font-bold text-white">{streaks.currentStreak}</div>
                  <div className="text-xs text-muted mt-1">Days</div>
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Longest Streak</span>
                      <span className="text-white font-semibold">{streaks.longestStreak} days</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted">No streak data available.</p>
              )}
            </div>

            {/* ── Terminal Footer ── */}
            <div>
              <p className="text-xs text-muted font-mono flex items-center gap-2">
                <span className="text-primary">&gt;_</span>
                Building ideas into impact
                <span className="w-1.5 h-4 bg-primary/80 animate-blink-line inline-block" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
