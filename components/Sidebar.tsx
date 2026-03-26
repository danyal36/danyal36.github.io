'use client';

interface PersonalUser {
  name: string;
  bio: string;
  location: string;
  company: string;
  avatar: string;
}

interface Props {
  personalUser?: PersonalUser;
  loading?: boolean;
}

const TECH_STACK = [
  'Angular', 'Node.js', 'React', 'TypeScript', 'Next.js',
  'MySQL', 'MongoDB', 'Vue.js', 'AWS', 'Docker',
  'LangGraph', 'OpenAI API',
];

export default function Sidebar({ personalUser, loading }: Props) {
  return (
    <aside className="sidebar">
      {/* Avatar */}
      <div className="avatar-wrap">
        {loading || !personalUser?.avatar ? (
          <div className="avatar-placeholder">DA</div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="avatar"
            src={personalUser.avatar}
            alt="Danyal Ahmad"
            width={296}
            height={296}
          />
        )}
      </div>

      {/* Name */}
      <div>
        <div className="name">Danyal Ahmad</div>
        <div className="username">danyal36 · danyal-361</div>
      </div>

      {/* Bio */}
      <div className="bio">
        {personalUser?.bio || 'Senior Full-Stack Engineer · Angular · Node.js · React · AI/LLM Integration · LMS Platforms'}
      </div>

      {/* LinkedIn CTA */}
      <a className="btn-cta" href="https://linkedin.com/in/danyalahmad36" target="_blank" rel="noopener noreferrer">
        <svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
        Connect on LinkedIn
      </a>

      <hr className="divider" />

      {/* GitHub Profiles */}
      <div>
        <div className="section-label">GitHub Profiles</div>
        <div className="accounts-list">
          <a className="account-card" href="https://github.com/danyal36" target="_blank" rel="noopener noreferrer">
            <span className="account-dot" style={{ background: '#58a6ff' }} />
            <div className="account-info">
              <span className="account-handle">@danyal36</span>
              <div className="account-desc">Personal · Open source · Side projects</div>
            </div>
            <svg height="12" width="12" viewBox="0 0 16 16" fill="var(--muted)">
              <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.042-.018.75.75 0 0 1-.018-1.042l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z"/>
            </svg>
          </a>
          <a className="account-card" href="https://github.com/danyal-361" target="_blank" rel="noopener noreferrer">
            <span className="account-dot" style={{ background: '#3fb950' }} />
            <div className="account-info">
              <span className="account-handle">@danyal-361</span>
              <div className="account-desc">Professional · Niche Academy · Nov 2024–present</div>
            </div>
            <svg height="12" width="12" viewBox="0 0 16 16" fill="var(--muted)">
              <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.042-.018.75.75 0 0 1-.018-1.042l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z"/>
            </svg>
          </a>
        </div>
      </div>

      <hr className="divider" />

      {/* Tech stack */}
      <div>
        <div className="section-label">Stack</div>
        <div className="tech-list">
          {TECH_STACK.map((t) => (
            <span key={t} className="tech-pill">{t}</span>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Info rows */}
      <div className="stat-rows">
        <div className="stat-row">
          <svg height="16" width="16" viewBox="0 0 16 16" fill="var(--muted)">
            <path d="M1.5 14.25c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v12.5ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Zm0-2.5h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM8 6h.5a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5Zm0-2.5h.5a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5Zm0 8.5H8a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 0 1.5Z"/>
          </svg>
          Niche Academy · Senior SWE
        </div>
        <div className="stat-row">
          <svg height="16" width="16" viewBox="0 0 16 16" fill="var(--muted)">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/>
          </svg>
          Fleet, Surrey, UK
        </div>
        <div className="stat-row">
          <svg height="16" width="16" viewBox="0 0 16 16" fill="var(--muted)">
            <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 8.842a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.82l6.5-3.75Z"/>
          </svg>
          <a href="mailto:ch.danyal36@gmail.com">ch.danyal36@gmail.com</a>
        </div>
      </div>
    </aside>
  );
}
