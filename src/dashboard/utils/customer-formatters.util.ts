import { CHANNEL_LABELS_LONG, CHANNEL_LABELS_SHORT } from '../constants/your-people.constants';

const currencyFormatter = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export function formatPhone(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return '—';
  }

  let digits = trimmed.replace(/\D/g, '');

  if (digits.startsWith('0') && digits.length === 10) {
    digits = `233${digits.slice(1)}`;
  }

  if (digits.length === 9) {
    digits = `233${digits}`;
  }

  if (digits.startsWith('233') && digits.length === 12) {
    const local = digits.slice(3);
    return `+233 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
  }

  return trimmed;
}

export function formatChannel(raw: string, long = false): string {
  const labels = long ? CHANNEL_LABELS_LONG : CHANNEL_LABELS_SHORT;
  return labels[raw] ?? raw;
}

export function formatMoney(value: number | string | null | undefined): string {
  return currencyFormatter.format(Number(value ?? 0));
}

export function formatDateTime(date: Date): string {
  return dateFormatter.format(date).replace(/\b(am|pm)\b/g, (period) => period.toUpperCase());
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
