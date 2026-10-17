import { useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { useGetAdminOverview, useGetAdminSession, useListAdminAppointments, useListAdminDoctors, useListAdminEvents, useListAdminAchievements, useListAdminMedia, useCreateDoctor, useUpdateDoctor, useDeleteDoctor, useCreateEvent, useUpdateEvent, useDeleteEvent, useCreateAchievement, useUpdateAchievement, useDeleteAchievement, useCreateMedia, useUpdateMedia, useDeleteMedia, useUpdateAppointment, useRequestUploadUrl, getGetAdminOverviewQueryKey, getListAdminAppointmentsQueryKey, getListAdminDoctorsQueryKey, getListAdminEventsQueryKey, getListAdminAchievementsQueryKey, getListAdminMediaQueryKey, getListPublicDoctorsQueryKey, getListPublicEventsQueryKey, getListPublicAchievementsQueryKey, getListPublicMediaQueryKey } from '@workspace/api-client-react';
import type { Achievement, AchievementInput, Appointment, AppointmentUpdateStatus, Doctor, DoctorInput, EventInput, HospitalEvent, MediaInput, MediaItem } from '@workspace/api-client-react';
import { Activity, ArrowLeft, ArrowUpRight, CalendarDays, Check, ChevronDown, CircleAlert, ClipboardList, FileImage, ImagePlus, LogIn, Menu, Pencil, Plus, Radio, ShieldCheck, Stethoscope, Trash2, Users, X } from 'lucide-react';

type Kind = 'overview' | 'appointments' | 'doctors' | 'events' | 'achievements' | 'media';
type AnyRecord = Doctor | Appointment | HospitalEvent | Achievement | MediaItem;
type Field = { name: string; label: string; type?: 'text' | 'email' | 'url' | 'textarea' | 'number' | 'date' | 'datetime-local' | 'checkbox' | 'select'; placeholder?: string; options?: string[]; required?: boolean; full?: boolean };
type Definition = { title: string; singular: string; description: string; fields: Field[] };

const sectionMeta: Record<Kind, { title: string; detail: string; icon: typeof Activity }> = {
  overview: { title: 'Overview', detail: 'A clear view of today’s hospital activity.', icon: Activity },
  appointments: { title: 'Appointment requests', detail: 'Review and update patient requests.', icon: ClipboardList },
  doctors: { title: 'Doctors', detail: 'Manage staff profiles and stated availability.', icon: Stethoscope },
  events: { title: 'Events', detail: 'Publish upcoming events and registration details.', icon: CalendarDays },
  achievements: { title: 'Achievements', detail: 'Share hospital milestones when ready.', icon: ShieldCheck },
  media: { title: 'Media library', detail: 'Manage published images and hero video.', icon: FileImage },
};

const definitions: Partial<Record<Kind, Definition>> = {
  doctors: { title: 'Doctor profile', singular: 'doctor', description: 'Profile and availability details shown on the public site.', fields: [
    { name: 'name', label: 'Full name', required: true }, { name: 'title', label: 'Title', required: true },
    { name: 'specialty', label: 'Specialty', required: true }, { name: 'availabilityHours', label: 'Availability hours', placeholder: 'As communicated by the hospital' },
    { name: 'availabilityDays', label: 'Availability days', placeholder: 'Separate days with commas', full: true },
    { name: 'imageUrl', label: 'Profile image URL', type: 'url', full: true },
    { name: 'bio', label: 'Biography', type: 'textarea', full: true },
    { name: 'isActive', label: 'Show on the public site', type: 'checkbox', full: true },
  ] },
  events: { title: 'Hospital event', singular: 'event', description: 'Event dates and registration details are visible when published.', fields: [
    { name: 'title', label: 'Event title', required: true }, { name: 'location', label: 'Location' },
    { name: 'startsAt', label: 'Starts at', type: 'datetime-local', required: true }, { name: 'registrationUrl', label: 'Registration URL', type: 'url' },
    { name: 'imageUrl', label: 'Image URL', type: 'url', full: true }, { name: 'description', label: 'Description', type: 'textarea', full: true },
    { name: 'isPublished', label: 'Publish this event', type: 'checkbox', full: true },
  ] },
  achievements: { title: 'Achievement', singular: 'achievement', description: 'Publish a verified milestone for visitors to see.', fields: [
    { name: 'title', label: 'Achievement title', required: true }, { name: 'achievedYear', label: 'Year', type: 'number', required: true },
    { name: 'imageUrl', label: 'Image URL', type: 'url', full: true }, { name: 'description', label: 'Description', type: 'textarea', full: true },
    { name: 'isPublished', label: 'Publish this achievement', type: 'checkbox', full: true },
  ] },
  media: { title: 'Media details', singular: 'media item', description: 'Update the title, accessibility text, publishing state and display order.', fields: [
    { name: 'title', label: 'Title', required: true }, { name: 'sortOrder', label: 'Sort order', type: 'number' },
    { name: 'caption', label: 'Caption', type: 'textarea', full: true }, { name: 'altText', label: 'Alternative text', type: 'textarea', full: true },
    { name: 'isPublished', label: 'Publish on the site', type: 'checkbox', full: true },
    { name: 'isHeroVideo', label: 'Use as the homepage hero video', type: 'checkbox', full: true },
  ] },
};

const navItems: { key: Kind; href: string; title: string }[] = [
  { key: 'overview', href: '/admin', title: 'Overview' }, { key: 'appointments', href: '/admin/appointments', title: 'Appointments' },
  { key: 'doctors', href: '/admin/doctors', title: 'Doctors' }, { key: 'events', href: '/admin/events', title: 'Events' },
  { key: 'achievements', href: '/admin/achievements', title: 'Achievements' }, { key: 'media', href: '/admin/media', title: 'Media library' },
];

function getKind(path: string): Kind {
  const match = path.match(/\/admin\/(appointments|doctors|events|achievements|media)/);
  return (match?.[1] as Kind) || 'overview';
}

function getRecordTitle(record: AnyRecord) {
  if ('patientName' in record) return record.patientName;
  const data = record as unknown as Record<string, unknown>;
  return String(data.title || data.name || '');
}

function getRecordStatus(record: AnyRecord) {
  if ('status' in record) return record.status;
  if ('isPublished' in record) return record.isPublished ? 'Published' : 'Draft';
  if ('isActive' in record) return record.isActive ? 'Active' : 'Hidden';
  return '';
}

function Badge({ children, quiet = false }: { children: string; quiet?: boolean }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${quiet ? 'bg-[#f0ede5] text-[#78867e]' : 'bg-[#e5eee6] text-[#286d5c]'}`}>{children}</span>;
}

function InputField({ field, value, onChange }: { field: Field; value: unknown; onChange: (name: string, value: unknown) => void }) {
  const base = 'mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3.5 py-3 text-sm text-[#23463f] outline-none transition focus:border-[#286d5c] focus:ring-2 focus:ring-[#286d5c]/10';
  if (field.type === 'checkbox') return <label className="flex items-center gap-3 text-sm font-medium text-[#46665c]"><input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(field.name, e.target.checked)} className="h-4 w-4 accent-[#286d5c]" />{field.label}</label>;
  if (field.type === 'textarea') return <label className="block text-xs font-bold text-[#52665e]">{field.label}<textarea name={field.name} required={field.required} value={String(value ?? '')} onChange={(e) => onChange(field.name, e.target.value)} placeholder={field.placeholder} rows={4} className={`${base} resize-y`} data-testid={`input-${field.name}`} /></label>;
  if (field.type === 'select') return <label className="block text-xs font-bold text-[#52665e]">{field.label}<select name={field.name} value={String(value ?? '')} onChange={(e) => onChange(field.name, e.target.value)} className={base}>{field.options?.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>;
  return <label className="block text-xs font-bold text-[#52665e]">{field.label}<input name={field.name} required={field.required} type={field.type ?? 'text'} value={String(value ?? '')} onChange={(e) => onChange(field.name, e.target.value)} placeholder={field.placeholder} className={base} data-testid={`input-${field.name}`} /></label>;
}

function Admin() {
  const [location, setLocation] = useLocation();
  const kind = getKind(location);
  const meta = sectionMeta[kind];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editor, setEditor] = useState<AnyRecord | null | 'new'>(null);
  const [deleteError, setDeleteError] = useState('');
  const [actionError, setActionError] = useState('');
  const session = useGetAdminSession();
  const authorized = Boolean(session.data?.authorized);
  const queryClient = useQueryClient();
  const overview = useGetAdminOverview({ query: { enabled: authorized, queryKey: getGetAdminOverviewQueryKey() } });
  const appointmentsQuery = useListAdminAppointments({ query: { enabled: authorized, queryKey: getListAdminAppointmentsQueryKey() } });
  const doctorsQuery = useListAdminDoctors({ query: { enabled: authorized, queryKey: getListAdminDoctorsQueryKey() } });
  const eventsQuery = useListAdminEvents({ query: { enabled: authorized, queryKey: getListAdminEventsQueryKey() } });
  const achievementsQuery = useListAdminAchievements({ query: { enabled: authorized, queryKey: getListAdminAchievementsQueryKey() } });
  const mediaQuery = useListAdminMedia({ query: { enabled: authorized, queryKey: getListAdminMediaQueryKey() } });
  const createDoctor = useCreateDoctor(); const updateDoctor = useUpdateDoctor(); const deleteDoctor = useDeleteDoctor();
  const createEvent = useCreateEvent(); const updateEvent = useUpdateEvent(); const deleteEvent = useDeleteEvent();
  const createAchievement = useCreateAchievement(); const updateAchievement = useUpdateAchievement(); const deleteAchievement = useDeleteAchievement();
  const createMedia = useCreateMedia(); const updateMedia = useUpdateMedia(); const deleteMedia = useDeleteMedia();
  const updateAppointment = useUpdateAppointment(); const requestUploadUrl = useRequestUploadUrl();
  const isLoading = kind === 'overview' ? overview.isLoading : kind === 'appointments' ? appointmentsQuery.isLoading : kind === 'doctors' ? doctorsQuery.isLoading : kind === 'events' ? eventsQuery.isLoading : kind === 'achievements' ? achievementsQuery.isLoading : mediaQuery.isLoading;
  const isError = kind === 'overview' ? overview.isError : kind === 'appointments' ? appointmentsQuery.isError : kind === 'doctors' ? doctorsQuery.isError : kind === 'events' ? eventsQuery.isError : kind === 'achievements' ? achievementsQuery.isError : mediaQuery.isError;
  const retry = () => {
    if (kind === 'overview') void overview.refetch();
    if (kind === 'appointments') void appointmentsQuery.refetch();
    if (kind === 'doctors') void doctorsQuery.refetch();
    if (kind === 'events') void eventsQuery.refetch();
    if (kind === 'achievements') void achievementsQuery.refetch();
    if (kind === 'media') void mediaQuery.refetch();
  };
  const reload = (target: Kind) => {
    const keys = target === 'doctors' ? [getListAdminDoctorsQueryKey(), getListPublicDoctorsQueryKey()] : target === 'events' ? [getListAdminEventsQueryKey(), getListPublicEventsQueryKey()] : target === 'achievements' ? [getListAdminAchievementsQueryKey(), getListPublicAchievementsQueryKey()] : target === 'media' ? [getListAdminMediaQueryKey(), getListPublicMediaQueryKey()] : [getListAdminAppointmentsQueryKey()];
    for (const queryKey of keys) void queryClient.invalidateQueries({ queryKey });
    void queryClient.invalidateQueries({ queryKey: getGetAdminOverviewQueryKey() });
  };

  const data: AnyRecord[] = useMemo(() => {
    if (kind === 'appointments') return appointmentsQuery.data ?? [];
    if (kind === 'doctors') return doctorsQuery.data ?? [];
    if (kind === 'events') return eventsQuery.data ?? [];
    if (kind === 'achievements') return achievementsQuery.data ?? [];
    if (kind === 'media') return mediaQuery.data ?? [];
    return [];
  }, [kind, appointmentsQuery.data, doctorsQuery.data, eventsQuery.data, achievementsQuery.data, mediaQuery.data]);

  const initialValues = (record: AnyRecord | null | 'new', definition: Definition) => {
    if (record && record !== 'new') {
      const result: Record<string, unknown> = {};
      definition.fields.forEach((field) => {
        const current = (record as unknown as Record<string, unknown>)[field.name];
        if (field.name === 'availabilityDays') result[field.name] = Array.isArray(current) ? current.join(', ') : '';
        else if (field.name === 'startsAt' && current) result[field.name] = new Date(String(current)).toISOString().slice(0, 16);
        else result[field.name] = current ?? (field.type === 'checkbox' ? false : '');
      });
      return result;
    }
    return Object.fromEntries(definition.fields.map((field) => [field.name, field.type === 'checkbox' ? (field.name === 'isPublished' || field.name === 'isActive') : '']));
  };

  const saveRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!definitions[kind] || !editor) return;
    const definition = definitions[kind]!;
    const input = new FormData(event.currentTarget);
    const dataObject: Record<string, unknown> = {};
    definition.fields.forEach((field) => {
      let value: unknown = field.type === 'checkbox' ? input.get(field.name) === 'on' : input.get(field.name);
      if (field.name === 'availabilityDays') value = String(value ?? '').split(',').map((day) => day.trim()).filter(Boolean);
      if (field.type === 'number') value = Number(value);
      if ((field.name === 'imageUrl' || field.name === 'registrationUrl') && !value) value = null;
      if (field.name === 'startsAt' && value) value = new Date(String(value)).toISOString();
      if (value === null || value === undefined) return;
      dataObject[field.name] = value;
    });
    setActionError('');
    try {
      if (kind === 'doctors') {
        if (editor === 'new') await createDoctor.mutateAsync({ data: dataObject as unknown as DoctorInput });
        else await updateDoctor.mutateAsync({ id: editor.id, data: dataObject as unknown as DoctorInput });
      } else if (kind === 'events') {
        if (editor === 'new') await createEvent.mutateAsync({ data: dataObject as unknown as EventInput });
        else await updateEvent.mutateAsync({ id: editor.id, data: dataObject as unknown as EventInput });
      } else if (kind === 'achievements') {
        if (editor === 'new') await createAchievement.mutateAsync({ data: dataObject as unknown as AchievementInput });
        else await updateAchievement.mutateAsync({ id: editor.id, data: dataObject as unknown as AchievementInput });
      } else if (kind === 'media' && editor !== 'new') {
        await updateMedia.mutateAsync({ id: editor.id, data: dataObject as never });
      }
      setEditor(null); reload(kind);
    } catch {
      setActionError(`The ${definition.singular} could not be saved. Please try again.`);
    }
  };

  const removeRecord = async (record: AnyRecord) => {
    const name = getRecordTitle(record);
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    setDeleteError('');
    try {
      if (kind === 'doctors') await deleteDoctor.mutateAsync({ id: record.id });
      if (kind === 'events') await deleteEvent.mutateAsync({ id: record.id });
      if (kind === 'achievements') await deleteAchievement.mutateAsync({ id: record.id });
      if (kind === 'media') await deleteMedia.mutateAsync({ id: record.id });
      reload(kind);
    } catch { setDeleteError(`Could not delete ${name}. Try again.`); }
  };

  const changeStatus = (appointment: Appointment, status: AppointmentUpdateStatus) => {
    setActionError('');
    updateAppointment.mutate({ id: appointment.id, data: { status } }, {
      onSuccess: () => { reload('appointments'); },
      onError: () => setActionError('Appointment status could not be updated. Please try again.'),
    });
  };

  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const file = values.get('file');
    if (!(file instanceof File)) return;
    setActionError('');
    try {
      const upload = await requestUploadUrl.mutateAsync({ data: { name: file.name, size: file.size, contentType: file.type || 'application/octet-stream' } });
      const response = await fetch(upload.uploadURL, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
      if (!response.ok) throw new Error('Direct upload failed');
      const mediaInput: MediaInput = {
        title: String(values.get('title') || file.name),
        caption: String(values.get('caption') || ''),
        objectPath: upload.objectPath,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
        altText: String(values.get('altText') || ''),
        isHeroVideo: values.get('isHeroVideo') === 'on',
        isPublished: values.get('isPublished') === 'on',
        sortOrder: Number(values.get('sortOrder') || 0),
      };
      await createMedia.mutateAsync({ data: mediaInput });
      form.reset(); reload('media');
    } catch {
      setActionError('The media upload did not finish. Check the file and try again.');
    }
  };

  const toggleMedia = (item: MediaItem, field: 'isPublished' | 'isHeroVideo') => {
    const data = field === 'isPublished' ? { isPublished: !item.isPublished } : { isHeroVideo: !item.isHeroVideo };
    updateMedia.mutate({ id: item.id, data }, {
      onSuccess: () => reload('media'),
      onError: () => setActionError('Media settings could not be updated.'),
    });
  };

  if (session.isLoading) return <div className="grid min-h-[100dvh] place-items-center bg-[#f6f3ea]"><div className="w-64 space-y-3"><div className="h-5 w-32 animate-pulse rounded bg-[#e1e8de]" /><div className="h-20 animate-pulse rounded-2xl bg-[#e1e8de]" /><div className="h-10 animate-pulse rounded-xl bg-[#e1e8de]" /></div></div>;
  if (!authorized) return <main className="grid min-h-[100dvh] place-items-center bg-[#e9eee6] p-5"><div className="w-full max-w-lg rounded-[2rem] bg-[#fbf8f0] p-8 text-center shadow-[0_20px_60px_rgba(24,60,50,.12)] md:p-12"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e5eee6] text-[#286d5c]"><LogIn size={23} /></div><p className="mt-6 text-[11px] font-bold uppercase tracking-[.22em] text-[#a06f59]">Administrator access</p><h1 className="display mt-3 text-4xl text-[#23463f]">Sign in to continue</h1><p className="mt-3 text-sm leading-6 text-[#71837c]">{session.isError ? 'We could not verify your administrator session. Sign in with an authorized hospital account and try again.' : 'This workspace is for authorized Nitya ENT administrators.'}</p><Link href="/sign-in" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#286d5c] px-6 py-3.5 text-sm font-bold text-white">Administrator sign in <ArrowUpRight size={16} /></Link><Link href="/" className="mt-5 block text-sm font-semibold text-[#71837c]">Return to public site</Link></div></main>;

  const Icon = meta.icon;
  const definition = definitions[kind];

  return <div className="min-h-[100dvh] bg-[#f5f3eb] text-[#23463f]">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col bg-[#173f39] px-5 py-6 text-white transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <Link href="/admin" className="flex items-center gap-3 border-b border-white/10 px-2 pb-7">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e4d1b8] text-[#23463f]"><Stethoscope size={20} /></span><span><span className="brand block font-extrabold">Nitya ENT</span><span className="mt-1 block text-[10px] uppercase tracking-[.18em] text-white/55">Hospital administration</span></span>
      </Link>
      <div className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-white/40">Workspace</div>
      <nav className="mt-3 flex-1 space-y-1">{navItems.map((item) => {
        const ItemIcon = sectionMeta[item.key].icon;
        const active = item.key === kind;
        return <Link key={item.key} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${active ? 'bg-[#2c6559] text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'}`}><ItemIcon size={17} strokeWidth={1.8} />{item.title}{item.key === 'appointments' && overview.data?.pendingAppointments ? <span className="ml-auto rounded-full bg-[#f0c9a9] px-2 py-0.5 text-[10px] font-bold text-[#23463f]">{overview.data.pendingAppointments}</span> : null}</Link>;
      })}</nav>
      <Link href="/" className="flex items-center gap-2 border-t border-white/10 px-3 pt-5 text-xs font-semibold text-white/60 hover:text-white"><ArrowLeft size={15} /> View public hospital site</Link>
    </aside>
    {sidebarOpen && <button onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-[#153d36]/35 md:hidden" />}
    <div className="md:pl-[270px]">
      <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-[#e4dfd3] bg-[#f8f6ef]/95 px-5 backdrop-blur md:px-9">
        <div className="flex items-center gap-3"><button className="grid h-9 w-9 place-items-center rounded-xl border border-[#ded8ca] md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={18} /></button><div className="hidden text-xs font-medium text-[#859188] sm:block">Nitya ENT <span className="mx-2">/</span></div><h1 className="brand text-sm font-bold md:text-base">{meta.title}</h1></div>
        <div className="flex items-center gap-3"><span className="hidden items-center gap-2 text-xs font-semibold text-[#71837c] sm:flex"><span className="h-2 w-2 rounded-full bg-[#4c9b73]" /> Admin session verified</span><Link href="/" className="grid h-9 w-9 place-items-center rounded-full bg-[#e7ede5] text-[#286d5c]" aria-label="Go to public site"><ArrowUpRight size={17} /></Link></div>
      </header>
      <main className="mx-auto max-w-[1460px] px-5 py-8 md:px-9 md:py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#a06f59]"><Icon size={14} /> Hospital workspace</div><h2 className="display text-4xl leading-none md:text-5xl">{meta.title}</h2><p className="mt-3 text-sm text-[#71837c]">{meta.detail}</p></div>
          {definition && <button onClick={() => { setActionError(''); setEditor('new'); }} className="inline-flex items-center gap-2 rounded-full bg-[#286d5c] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5" data-testid="button-create-record"><Plus size={16} /> Add {definition.singular}</button>}
        </div>
        {actionError && <div role="alert" className="mb-5 flex items-center gap-3 rounded-xl border border-[#e8c6b9] bg-[#fbf0ea] px-4 py-3 text-sm text-[#93483d]"><CircleAlert size={17} />{actionError}<button onClick={() => setActionError('')} className="ml-auto" aria-label="Dismiss error"><X size={16} /></button></div>}
        {kind === 'overview' ? <Overview data={overview.data} loading={overview.isLoading} error={overview.isError} retry={() => void overview.refetch()} onNavigate={setLocation} /> :
          isLoading ? <div className="space-y-3"><div className="h-14 animate-pulse rounded-2xl bg-[#e7e8dc]" /><div className="h-60 animate-pulse rounded-2xl bg-[#e7e8dc]" /></div> :
          isError ? <div className="rounded-3xl border border-[#e5c2b8] bg-[#fbf2ed] p-10 text-center"><CircleAlert className="mx-auto text-[#b5584a]" /><h3 className="brand mt-4 font-bold">This section could not load</h3><p className="mt-2 text-sm text-[#71837c]">Your changes are safe. Try loading the records again.</p><button onClick={retry} className="mt-5 rounded-full bg-[#286d5c] px-5 py-2.5 text-sm font-bold text-white">Retry</button></div> :
          kind === 'appointments' ? <AppointmentTable records={appointmentsQuery.data ?? []} onChange={changeStatus} isPending={updateAppointment.isPending} /> :
          kind === 'media' ? <MediaManager records={mediaQuery.data ?? []} onUpload={upload} uploadPending={requestUploadUrl.isPending || createMedia.isPending} onToggle={toggleMedia} onEdit={(record) => { setActionError(''); setEditor(record); }} onDelete={removeRecord} deleteError={deleteError} setDeleteError={setDeleteError} /> :
          <RecordTable kind={kind} records={data} onEdit={(record) => { setActionError(''); setEditor(record); }} onDelete={removeRecord} deleteError={deleteError} setDeleteError={setDeleteError} />}
      </main>
    </div>
    {definition && editor && <EditorModal definition={definition} initial={initialValues(editor, definition)} pending={createDoctor.isPending || updateDoctor.isPending || createEvent.isPending || updateEvent.isPending || createAchievement.isPending || updateAchievement.isPending || updateMedia.isPending} onClose={() => setEditor(null)} onSubmit={saveRecord} error={actionError} />}
  </div>;
}

function Overview({ data, loading, error, retry, onNavigate }: { data?: { pendingAppointments: number; totalAppointments: number; activeDoctors: number; upcomingEvents: number; publishedAchievements: number; publishedMedia: number }; loading: boolean; error: boolean; retry: () => void; onNavigate: (path: string) => void }) {
  const stats = [
    { name: 'Pending requests', value: data?.pendingAppointments, icon: ClipboardList, href: '/admin/appointments', tint: 'bg-[#f3e5d8] text-[#a06f59]' },
    { name: 'Total appointments', value: data?.totalAppointments, icon: CalendarDays, href: '/admin/appointments', tint: 'bg-[#e5eee6] text-[#286d5c]' },
    { name: 'Active doctors', value: data?.activeDoctors, icon: Users, href: '/admin/doctors', tint: 'bg-[#e5e9ef] text-[#536a82]' },
    { name: 'Upcoming events', value: data?.upcomingEvents, icon: Radio, href: '/admin/events', tint: 'bg-[#eee8d8] text-[#987540]' },
    { name: 'Published achievements', value: data?.publishedAchievements, icon: ShieldCheck, href: '/admin/achievements', tint: 'bg-[#e6ebe2] text-[#617854]' },
    { name: 'Published media', value: data?.publishedMedia, icon: FileImage, href: '/admin/media', tint: 'bg-[#e4e9e9] text-[#537473]' },
  ];
  return <div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{stats.map((stat, i) => <button key={stat.name} onClick={() => onNavigate(stat.href)} className={`group rounded-2xl border border-[#e3dfd4] bg-[#fbf9f3] p-5 text-left transition-transform hover:-translate-y-1 ${i === 0 ? 'sm:col-span-2 xl:col-span-1' : ''}`}><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${stat.tint}`}><stat.icon size={18} /></span><ArrowUpRight size={16} className="text-[#a2aaa2] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div><div className="mt-7 display text-4xl">{loading ? <span className="inline-block h-10 w-14 animate-pulse rounded bg-[#e7e8dc]" /> : error ? '—' : stat.value ?? 0}</div><p className="mt-1 text-xs font-semibold text-[#71837c]">{stat.name}</p></button>)}</div>
    {error && <div className="mt-5 rounded-2xl border border-[#e7c7bb] bg-[#fbf0eb] p-5 text-sm">Overview totals are unavailable. <button onClick={retry} className="font-bold text-[#286d5c]">Retry</button></div>}
    <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-3xl border border-[#e3dfd4] bg-[#fbf9f3] p-6 md:p-8"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a06f59]">At a glance</p><h3 className="display mt-3 text-3xl">A good day starts with clear details.</h3><p className="mt-3 max-w-lg text-sm leading-6 text-[#71837c]">Use this workspace to keep appointments moving and ensure public information is current. Only published material appears on the hospital site.</p><button onClick={() => onNavigate('/admin/appointments')} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#286d5c] px-5 py-3 text-xs font-bold text-white">Review appointment requests <ArrowUpRight size={14} /></button></section>
      <section className="rounded-3xl bg-[#e9eee6] p-6 md:p-8"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f8f5ec] text-[#286d5c]"><ImagePlus size={19} /></div><h3 className="brand mt-5 font-bold">Keep the public site current</h3><p className="mt-2 text-sm leading-6 text-[#71837c]">Add doctor availability, a new event, or a published hero video whenever your team is ready.</p><button onClick={() => onNavigate('/admin/media')} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#286d5c]">Open media library <ArrowUpRight size={15} /></button></section>
    </div>
  </div>;
}

function AppointmentTable({ records, onChange, isPending }: { records: Appointment[]; onChange: (appointment: Appointment, status: AppointmentUpdateStatus) => void; isPending: boolean }) {
  const [filter, setFilter] = useState('all');
  const statuses: AppointmentUpdateStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];
  const visible = filter === 'all' ? records : records.filter((record) => record.status === filter);
  if (!records.length) return <EmptyAdmin title="No appointment requests yet" message="When a patient requests a visit, it will appear here for your team to review." />;
  return <div className="overflow-hidden rounded-2xl border border-[#e3dfd4] bg-[#fbf9f3]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e3d8] px-5 py-4"><p className="text-sm font-bold">{records.length} {records.length === 1 ? 'request' : 'requests'}</p><label className="flex items-center gap-2 text-xs font-semibold text-[#71837c]">Filter <span className="relative"><select value={filter} onChange={(e) => setFilter(e.target.value)} className="appearance-none rounded-full border border-[#ded8cb] bg-[#f7f4ec] py-2 pl-3 pr-8 text-xs capitalize text-[#23463f]" data-testid="select-appointment-filter"><option value="all">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-2.5" /></span></label></div>
    {!visible.length ? <EmptyAdmin title="No requests match" message="Choose another status to see appointment requests." /> : <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead><tr className="bg-[#f3f1e8] text-[10px] uppercase tracking-[.15em] text-[#839087]"><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Visit</th><th className="px-5 py-3">Preferred</th><th className="px-5 py-3">Doctor</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Update status</th></tr></thead><tbody>{visible.map((record) => <tr key={record.id} className="border-t border-[#eee9df]"><td className="px-5 py-4"><p className="font-bold">{record.patientName}</p><a href={`tel:${record.patientPhone}`} className="mt-1 block text-xs text-[#71837c]">{record.patientPhone}</a>{record.patientEmail && <a href={`mailto:${record.patientEmail}`} className="mt-1 block text-xs text-[#71837c]">{record.patientEmail}</a>}</td><td className="px-5 py-4 text-xs text-[#63766e]">{record.visitType}</td><td className="px-5 py-4"><p className="text-xs font-semibold">{new Date(record.preferredDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p><p className="mt-1 text-xs text-[#71837c]">{record.preferredSlot}</p></td><td className="px-5 py-4 text-xs text-[#63766e]">{record.doctorName || 'No preference'}</td><td className="px-5 py-4"><Badge quiet={record.status === 'cancelled'}>{record.status}</Badge></td><td className="px-5 py-4"><select disabled={isPending} value={record.status} onChange={(e) => onChange(record, e.target.value as AppointmentUpdateStatus)} className="rounded-lg border border-[#ded8cb] bg-[#f8f6ef] px-2.5 py-2 text-xs capitalize disabled:opacity-50" data-testid={`select-appointment-status-${record.id}`}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>}
  </div>;
}

function RecordTable({ kind, records, onEdit, onDelete, deleteError, setDeleteError }: { kind: Kind; records: AnyRecord[]; onEdit: (record: AnyRecord) => void; onDelete: (record: AnyRecord) => void; deleteError: string; setDeleteError: (value: string) => void }) {
  const definition = definitions[kind];
  if (!records.length) return <EmptyAdmin title={`No ${definition?.singular ?? 'records'} yet`} message={`There are no ${kind} to display. Add a ${definition?.singular ?? 'record'} when the information is ready.`} />;
  return <div className="overflow-hidden rounded-2xl border border-[#e3dfd4] bg-[#fbf9f3]">
    {deleteError && <div role="alert" className="flex items-center justify-between bg-[#fbf0eb] px-5 py-3 text-sm text-[#93483d]">{deleteError}<button onClick={() => setDeleteError('')} aria-label="Dismiss delete error"><X size={15} /></button></div>}
    <div className="overflow-x-auto"><table className="w-full min-w-[690px] text-left text-sm"><thead><tr className="bg-[#f3f1e8] text-[10px] uppercase tracking-[.15em] text-[#839087]"><th className="px-5 py-3">Name</th><th className="px-5 py-3">Details</th><th className="px-5 py-3">Visibility</th><th className="px-5 py-3">Added</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody>{records.map((record) => <tr key={record.id} className="border-t border-[#eee9df]"><td className="px-5 py-4"><p className="font-bold">{getRecordTitle(record)}</p>{'specialty' in record && <p className="mt-1 text-xs text-[#71837c]">{record.title}{record.specialty ? ` · ${record.specialty}` : ''}</p>}</td><td className="max-w-xs px-5 py-4 text-xs leading-5 text-[#71837c]">{kind === 'doctors' && 'availabilityHours' in record ? `${record.availabilityDays.join(', ')} · ${record.availabilityHours}` : kind === 'events' && 'startsAt' in record ? `${new Date(record.startsAt).toLocaleDateString(undefined, { dateStyle: 'medium' })} · ${record.location}` : kind === 'achievements' && 'achievedYear' in record ? `${record.achievedYear} · ${record.description}` : ''}</td><td className="px-5 py-4"><Badge quiet={getRecordStatus(record) === 'Draft' || getRecordStatus(record) === 'Hidden'}>{getRecordStatus(record)}</Badge></td><td className="px-5 py-4 text-xs text-[#71837c]">{new Date(record.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => onEdit(record)} className="grid h-9 w-9 place-items-center rounded-full border border-[#ded8cb] hover:bg-[#edf1e9]" aria-label={`Edit ${getRecordTitle(record)}`} data-testid={`button-edit-${kind}-${record.id}`}><Pencil size={15} /></button><button onClick={() => onDelete(record)} className="grid h-9 w-9 place-items-center rounded-full border border-[#e7d5ce] text-[#a55448] hover:bg-[#fbefeb]" aria-label={`Delete ${getRecordTitle(record)}`} data-testid={`button-delete-${kind}-${record.id}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>
  </div>;
}

function MediaManager({ records, onUpload, uploadPending, onToggle, onEdit, onDelete, deleteError, setDeleteError }: { records: MediaItem[]; onUpload: (event: FormEvent<HTMLFormElement>) => void; uploadPending: boolean; onToggle: (item: MediaItem, field: 'isPublished' | 'isHeroVideo') => void; onEdit: (item: MediaItem) => void; onDelete: (record: AnyRecord) => void; deleteError: string; setDeleteError: (value: string) => void }) {
  return <div>
    <form onSubmit={onUpload} className="mb-8 rounded-3xl border border-[#e3dfd4] bg-[#fbf9f3] p-5 md:p-7">
      <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e5eee6] text-[#286d5c]"><ImagePlus size={18} /></span><div><h3 className="brand font-bold">Add media to the library</h3><p className="mt-1 text-xs text-[#71837c]">Images and video are uploaded directly to secure object storage.</p></div></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-bold text-[#52665e] lg:col-span-2">Choose image or video<input required type="file" name="file" accept="image/*,video/*" className="mt-1.5 w-full rounded-xl border border-dashed border-[#cfc8ba] bg-[#f8f6ef] px-3 py-3 text-xs file:mr-3 file:rounded-full file:border-0 file:bg-[#e5eee6] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#286d5c]" data-testid="input-media-file" /></label>
        <label className="text-xs font-bold text-[#52665e] lg:col-span-2">Title<input required name="title" placeholder="A clear title" className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3.5 py-3 text-sm outline-none focus:border-[#286d5c]" data-testid="input-media-title" /></label>
        <label className="text-xs font-bold text-[#52665e] lg:col-span-2">Caption<input name="caption" placeholder="Optional caption" className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3.5 py-3 text-sm outline-none focus:border-[#286d5c]" /></label>
        <label className="text-xs font-bold text-[#52665e] lg:col-span-2">Alternative text<input name="altText" placeholder="Describe the image for accessibility" className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3.5 py-3 text-sm outline-none focus:border-[#286d5c]" /></label>
        <label className="text-xs font-bold text-[#52665e]">Sort order<input type="number" name="sortOrder" defaultValue="0" className="mt-1.5 w-full rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-3.5 py-3 text-sm outline-none focus:border-[#286d5c]" /></label>
        <div className="flex flex-col justify-center gap-3"><label className="flex items-center gap-2 text-xs font-semibold text-[#52665e]"><input type="checkbox" name="isPublished" className="accent-[#286d5c]" /> Publish on the site</label><label className="flex items-center gap-2 text-xs font-semibold text-[#52665e]"><input type="checkbox" name="isHeroVideo" className="accent-[#286d5c]" /> Use as hero video</label></div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#ebe6db] pt-5"><p className="max-w-lg text-[11px] leading-5 text-[#849087]">Hero playback uses a published video asset. Videos are muted and looped automatically; visitors with reduced motion will not see motion effects.</p><button disabled={uploadPending} type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#286d5c] px-5 py-3 text-sm font-bold text-white disabled:opacity-50" data-testid="button-upload-media">{uploadPending ? 'Uploading…' : 'Upload media'}<Plus size={15} /></button></div>
    </form>
    {deleteError && <div role="alert" className="mb-4 flex items-center justify-between rounded-xl bg-[#fbf0eb] px-4 py-3 text-sm text-[#93483d]">{deleteError}<button onClick={() => setDeleteError('')} aria-label="Dismiss delete error"><X size={15} /></button></div>}
    {!records.length ? <EmptyAdmin title="Your media library is empty" message="Upload a hospital image or video when your team is ready to publish it." /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{records.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-[#e3dfd4] bg-[#fbf9f3]">
      <div className="relative aspect-[16/9] bg-[#e7e8dc]">{item.mediaType === 'video' ? <video src={item.assetUrl} controls className="h-full w-full object-cover" /> : <img src={item.assetUrl} alt={item.altText || item.title} className="h-full w-full object-cover" />}{item.isHeroVideo && <span className="absolute left-3 top-3 rounded-full bg-[#173f39] px-3 py-1 text-[10px] font-bold text-white">Hero video</span>}</div>
      <div className="p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-xs text-[#71837c]">{item.mediaType} · order {item.sortOrder}</p></div><Badge quiet={!item.isPublished}>{item.isPublished ? 'Published' : 'Draft'}</Badge></div>{item.caption && <p className="mt-3 text-xs leading-5 text-[#71837c]">{item.caption}</p>}<div className="mt-4 flex flex-wrap gap-2 border-t border-[#ebe6db] pt-4"><button onClick={() => onEdit(item)} className="rounded-full border border-[#ded8cb] px-3 py-2 text-[11px] font-bold">Edit details</button><button onClick={() => onToggle(item, 'isPublished')} className="rounded-full border border-[#ded8cb] px-3 py-2 text-[11px] font-bold">{item.isPublished ? 'Unpublish' : 'Publish'}</button>{item.mediaType === 'video' && <button onClick={() => onToggle(item, 'isHeroVideo')} className="rounded-full border border-[#ded8cb] px-3 py-2 text-[11px] font-bold">{item.isHeroVideo ? 'Remove hero role' : 'Set as hero'}</button>}<button onClick={() => onDelete(item)} className="ml-auto grid h-8 w-8 place-items-center rounded-full text-[#a55448] hover:bg-[#fbefeb]" aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button></div></div>
    </article>)}</div>}
  </div>;
}

function EditorModal({ definition, initial, pending, onClose, onSubmit, error }: { definition: Definition; initial: Record<string, unknown>; pending: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; error: string }) {
  const [values, setValues] = useState(initial);
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#173f39]/50 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div role="dialog" aria-modal="true" aria-labelledby="editor-title" className="my-6 w-full max-w-2xl rounded-[1.75rem] bg-[#fbf9f3] p-6 shadow-[0_25px_90px_rgba(18,49,43,.28)] md:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a06f59]">Hospital workspace</p><h2 id="editor-title" className="display mt-2 text-3xl">{definition.title}</h2><p className="mt-1 text-xs text-[#71837c]">{definition.description}</p></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-[#ded8cb]" aria-label="Close form"><X size={17} /></button></div>
      <form onSubmit={onSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">{definition.fields.map((field) => <div key={field.name} className={field.full || field.type === 'textarea' || field.type === 'checkbox' ? 'sm:col-span-2' : ''}><InputField field={field} value={values[field.name]} onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))} />{field.type === 'checkbox' && <input type="hidden" name={field.name} value={values[field.name] ? 'on' : ''} />}</div>)}
        {error && <p role="alert" className="text-sm text-[#a5453a] sm:col-span-2">{error}</p>}
        <div className="mt-2 flex justify-end gap-3 border-t border-[#e8e3d8] pt-5 sm:col-span-2"><button type="button" onClick={onClose} className="rounded-full px-5 py-3 text-sm font-bold text-[#71837c]">Cancel</button><button disabled={pending} type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#286d5c] px-6 py-3 text-sm font-bold text-white disabled:opacity-50" data-testid="button-save-record">{pending ? 'Saving…' : 'Save changes'}<Check size={15} /></button></div>
      </form>
    </div>
  </div>;
}

function EmptyAdmin({ title, message }: { title: string; message: string }) {
  return <div className="rounded-3xl border border-dashed border-[#d7d1c4] bg-[#fbf9f3] px-6 py-14 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8eee5] text-[#286d5c]"><ClipboardList size={20} /></span><h3 className="display mt-4 text-2xl">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71837c]">{message}</p></div>;
}

export default Admin;
