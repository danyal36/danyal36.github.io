import { NextResponse } from 'next/server';

const PERSONAL = 'danyal36';
const PROFESSIONAL = 'danyal-361';
const GH = 'https://api.github.com';

// Simple server-side cache
let cache: { data: object; ts: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes

interface GHRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  _source?: 'personal' | 'work';
}

interface GHUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
  email: string;
  company: string;
}

async function ghFetch<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${GH}${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    const [u1, u2, r1, r2] = await Promise.all([
      ghFetch<GHUser>(`/users/${PERSONAL}`),
      ghFetch<GHUser>(`/users/${PROFESSIONAL}`),
      ghFetch<GHRepo[]>(`/users/${PERSONAL}/repos?sort=stars&per_page=30`),
      ghFetch<GHRepo[]>(`/users/${PROFESSIONAL}/repos?sort=stars&per_page=30`),
    ]);

    // Tag repos with source
    const tagged = [
      ...r1.filter((r) => !r.fork).map((r) => ({ ...r, _source: 'personal' as const })),
      ...r2.filter((r) => !r.fork).map((r) => ({ ...r, _source: 'work' as const })),
    ]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    // Aggregate stars across all repos (not just top 6)
    const totalStars = [...r1, ...r2].reduce(
      (sum, r) => sum + r.stargazers_count,
      0
    );

    const data = {
      repos: tagged,
      stats: {
        totalRepos: u1.public_repos + u2.public_repos,
        totalStars,
        totalFollowers: u1.followers + u2.followers,
        personalAvatar: u1.avatar_url,
        professionalAvatar: u2.avatar_url,
        personalUser: {
          name: u1.name,
          bio: u1.bio,
          location: u1.location,
          company: u1.company,
          avatar: u1.avatar_url,
        },
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
