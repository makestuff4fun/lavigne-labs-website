// TODO: replace this placeholder with the real inquiry form. The endpoint and
// the field list will come from the managing agent; until then the mailto
// link on this page is the working way to reach us.
export function InquiryFormPlaceholder() {
  return (
    <div
      data-placeholder="inquiry-form"
      className="mt-12 rounded-2xl border border-dashed border-line bg-mist p-6"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-slate">
        Coming soon
      </p>
      <p className="mt-2 font-semibold text-ink">Project inquiry form</p>
      <p className="mt-2 text-sm leading-relaxed text-slate">
        A short form for telling us about your project is on its way. Until it
        arrives, email us and we&apos;ll reply within one business day.
      </p>
    </div>
  );
}
