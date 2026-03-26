'use client';

const langColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Angular: '#dd0031',
  Shell: '#89e051',
  Java: '#b07219',
  Go: '#00ADD8',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Dart: '#00B4AB',
  'C#': '#178600',
  'C++': '#f34b7d',
  Dockerfile: '#384d54',
  SCSS: '#c6538c',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  _source: 'personal' | 'work';
}

interface Props {
  repos?: Repo[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="repo-card" style={{ gap: '10px' }}>
      <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '4px' }} />
      <div className="skeleton" style={{ height: '12px', width: '90%', borderRadius: '4px' }} />
      <div className="skeleton" style={{ height: '12px', width: '70%', borderRadius: '4px' }} />
      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <div className="skeleton" style={{ height: '12px', width: '60px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ height: '12px', width: '40px', borderRadius: '4px' }} />
      </div>
    </div>
  );
}

export default function RepoGrid({ repos, loading }: Props) {
  if (loading || !repos) {
    return (
      <div>
        <div className="section-header">
          <div className="section-title">Pinned Repositories</div>
        </div>
        <div className="repos-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Pinned Repositories</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className="source-badge badge-personal">personal</span>
          <span className="source-badge badge-work">work</span>
        </div>
      </div>
      <div className="repos-grid">
        {repos.map((repo, i) => {
          const color = langColors[repo.language ?? ''] ?? '#8b949e';
          return (
            <a
              key={repo.id}
              className="repo-card fade-in"
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="repo-card-header">
                <div className="repo-name">
                  <svg style={{ marginRight: '4px', verticalAlign: '-2px' }} height="13" width="13" viewBox="0 0 16 16" fill="var(--accent)">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8V1.5Z"/>
                  </svg>
                  {repo.name}
                </div>
                <span className={`source-badge ${repo._source === 'personal' ? 'badge-personal' : 'badge-work'}`}>
                  {repo._source}
                </span>
              </div>
              <div className="repo-desc">{repo.description || 'No description provided.'}</div>
              <div className="repo-footer">
                {repo.language && (
                  <div className="repo-lang">
                    <div className="lang-dot" style={{ background: color }} />
                    {repo.language}
                  </div>
                )}
                <div className="repo-stat">
                  <svg height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
                  </svg>
                  {repo.stargazers_count}
                </div>
                <div className="repo-stat">
                  <svg height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
                  </svg>
                  {repo.forks_count}
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--muted)' }}>
                  {timeAgo(repo.updated_at)}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
