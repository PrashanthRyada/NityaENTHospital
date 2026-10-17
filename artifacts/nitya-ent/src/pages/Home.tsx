import { useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, CalendarDays, Check, ChevronRight, Clock3, Headphones, Menu, Play, Quote, ShieldCheck, Star, Stethoscope, X } from 'lucide-react';
import { useCreateAppointment, useGetGoogleReviews, useListPublicAchievements, useListPublicDoctors, useListPublicEvents, useListPublicMedia } from '@workspace/api-client-react';
import type { AppointmentInput, Doctor, MediaItem } from '@workspace/api-client-react';

const today = new Date().toISOString().slice(0, 10);

function SectionLabel({ children }: { children: string }) {
  return <div className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.22em] text-[#a06f59]"><span className="h-px w-8 bg-[#cf9e7f]" />{children}</div>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded-3xl border border-dashed border-[#cec8b9] bg-[#f7f4eb] px-6 py-12 text-center"><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#e9eee6] text-[#286d5c]"><CalendarDays size={20} /></div><h3 className="display text-2xl text-[#23463f]">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71837c]">{body}</p></div>;
}

function DoctorCard({ doctor, onRequest }: { doctor: Doctor; onRequest: (doctorId: number) => void }) {
  return <article className="group flex min-h-[280px] flex-col justify-between rounded-[1.8rem] border border-[#e0dacd] bg-[#fbf9f2] p-6 transition-transform duration-300 hover:-translate-y-1.5 md:p-7">
    <div>
      <div className="mb-7 flex items-start justify-between gap-4">
        {doctor.imageUrl ? <img src={doctor.imageUrl} alt={doctor.name} className="h-[76px] w-[76px] rounded-full object-cover ring-4 ring-[#e7ede5]" /> : <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-[#e4ebe3] text-xl font-semibold text-[#286d5c]">{doctor.name.split(/\s+/).slice(0, 2).map((n) => n[0]).join('')}</div>}
        <span className="rounded-full bg-[#eaf0e8] px-3 py-1.5 text-[11px] font-semibold text-[#286d5c]">Taking requests</span>
      </div>
      <h3 className="brand text-xl font-bold text-[#23463f]">{doctor.name}</h3>
      <p className="mt-1 text-sm text-[#71837c]">{doctor.title}{doctor.specialty ? ` · ${doctor.specialty}` : ''}</p>
      {doctor.bio && <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#63766e]">{doctor.bio}</p>}
    </div>
    <div className="mt-6 border-t border-[#e8e2d6] pt-4">
      <p className="flex items-center gap-2 text-xs font-semibold text-[#46665c]"><Clock3 size={14} />{doctor.availabilityHours || 'Availability by request'}</p>
      {doctor.availabilityDays?.length > 0 && <p className="mt-2 text-xs text-[#71837c]">{doctor.availabilityDays.join(' · ')}</p>}
      <button onClick={() => onRequest(doctor.id)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#286d5c] transition-all group-hover:gap-3" data-testid={`button-request-doctor-${doctor.id}`}>Request a visit <ArrowRight size={15} /></button>
    </div>
  </article>;
}

function Home() {
  const doctorsQuery = useListPublicDoctors();
  const eventsQuery = useListPublicEvents();
  const achievementsQuery = useListPublicAchievements();
  const mediaQuery = useListPublicMedia();
  const reviewsQuery = useGetGoogleReviews();
  const createAppointment = useCreateAppointment();
  const [mobileNav, setMobileNav] = useState(false);
  const [preferredDoctor, setPreferredDoctor] = useState<number | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const doctors = doctorsQuery.data ?? [];
  const events = eventsQuery.data ?? [];
  const achievements = achievementsQuery.data ?? [];
  const media = mediaQuery.data ?? [];
  const heroVideo = media.find((item: MediaItem) => item.isPublished && item.isHeroVideo && item.mediaType === 'video');
  const poster = media.find((item: MediaItem) => item.isPublished && item.mediaType === 'image');
  const reviews = reviewsQuery.data;

  const jumpToRequest = (doctorId?: number) => {
    if (doctorId) setPreferredDoctor(doctorId);
    document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' });
  };
  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const doctor = form.get('doctorId');
    const data: AppointmentInput = {
      patientName: String(form.get('patientName') ?? '').trim(),
      patientPhone: String(form.get('patientPhone') ?? '').trim(),
      patientEmail: String(form.get('patientEmail') ?? '').trim() || null,
      visitType: String(form.get('visitType') ?? ''),
      doctorId: doctor ? Number(doctor) : null,
      preferredDate: String(form.get('preferredDate') ?? ''),
      preferredSlot: String(form.get('preferredSlot') ?? ''),
    };
    createAppointment.mutate({ data }, { onSuccess: () => { setRequestSent(true); formElement.reset(); setPreferredDoctor(null); } });
  };

  return <main className="grain min-h-[100dvh] bg-[#f6f3ea] text-[#23463f]">
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/15 text-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 lg:px-16">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/35 bg-white/10"><Headphones size={20} strokeWidth={1.8} /></span>
          <span><span className="brand block text-[17px] font-extrabold leading-5 tracking-tight">Nitya ENT</span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.2em] text-white/70">Hospital</span></span>
        </a>
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-white/85 md:flex">
          <a className="hover:text-white" href="#care">Our care</a><a className="hover:text-white" href="#doctors">Doctors</a><a className="hover:text-white" href="#hospital-life">Hospital life</a><a className="hover:text-white" href="#reviews">Reviews</a>
        </nav>
        <a href="#appointment" className="hidden items-center gap-2 rounded-full bg-[#f4d8bf] px-5 py-3 text-[13px] font-bold text-[#23463f] transition-transform hover:-translate-y-0.5 sm:inline-flex">Request an appointment <ArrowRight size={15} /></a>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-white/35 md:hidden" onClick={() => setMobileNav(!mobileNav)} aria-label={mobileNav ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-navigation">{mobileNav ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      {mobileNav && <nav className="border-t border-white/15 bg-[#1c5147]/95 px-6 py-5 md:hidden">{[['Our care', '#care'], ['Doctors', '#doctors'], ['Hospital life', '#hospital-life'], ['Reviews', '#reviews'], ['Appointments', '#appointment']].map(([label, href]) => <a key={href} onClick={() => setMobileNav(false)} href={href} className="block border-b border-white/10 py-3 text-sm text-white/90">{label}</a>)}</nav>}
    </header>

    <section id="top" className="relative flex min-h-[720px] items-end overflow-hidden bg-[#17453f] pb-16 pt-32 text-white md:min-h-[800px] md:pb-20">
      {heroVideo && <video key={heroVideo.id} className="hero-video absolute inset-0 h-full w-full object-cover" autoPlay={!reducedMotion} muted loop playsInline preload="metadata" poster={poster?.assetUrl} aria-label={heroVideo.altText || heroVideo.title}>
        <source src={heroVideo.assetUrl} />
      </video>}
      {!heroVideo && poster && <img src={poster.assetUrl} alt={poster.altText || ''} className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,47,42,.88)_0%,rgba(16,52,46,.65)_48%,rgba(18,54,47,.23)_100%),linear-gradient(0deg,rgba(15,47,42,.46),transparent_60%)]" />
      {!heroVideo && !poster && <div className="absolute inset-0 opacity-35" aria-hidden="true"><div className="absolute -right-20 top-36 h-[32rem] w-[32rem] rounded-full border border-white/30" /><div className="absolute right-12 top-52 h-[23rem] w-[23rem] rounded-full border border-white/20" /><div className="absolute right-44 top-72 h-[14rem] w-[14rem] rounded-full border border-white/15" /></div>}
      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 items-end gap-12 px-5 md:px-10 lg:grid-cols-[1.2fr_.8fr] lg:px-16">
        <div>
          <div className="reveal mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.24em] text-[#e8c6a9]"><span className="h-px w-9 bg-[#e8c6a9]" />Care that listens first</div>
          <h1 className="display reveal reveal-delay-1 max-w-4xl text-[clamp(3.5rem,8.2vw,7.4rem)] leading-[.9] tracking-[-.045em]">Hear life.<br /><span className="italic text-[#f2d5bc]">Breathe easy.</span></h1>
          <p className="reveal reveal-delay-2 mt-7 max-w-[500px] text-base leading-7 text-white/80 md:text-lg md:leading-8">Thoughtful ear, nose and throat care begins with a conversation. Find the right next step with Nitya ENT Hospital.</p>
          <div className="reveal reveal-delay-2 mt-9 flex flex-wrap items-center gap-4">
            <button onClick={() => jumpToRequest()} className="inline-flex items-center gap-3 rounded-full bg-[#f4d8bf] px-6 py-4 text-sm font-bold text-[#23463f] transition-transform hover:-translate-y-1" data-testid="button-hero-appointment">Request an appointment <ArrowRight size={16} /></button>
            <a href="#care" className="inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold text-white/85 hover:text-white"><Play size={14} /> Explore our care</a>
          </div>
        </div>
        <div className="hidden justify-self-end lg:block">
          <div className="max-w-[310px] border-l border-white/35 pl-5 text-sm leading-6 text-white/75"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[.2em] text-[#f2d5bc]">A good first step</span>Tell us what brings you in. Our team will follow up to help arrange a visit.</div>
        </div>
      </div>
      <a href="#care" aria-label="Scroll to care information" className="absolute bottom-7 right-8 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-white/65 md:flex"><span>Scroll to explore</span><ArrowDown size={14} /></a>
    </section>

    <section id="care" className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[.8fr_1.2fr] lg:px-16">
      <div><SectionLabel>Care, made clear</SectionLabel><h2 className="display max-w-xl text-5xl leading-[1.02] tracking-tight md:text-6xl">You deserve to feel heard.</h2></div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="border-t border-[#cfc7b7] pt-5"><span className="mb-7 grid h-11 w-11 place-items-center rounded-full bg-[#e4ebe3] text-[#286d5c]"><Headphones size={19} /></span><h3 className="brand text-lg font-bold">A conversation first</h3><p className="mt-3 text-sm leading-6 text-[#71837c]">Share what you are experiencing and what matters to you. Your appointment request is a starting point for a real conversation.</p></div>
        <div className="border-t border-[#cfc7b7] pt-5"><span className="mb-7 grid h-11 w-11 place-items-center rounded-full bg-[#f1e2d4] text-[#a06f59]"><ShieldCheck size={19} /></span><h3 className="brand text-lg font-bold">Care with context</h3><p className="mt-3 text-sm leading-6 text-[#71837c]">Our ENT team helps patients understand their options, with the time and attention each concern deserves.</p></div>
        <div className="border-t border-[#cfc7b7] pt-5"><span className="mb-7 grid h-11 w-11 place-items-center rounded-full bg-[#e7e6d9] text-[#68775f]"><Stethoscope size={19} /></span><h3 className="brand text-lg font-bold">Specialist attention</h3><p className="mt-3 text-sm leading-6 text-[#71837c]">Explore the currently listed specialists and their stated availability before you make a request.</p></div>
        <div className="border-t border-[#cfc7b7] pt-5"><span className="mb-7 grid h-11 w-11 place-items-center rounded-full bg-[#e4eaf0] text-[#54718a]"><CalendarDays size={19} /></span><h3 className="brand text-lg font-bold">A simple next step</h3><p className="mt-3 text-sm leading-6 text-[#71837c]">Send your preferred visit details. The hospital team will confirm scheduling with you.</p></div>
      </div>
    </section>

    <section id="doctors" className="bg-[#e9eee6]">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><SectionLabel>Meet the team</SectionLabel><h2 className="display text-5xl leading-none md:text-6xl">Doctors & availability</h2></div><button onClick={() => jumpToRequest()} className="inline-flex items-center gap-2 border-b border-[#286d5c] pb-2 text-sm font-bold text-[#286d5c]">Request a visit <ArrowRight size={15} /></button></div>
        {doctorsQuery.isLoading ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((n) => <div key={n} className="h-[280px] animate-pulse rounded-[1.8rem] bg-[#dce5dc]" />)}</div> : doctorsQuery.isError ? <div className="rounded-3xl border border-[#e5c2b8] bg-[#fbf2ed] p-8 text-center"><p className="font-semibold">The doctor list is unavailable right now.</p><button onClick={() => doctorsQuery.refetch()} className="mt-3 text-sm font-bold text-[#286d5c]">Try again</button></div> : doctors.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{doctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} onRequest={jumpToRequest} />)}</div> : <EmptyState title="Doctor profiles are being updated" body="There are no published doctor profiles at the moment. You can still send an appointment request and the hospital team will follow up." />}
      </div>
    </section>

    <section id="appointment" className="relative overflow-hidden bg-[#204f46] py-24 text-[#f9f4e9] md:py-32">
      <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-white/10" /><div className="absolute -right-5 top-[-90px] h-[280px] w-[280px] rounded-full border border-white/10" />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20 lg:px-16">
        <div className="pt-3"><SectionLabel>Start here</SectionLabel><h2 className="display max-w-lg text-5xl leading-[.98] md:text-6xl">A visit begins with a request.</h2><p className="mt-6 max-w-md text-sm leading-7 text-white/70">Share your preferred date and time. This is a request, not a confirmed booking; the hospital team will contact you to confirm.</p><div className="mt-10 flex items-center gap-3 text-sm text-white/70"><Check size={16} className="text-[#f1c9aa]" /> Your details are sent securely to the hospital.</div></div>
        <div className="rounded-[2rem] bg-[#f7f4eb] p-6 text-[#23463f] shadow-[0_20px_70px_rgba(10,36,32,.22)] md:p-9">
          {requestSent ? <div className="py-12 text-center"><span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#e2eee4] text-[#286d5c]"><Check size={24} /></span><h3 className="display text-3xl">Request received</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71837c]">Thank you. The hospital team will follow up to confirm your visit details.</p><button onClick={() => setRequestSent(false)} className="mt-7 text-sm font-bold text-[#286d5c]">Send another request</button></div> : <form onSubmit={submitRequest} className="grid gap-5 md:grid-cols-2">
            <label className="text-xs font-bold text-[#52665e] md:col-span-1">Your name<input required name="patientName" autoComplete="name" className="mt-2 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#23463f] outline-none focus:border-[#286d5c] focus:ring-2 focus:ring-[#286d5c]/15" placeholder="Name" data-testid="input-patient-name" /></label>
            <label className="text-xs font-bold text-[#52665e]">Phone number<input required type="tel" name="patientPhone" autoComplete="tel" minLength={7} className="mt-2 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#23463f] outline-none focus:border-[#286d5c] focus:ring-2 focus:ring-[#286d5c]/15" placeholder="Your phone number" data-testid="input-patient-phone" /></label>
            <label className="text-xs font-bold text-[#52665e]">Email <span className="font-normal text-[#93a098]">(optional)</span><input type="email" name="patientEmail" autoComplete="email" className="mt-2 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#23463f] outline-none focus:border-[#286d5c] focus:ring-2 focus:ring-[#286d5c]/15" placeholder="you@example.com" data-testid="input-patient-email" /></label>
            <label className="text-xs font-bold text-[#52665e]">Type of visit<select required name="visitType" className="mt-2 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#23463f] outline-none focus:border-[#286d5c]" defaultValue="" data-testid="select-visit-type"><option value="" disabled>Select a visit type</option><option>ENT consultation</option><option>Follow-up visit</option><option>Other ENT concern</option></select></label>
            <label className="text-xs font-bold text-[#52665e]">Preferred doctor<select name="doctorId" value={preferredDoctor ?? ''} onChange={(e) => setPreferredDoctor(e.target.value ? Number(e.target.value) : null)} className="mt-2 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#23463f] outline-none focus:border-[#286d5c]" data-testid="select-preferred-doctor"><option value="">No preference</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}</select></label>
            <label className="text-xs font-bold text-[#52665e]">Preferred date<input required type="date" min={today} name="preferredDate" className="mt-2 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#23463f] outline-none focus:border-[#286d5c]" data-testid="input-preferred-date" /></label>
            <label className="text-xs font-bold text-[#52665e] md:col-span-2">Preferred time<select required name="preferredSlot" defaultValue="" className="mt-2 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#23463f] outline-none focus:border-[#286d5c]" data-testid="select-preferred-slot"><option value="" disabled>Choose a preferred time</option><option>Morning</option><option>Afternoon</option><option>Any time</option></select></label>
            {createAppointment.isError && <p role="alert" className="text-sm font-medium text-[#a5453a] md:col-span-2">We couldn’t send your request. Please check your details and try again.</p>}
            <button disabled={createAppointment.isPending} type="submit" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#286d5c] px-6 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60 md:col-span-2" data-testid="button-submit-appointment">{createAppointment.isPending ? 'Sending request…' : 'Send appointment request'}<ArrowRight size={16} /></button>
            <p className="text-center text-[11px] leading-5 text-[#839087] md:col-span-2">Sending this form does not confirm an appointment. Please do not include urgent or emergency concerns.</p>
          </form>}
        </div>
      </div>
    </section>

    <section id="hospital-life" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="mb-12 grid gap-6 md:grid-cols-[1fr_.7fr] md:items-end"><div><SectionLabel>Beyond the appointment</SectionLabel><h2 className="display max-w-2xl text-5xl leading-none md:text-6xl">Hospital life & milestones</h2></div><p className="max-w-md text-sm leading-7 text-[#71837c]">Updates and milestones are shared here when they have been published by the hospital.</p></div>
      <div className="grid gap-12 lg:grid-cols-2">
        <div><div className="mb-5 flex items-center justify-between border-b border-[#d9d2c4] pb-4"><h3 className="brand text-lg font-bold">Upcoming events</h3><CalendarDays size={18} className="text-[#a06f59]" /></div>
          {eventsQuery.isLoading ? <div className="h-36 animate-pulse rounded-2xl bg-[#ebe7dc]" /> : eventsQuery.isError ? <div className="rounded-2xl bg-[#fbf0eb] p-5 text-sm">Event information is unavailable. <button onClick={() => eventsQuery.refetch()} className="font-bold text-[#286d5c]">Retry</button></div> : events.length === 0 ? <p className="rounded-2xl bg-[#efede5] px-6 py-8 text-sm leading-6 text-[#71837c]">No upcoming events have been published yet.</p> : <div className="space-y-3">{events.map((event) => <article key={event.id} className="flex gap-4 rounded-2xl bg-[#efede5] p-4">{event.imageUrl && <img src={event.imageUrl} alt="" className="h-20 w-24 rounded-xl object-cover" />}<div><p className="text-[11px] font-bold uppercase tracking-wider text-[#a06f59]">{new Date(event.startsAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p><h4 className="mt-1 font-bold">{event.title}</h4><p className="mt-1 text-xs text-[#71837c]">{event.location}</p>{event.registrationUrl && <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#286d5c]">Event details <ChevronRight size={13} /></a>}</div></article>)}</div>}
        </div>
        <div><div className="mb-5 flex items-center justify-between border-b border-[#d9d2c4] pb-4"><h3 className="brand text-lg font-bold">Achievements</h3><ShieldCheck size={18} className="text-[#a06f59]" /></div>
          {achievementsQuery.isLoading ? <div className="h-36 animate-pulse rounded-2xl bg-[#ebe7dc]" /> : achievementsQuery.isError ? <div className="rounded-2xl bg-[#fbf0eb] p-5 text-sm">Achievement information is unavailable. <button onClick={() => achievementsQuery.refetch()} className="font-bold text-[#286d5c]">Retry</button></div> : achievements.length === 0 ? <p className="rounded-2xl bg-[#efede5] px-6 py-8 text-sm leading-6 text-[#71837c]">No achievements have been published yet.</p> : <div className="space-y-3">{achievements.map((item) => <article key={item.id} className="flex gap-4 rounded-2xl bg-[#efede5] p-4">{item.imageUrl && <img src={item.imageUrl} alt="" className="h-20 w-24 rounded-xl object-cover" />}<div><p className="text-[11px] font-bold uppercase tracking-wider text-[#a06f59]">{item.achievedYear}</p><h4 className="mt-1 font-bold">{item.title}</h4><p className="mt-1 text-sm leading-5 text-[#71837c]">{item.description}</p></div></article>)}</div>}
        </div>
      </div>
    </section>

    <section id="reviews" className="bg-[#eee6d8]">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[.75fr_1.25fr] lg:px-16">
        <div><SectionLabel>Patient voices</SectionLabel><h2 className="display text-5xl leading-[.97] md:text-6xl">Words from the community.</h2><p className="mt-5 max-w-md text-sm leading-7 text-[#71837c]">Google reviews are shown only when a verified review source has been configured.</p></div>
        <div className="flex flex-col justify-center">
          {reviewsQuery.isLoading ? <div className="h-40 animate-pulse rounded-3xl bg-[#e5dccd]" /> : reviewsQuery.isError ? <div className="rounded-3xl bg-[#f6f1e8] p-7 text-sm">Review information is unavailable right now. <button onClick={() => reviewsQuery.refetch()} className="font-bold text-[#286d5c]">Try again</button></div> : reviews?.sourceConfigured ? <div><div className="mb-6 flex flex-wrap items-end gap-4"><div className="display text-6xl">{reviews.averageRating ?? '—'}</div><div className="pb-2"><div className="flex gap-1 text-[#b47c34]">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill={star <= (reviews.averageRating ?? 0) ? 'currentColor' : 'none'} />)}</div><p className="mt-1 text-xs text-[#71837c]">{reviews.totalReviewCount ?? 0} Google reviews</p></div></div><div className="grid gap-3 md:grid-cols-2">{(reviews.reviews ?? []).map((review, i) => <article key={`${review.authorName}-${i}`} className="rounded-2xl bg-[#f8f4ec] p-5"><div className="flex items-center justify-between"><span className="text-sm font-bold">{review.authorName}</span><div className="flex gap-0.5 text-[#b47c34]">{Array.from({ length: review.rating }).map((_, n) => <Star key={n} size={12} fill="currentColor" />)}</div></div><p className="mt-3 text-sm leading-6 text-[#63766e]">“{review.text}”</p><p className="mt-3 text-[11px] text-[#89968e]">{review.relativeTime}</p></article>)}</div><a href={reviews.reviewsUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#286d5c]">Read more on Google <ArrowRight size={15} /></a></div> : <div className="rounded-3xl border border-dashed border-[#cfc3b2] bg-[#f6f1e8] p-8"><Quote size={22} className="text-[#a06f59]" /><p className="display mt-4 text-2xl">No review feed is configured yet.</p><p className="mt-2 text-sm leading-6 text-[#71837c]">We won't display review cards until real Google review data is available.</p>{reviews?.reviewsUrl && <a href={reviews.reviewsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#286d5c]">Visit our Google reviews <ArrowRight size={15} /></a>}</div>}
        </div>
      </div>
    </section>

    <footer className="bg-[#173f39] px-5 py-10 text-white md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div><a href="#top" className="brand text-xl font-extrabold">Nitya ENT Hospital</a><p className="mt-2 text-sm text-white/55">Thoughtful care for ear, nose and throat health.</p></div>
        <div className="flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/70"><a href="#doctors" className="hover:text-white">Doctors</a><a href="#appointment" className="hover:text-white">Appointments</a><a href="#hospital-life" className="hover:text-white">Hospital life</a><a href="/admin" className="hover:text-white">Administrator</a></div>
        <p className="text-[11px] text-white/45">For urgent or emergency care, contact local emergency services.</p>
      </div>
    </footer>
  </main>;
}

export default Home;
