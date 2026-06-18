/**
 * WelcomeScreen Component
 * The landing page shown before starting the quote configuration
 */

import Image from "next/image";
import { LOGO_SRC, FEEDBACK_ITEMS } from "@/src/constants";

interface WelcomeScreenProps {
  quoteTotal: number;
  days: number;
  onStart: () => void;
}

export function WelcomeScreen({ quoteTotal, days, onStart }: WelcomeScreenProps) {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <div className="grid min-h-[calc(100vh-118px)] lg:grid-cols-[1.04fr_0.96fr]">
          <div className="flex flex-col justify-between p-5 sm:p-8 lg:p-10">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black uppercase tracking-wide text-teal-800">
                <i className="ti ti-sparkles text-base" /> Student and business web projects
              </div>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Plan your web project with confidence
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Build a clear quote by choosing your stack, features, pages, database models, and
                delivery details. No guessing, no messy back-and-forth.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={onStart} className="btn-primary px-6 py-3 text-sm">
                  Start configuration <i className="ti ti-arrow-right" />
                </button>
                <a
                  href="mailto:anuk200101@gmail.com"
                  className="btn-secondary px-6 py-3 text-sm"
                >
                  <i className="ti ti-mail" /> Email Dev+
                </a>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["Live estimate", "Custom quote"],
                ["Delivery window", `${days}-${days + 2} days`],
                ["Support", "WhatsApp ready"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.28),transparent_35%),radial-gradient(circle_at_70%_0%,rgba(251,191,36,0.18),transparent_28%),linear-gradient(135deg,#0f172a,#111827_55%,#022c22)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <Image
                  src={LOGO_SRC}
                  alt="Dev+ app mark"
                  width={92}
                  height={92}
                  className="rounded-3xl border border-white/15 bg-white p-2 shadow-2xl"
                  priority
                />
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/70">
                  Quote OS
                </span>
              </div>
              <div className="mt-10 space-y-4">
                {[
                  ["Choose stack", "Frontend, backend, language, database"],
                  ["Design schema", "Tables, attributes, CRUD actions"],
                  ["Confirm price", "Instant LKR estimate and timeline"],
                ].map(([item, desc], idx) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                  >
                    <div className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-black">{item}</p>
                        <p className="text-sm text-white/55">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/60 sm:p-7">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
              Feedback
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              What students say
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-slate-500">
            Sample project feedback shown to make the start page feel trustworthy before users
            begin the quote flow.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {FEEDBACK_ITEMS.map((item) => (
            <article
              key={item.name}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-slate-950">{item.name}</h3>
                  <p className="mt-1 text-xs font-bold text-slate-500">{item.role}</p>
                </div>
                <div className="flex text-amber-400" aria-label="5 star feedback">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className="ti ti-star-filled text-sm" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                &ldquo;{item.feedback}&rdquo;
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}