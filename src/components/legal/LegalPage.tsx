import React from "react";
import { LEGAL, type LegalSection } from "@/content/legal";

/** Shown on every legal page while the wording is a draft (src/content/legal.ts, `draft`). */
export function DraftNotice() {
  if (!LEGAL.draft) return null;
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-900">
      <strong>Draft wording, pending legal review.</strong> The final text will replace this version. Details in [square brackets] are still to be
      confirmed.
    </div>
  );
}

/** A legal page: title, last-updated date, draft notice and numbered sections. */
export function LegalPage({ title, intro, sections }: { title: string; intro?: string; sections: LegalSection[] }) {
  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-3 pb-8 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#06143E] tracking-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-slate-500">Last updated: {LEGAL.lastUpdated}</p>
        {intro && <p className="text-sm text-slate-600 leading-relaxed">{intro}</p>}
        <DraftNotice />
      </div>

      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
        {sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-slate-900">{section.heading}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {section.bullets && (
              <ul className="list-disc pl-5 space-y-1.5">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default LegalPage;
