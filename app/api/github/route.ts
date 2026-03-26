import { NextResponse } from 'next/server';

const PERSONAL = 'danyal36';
const PROFESSIONAL = 'danyal-361';

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

interface GHResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar;
      };
    };
  };
}

// Simple server-side cache
let cache: { data: object; ts: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

async function fetchContributions(login: string): Promise<ContributionCalendar> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set');

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL returned ${res.status}`);
  }

  const json: GHResponse = await res.json();

  if (!json?.data?.user) {
    throw new Error(`No data returned for user: ${login}`);
  }

  return json.data.user.contributionsCollection.contributionCalendar;
}

function mergeCalendars(
  cal1: ContributionCalendar,
  cal2: ContributionCalendar
): ContributionCalendar {
  // Build a date map
  const dateMap: Record<string, number> = {};

  for (const week of cal1.weeks) {
    for (const day of week.contributionDays) {
      dateMap[day.date] = (dateMap[day.date] || 0) + day.contributionCount;
    }
  }

  for (const week of cal2.weeks) {
    for (const day of week.contributionDays) {
      dateMap[day.date] = (dateMap[day.date] || 0) + day.contributionCount;
    }
  }

  // Rebuild using cal1 structure (all dates present)
  const mergedWeeks: ContributionWeek[] = cal1.weeks.map((week) => ({
    contributionDays: week.contributionDays.map((day) => ({
      date: day.date,
      contributionCount: dateMap[day.date] || 0,
      color: day.color,
    })),
  }));

  const total = Object.values(dateMap).reduce((a, b) => a + b, 0);

  return {
    totalContributions: total,
    weeks: mergedWeeks,
  };
}

export async function GET() {
  // Check cache
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: { 'X-Cache': 'HIT' },
    });
  }

  try {
    const [personal, professional] = await Promise.all([
      fetchContributions(PERSONAL),
      fetchContributions(PROFESSIONAL),
    ]);

    const unified = mergeCalendars(personal, professional);

    const data = {
      personal: {
        calendar: personal,
        total: personal.totalContributions,
        login: PERSONAL,
      },
      professional: {
        calendar: professional,
        total: professional.totalContributions,
        login: PROFESSIONAL,
      },
      unified: {
        calendar: unified,
        total: unified.totalContributions,
      },
    };

    cache = { data, ts: Date.now() };

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
