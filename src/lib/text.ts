export type Segment = { text: string; em: boolean };

/** Splits `plain *emphasised* plain` into segments. Used for headline/summary copy in content files. */
export function parseEmphasis(input: string): Segment[] {
  const out: Segment[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    if (m.index > last) out.push({ text: input.slice(last, m.index), em: false });
    out.push({ text: m[1], em: true });
    last = m.index + m[0].length;
  }
  if (last < input.length) out.push({ text: input.slice(last), em: false });
  return out;
}

export function stripEmphasis(input: string) {
  return input.replace(/\*/g, "");
}
