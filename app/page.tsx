'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Sidebar from '@/components/Sidebar';
import StatsBar from '@/components/StatsBar';
import ContributionGraph from '@/components/ContributionGraph';
import RepoGrid from '@/components/RepoGrid';

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GitHubData {
  personal: { calendar: ContributionCalendar; total: number; login: string };
  professional: { calendar: ContributionCalendar; total: number; login: string };
  unified: { calendar: ContributionCalendar; total: number };
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

interface RepoData {
  repos: Repo[];
  stats: {
    totalRepos: number;
    totalStars: number;
    totalFollowers: number;
    personalUser: {
      name: string;
      bio: string;
      location: string;
      company: string;
      avatar: string;
    };
  };
}

export default function Home() {
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/github')
        .then((r) => r.json())
        .then((d) => {
          if (d.error) setGithubError(d.error);
          else setGithubData(d);
        })
        .catch((e) => setGithubError(e.message)),
      fetch('/api/repos')
        .then((r) => r.json())
        .then((d) => {
          if (d.error) setRepoError(d.error);
          else setRepoData(d);
        })
        .catch((e) => setRepoError(e.message)),
    ]).finally(() => setLoading(false));
  }, []);

  const totalContributions =
    (githubData?.unified?.total ?? 0) ||
    (githubData?.personal?.total ?? 0) + (githubData?.professional?.total ?? 0);

  return (
    <>
      <Nav />

      {/* Hero banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Senior Full‑Stack Engineer
            </h1>
            <p className="hero-subtitle">
              Building scalable LMS platforms, AI‑integrated experiences, and open-source tools.
              <br />
              <span style={{ color: 'var(--accent)' }}>Angular · Node.js · React · Next.js · LangGraph</span>
            </p>
          </div>
          <div className="hero-stats-mini">
            <div className="hero-stat-pill">
              <span className="source-badge badge-personal">@danyal36</span>
              <span style={{ color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-syne)', fontWeight: 700 }}>
                Personal
              </span>
            </div>
            <span style={{ color: 'var(--muted)', fontSize: '14px' }}>+</span>
            <div className="hero-stat-pill">
              <span className="source-badge badge-work">@danyal-361</span>
              <span style={{ color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-syne)', fontWeight: 700 }}>
                Professional
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <Sidebar
          personalUser={repoData?.stats.personalUser}
          loading={loading}
        />

        <main className="main">
          {/* Stats */}
          <StatsBar
            totalRepos={repoData?.stats.totalRepos}
            totalStars={repoData?.stats.totalStars}
            totalFollowers={repoData?.stats.totalFollowers}
            totalContributions={totalContributions || undefined}
            loading={loading}
          />

          {/* Contribution Graph */}
          <ContributionGraph
            personal={githubData?.personal?.calendar}
            professional={githubData?.professional?.calendar}
            unified={githubData?.unified?.calendar}
            loading={loading && !githubData}
            error={githubError ?? undefined}
          />

          {/* Repos */}
          <RepoGrid
            repos={repoData?.repos}
            loading={loading && !repoData}
          />

          {/* Tech Stack highlight */}
          <div className="tech-section fade-in">
            <div className="section-title" style={{ marginBottom: '16px' }}>Technology Expertise</div>
            <div className="tech-grid">
              {[
                { category: 'Frontend', items: ['Angular', 'React', 'Next.js', 'Vue.js', 'TypeScript'] },
                { category: 'Backend', items: ['Node.js', 'Express', 'NestJS', 'REST APIs', 'GraphQL'] },
                { category: 'Database', items: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis'] },
                { category: 'AI / LLM', items: ['OpenAI API', 'LangGraph', 'RAG', 'LangChain', 'Embeddings'] },
                { category: 'DevOps', items: ['AWS', 'Docker', 'CI/CD', 'GitHub Actions', 'Vercel'] },
                { category: 'Tools', items: ['Git', 'Jira', 'Figma', 'Postman', 'Linux'] },
              ].map((group) => (
                <div key={group.category} className="tech-group">
                  <div className="tech-group-label">{group.category}</div>
                  <div className="tech-list">
                    {group.items.map((item) => <span key={item} className="tech-pill">{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="contact-section fade-in">
            <div className="section-title" style={{ marginBottom: '16px' }}>Get In Touch</div>
            <div className="contact-cards">
              <a className="contact-card" href="mailto:ch.danyal36@gmail.com">
                <svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#58a6ff' }}>
                  <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 8.842a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.82l6.5-3.75Z"/>
                </svg>
                <div>
                  <div className="contact-card-label">Email</div>
                  <div className="contact-card-value">ch.danyal36@gmail.com</div>
                </div>
              </a>
              <a className="contact-card" href="https://linkedin.com/in/danyalahmad36" target="_blank" rel="noopener noreferrer">
                <svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0077b5' }}>
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <div>
                  <div className="contact-card-label">LinkedIn</div>
                  <div className="contact-card-value">danyalahmad36</div>
                </div>
              </a>
              <a className="contact-card" href="https://github.com/danyal36" target="_blank" rel="noopener noreferrer">
                <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#e6edf3' }}>
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                <div>
                  <div className="contact-card-label">GitHub (Personal)</div>
                  <div className="contact-card-value">@danyal36</div>
                </div>
              </a>
            </div>
          </div>

          {/* Footer */}
          <footer className="footer">
            <span>Built with Next.js · Data via GitHub GraphQL API · Real contributions, merged from two accounts</span>
          </footer>
        </main>
      </div>
    </>
  );
}
