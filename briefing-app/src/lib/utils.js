export const VERTICAL_COLORS = {
  'AI Developer Tools': 'bg-indigo-900/40 text-indigo-300 border-indigo-800/50',
  'Manufacturing & Industrial': 'bg-orange-900/40 text-orange-300 border-orange-800/50',
  'Supercomputing / Quantum': 'bg-violet-900/40 text-violet-300 border-violet-800/50',
  'CRISP': 'bg-sky-900/40 text-sky-300 border-sky-800/50',
  'FinTech / FSI': 'bg-emerald-900/40 text-emerald-300 border-emerald-800/50',
  'Healthcare & Life Sciences': 'bg-rose-900/40 text-rose-300 border-rose-800/50',
  'Robotics': 'bg-amber-900/40 text-amber-300 border-amber-800/50',
  'Federal / US Public Sector / Defense': 'bg-slate-800/60 text-slate-300 border-slate-700/50',
  'Adtech / Martech': 'bg-pink-900/40 text-pink-300 border-pink-800/50',
  'IT Services / Data Science / Mar-Legal-HR Tech': 'bg-cyan-900/40 text-cyan-300 border-cyan-800/50',
  'Retail': 'bg-teal-900/40 text-teal-300 border-teal-800/50',
  'Auto / AV Infra': 'bg-blue-900/40 text-blue-300 border-blue-800/50',
  'Cybersecurity': 'bg-red-900/40 text-red-300 border-red-800/50',
  'Edtech / Higher Ed': 'bg-yellow-900/40 text-yellow-300 border-yellow-800/50',
  'Media & Entertainment': 'bg-purple-900/40 text-purple-300 border-purple-800/50',
  'Gaming': 'bg-lime-900/40 text-lime-300 border-lime-800/50',
  'Smart Spaces': 'bg-stone-800/60 text-stone-300 border-stone-700/50',
  'Energy (CleanTech / Oil & Gas)': 'bg-green-900/40 text-green-300 border-green-800/50',
  'AgTech': 'bg-lime-900/40 text-lime-300 border-lime-800/50',
  'Telecom': 'bg-blue-900/40 text-blue-300 border-blue-800/50',
  'Global Public Sector': 'bg-slate-800/60 text-slate-300 border-slate-700/50',
  'Space': 'bg-indigo-900/40 text-indigo-200 border-indigo-800/50',
  'Architecture, Engineering, Construction': 'bg-orange-900/40 text-orange-200 border-orange-800/50',
};

export const STAGE_COLORS = {
  'Pre-seed': 'bg-zinc-800/60 text-zinc-300 border-zinc-700/50',
  'Seed': 'bg-slate-800/60 text-slate-300 border-slate-700/50',
  'Series A': 'bg-blue-900/40 text-blue-300 border-blue-800/50',
  'Series B': 'bg-indigo-900/40 text-indigo-300 border-indigo-800/50',
  'Series C': 'bg-purple-900/40 text-purple-300 border-purple-800/50',
  'Series D': 'bg-fuchsia-900/40 text-fuchsia-300 border-fuchsia-800/50',
};

export function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

export function formatDateLong(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatCapital(valueM) {
  if (!valueM) return '—';
  return valueM >= 1000 ? `$${(valueM / 1000).toFixed(1)}B` : `$${Math.round(valueM)}M`;
}

export function getVerticalColor(vertical) {
  return VERTICAL_COLORS[vertical] ?? 'bg-zinc-800/60 text-zinc-300 border-zinc-700/50';
}

export function getStageColor(stage) {
  return STAGE_COLORS[stage] ?? 'bg-zinc-800/60 text-zinc-300 border-zinc-700/50';
}
