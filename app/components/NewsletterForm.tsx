"use client";

type NewsletterFormProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
};

export default function NewsletterForm({
  title = "Newsletter",
  description = "Prijavite se i dobijajte najvažnije priče i vodiče direktno u vaš inbox.",
  ctaLabel = "Pretplati se",
}: NewsletterFormProps) {
  return (
    <form className="space-y-3">
      <h3 className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-700">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
      <div className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Vaše ime"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#007BFF] focus:bg-white"
        />
        <input
          type="email"
          name="email"
          placeholder="Email adresa"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#007BFF] focus:bg-white"
        />
        <button
          type="button"
          className="w-full rounded-2xl bg-[#007BFF] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0056b3]"
        >
          {ctaLabel}
        </button>
      </div>
    </form>
  );
}
