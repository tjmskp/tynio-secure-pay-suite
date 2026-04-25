interface GenOpts {
  length: number;
  lower: boolean;
  upper: boolean;
  numbers: boolean;
  symbols: boolean;
}

const LOWER = "abcdefghijkmnopqrstuvwxyz";
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const NUMBERS = "23456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";

export function generatePassword(opts: GenOpts): string {
  let pool = "";
  if (opts.lower) pool += LOWER;
  if (opts.upper) pool += UPPER;
  if (opts.numbers) pool += NUMBERS;
  if (opts.symbols) pool += SYMBOLS;
  if (!pool) pool = LOWER + UPPER + NUMBERS;
  const len = Math.max(4, Math.min(128, opts.length));
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);
  let out = "";
  for (let i = 0; i < len; i++) out += pool[buf[i] % pool.length];
  return out;
}

export function passwordStrength(pwd: string): { label: string; score: number; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 14) score++;
  if (pwd.length >= 20) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: "Weak", score, color: "bg-destructive" };
  if (score <= 4) return { label: "Good", score, color: "bg-primary" };
  return { label: "Strong", score, color: "bg-success" };
}
