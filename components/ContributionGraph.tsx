'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface Props {
  personal?: ContributionCalendar;
  professional?: ContributionCalendar;
  unified?: ContributionCalendar;
  loading?: boolean;
  error?: string;
}

type Mode = 'unified' | 'personal' | 'professional';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getLevel(count: number, max: number): number {
  if (count === 0) return 0;
  if (max === 0) return 0;
  const ratio = count / max;
  if (ratio < 0.15) return 1;
  if (ratio < 0.4) return 2;
  if (ratio < 0.7) return 3;
  return 4;
}

const LEVEL_COLORS = [
  '#161b22', // 0 = empty
  '#0e4429', // 1 = light
  '#006d32', // 2 = medium  
  '#26a641', // 3 = medium-high
  '#39d353', // 4 = high
];

export default function ContributionGraph({ personal, professional, unified, loading, error }: Props) {
  const [mode, setMode] = useState<Mode>('unified');
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calendar = mode === 'personal' ? personal : mode === 'professional' ? professional : unified;

  const allCounts = calendar?.weeks.flatMap(w => w.contributionDays.map(d => d.contributionCount)) ?? [];
  const maxCount = Math.max(...allCounts, 1);
  const total = calendar?.totalContributions ?? 0;

  // Build month labels
  const monthLabels: { label: string; colIndex: number }[] = [];
  if (calendar) {
    let lastMonth = -1;
    calendar.weeks.forEach((week, wi) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const month = new Date(firstDay.date + 'T00:00:00').getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ label: MONTH_NAMES[month], colIndex: wi });
          lastMonth = month;
        }
      }
    });
  }

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, day: ContributionDay) => {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const dateObj = new Date(day.date + 'T00:00:00');
      const dateStr = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const count = day.contributionCount;
      const text = count === 0
        ? `No contributions on ${dateStr}`
        : `${count} contribution${count !== 1 ? 's' : ''} on ${dateStr}`;

      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top - 10;
      setTooltip({ text, x, y });
    },
    []
  );

  if (loading) {
    return (
      <div className="contrib-section">
        <div className="contrib-skeleton">
          <div className="skeleton" style={{ height: '16px', width: '240px', marginBottom: '12px' }} />
          <div style={{ display: 'flex', gap: '3px' }}>
            {Array.from({ length: 53 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <div key={j} className="skeleton" style={{ width: '11px', height: '11px', borderRadius: '2px' }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contrib-section">
        <div className="error-note">
          ⚠️ {error}. Make sure <code>GITHUB_TOKEN</code> is set in your environment.
        </div>
      </div>
    );
  }

  return (
    <div className="contrib-section">
      {/* Header */}
      <div className="contrib-header">
        <div className="contrib-title">
          <strong style={{ color: '#3fb950' }}>{total.toLocaleString()}</strong> contributions in the last year
        </div>

        {/* Toggle */}
        <div className="mode-toggle">
          {(['unified', 'personal', 'professional'] as Mode[]).map((m) => (
            <button
              key={m}
              className={`toggle-btn ${mode === m ? 'active' : ''}`}
              onClick={() => setMode(m)}
              style={{
                borderColor: mode === m
                  ? m === 'personal' ? '#58a6ff'
                  : m === 'professional' ? '#3fb950'
                  : '#a371f7'
                  : undefined,
                color: mode === m
                  ? m === 'personal' ? '#58a6ff'
                  : m === 'professional' ? '#3fb950'
                  : '#a371f7'
                  : undefined,
                background: mode === m
                  ? m === 'personal' ? '#1f6feb22'
                  : m === 'professional' ? '#23863622'
                  : '#6e40c922'
                  : undefined,
              }}
            >
              {m === 'unified' && '⊕ Unified'}
              {m === 'personal' && '○ Personal'}
              {m === 'professional' && '◆ Professional'}
            </button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="graph-scroll" ref={containerRef} style={{ position: 'relative' }}>
        {/* Month labels */}
        <div style={{ display: 'flex', marginBottom: '4px', paddingLeft: '0px', minWidth: 'max-content' }}>
          {calendar?.weeks.map((_, wi) => {
            const label = monthLabels.find(m => m.colIndex === wi);
            return (
              <div
                key={wi}
                style={{ width: '14px', fontSize: '10px', color: '#8b949e', flexShrink: 0 }}
              >
                {label ? label.label : ''}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="graph-wrap">
          {calendar?.weeks.map((week, wi) => (
            <div key={wi} className="graph-col">
              {week.contributionDays.map((day) => {
                const level = getLevel(day.contributionCount, maxCount);
                return (
                  <div
                    key={day.date}
                    className="graph-cell"
                    style={{ background: LEVEL_COLORS[level] }}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="graph-tooltip"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="contrib-legend">
        <span>Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <div key={i} className="legend-cell" style={{ background: color }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
