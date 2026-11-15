import { Fragment } from "react";
import { parseEmphasis } from "@/lib/text";

/** Renders `plain *emphasised*` copy with the emphasised words in Instrument Serif italic. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseEmphasis(text).map((s, i) =>
        s.em ? (
          <em key={i} className="pr-[0.04em] font-serif font-normal italic tracking-[-0.02em]">
            {s.text}
          </em>
        ) : (
          <Fragment key={i}>{s.text}</Fragment>
        ),
      )}
    </>
  );
}
