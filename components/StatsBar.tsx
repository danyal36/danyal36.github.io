'use client';

import { useEffect, useRef } from 'react';

interface Stat {
  value: number | string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  totalRepos?: number;
  totalStars?: number;
  totalFollowers?: number;
  totalContributions?: number;
  loading?: boolean;
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const startRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const start = startRef.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      if (ref.current) {
        ref.current.textContent = current.toLocaleString();
      }
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        startRef.current = end;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return <div ref={ref} className="stat-num">—</div>;
}

export default function StatsBar({ totalRepos, totalStars, totalFollowers, totalContributions, loading }: Props) {
  const stats = [
    {
      label: 'Repositories',
      value: totalRepos,
      icon: (
        <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#58a6ff' }}>
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8V1.5Z"/>
        </svg>
      ),
    },
    {
      label: 'Stars Earned',
      value: totalStars,
      icon: (
        <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#d29922' }}>
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
        </svg>
      ),
    },
    {
      label: 'Followers',
      value: totalFollowers,
      icon: (
        <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#3fb950' }}>
          <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.54-.625 3.5 3.5 0 0 0-6.06-1.56.749.749 0 0 1-1.055.174A4.498 4.498 0 0 1 5.5 5.5Z"/>
        </svg>
      ),
    },
    {
      label: 'Contributions',
      value: totalContributions,
      icon: (
        <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#a371f7' }}>
          <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="stats-bar">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card fade-in">
          <div className="stat-icon">{stat.icon}</div>
          {loading || stat.value === undefined ? (
            <div className="skeleton" style={{ height: '36px', width: '60px', margin: '8px auto 4px' }} />
          ) : (
            <AnimatedNumber value={stat.value} />
          )}
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
