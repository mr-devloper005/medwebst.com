'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = 'min-h-12 rounded border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-neutral-500 focus:border-[var(--slot4-accent)] focus:ring-2 focus:ring-[var(--slot4-accent)]/15'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--editable-page-bg,#fff7ee)] px-4 py-16 text-[var(--editable-page-text,#2f1d16)] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-8 rounded-[2.8rem] border border-[var(--editable-border)] bg-white/75 p-7 shadow-[0_30px_90px_rgba(15,23,42,0.08)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div className="flex h-full min-h-72 items-center justify-center rounded-[2rem] bg-[var(--editable-page-text,#2f1d16)] text-[var(--editable-page-bg,#fff7ee)]">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center">
              <p className="text-xs font-black uppercase tracking-[0.28em] opacity-55">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-7xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 opacity-70">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--editable-page-text,#2f1d16)] px-6 py-3 text-sm font-black text-[var(--editable-page-bg,#fff7ee)]">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-6 py-3 text-sm font-black">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        <section className="bg-[var(--slot4-accent)] text-white">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">{pagesContent.create.hero.badge}</p>
            <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h1 className="editable-display max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">Publish something useful.</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/85">Add an article or business listing with the details readers need to understand it clearly.</p>
              </div>
              <p className="text-sm font-semibold text-white/80">Signed in as <span className="text-white">{session.name || session.email}</span></p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:py-14">
          <form onSubmit={submit} className="min-w-0">
              <div className="border-b border-[var(--editable-border)] pb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Create {activeTask?.label || 'post'}</p>
                <h2 className="editable-display mt-1 text-3xl font-bold">{pagesContent.create.formTitle}</h2>
              </div>

              <div className="mt-6 grid gap-5">
                <label className="grid gap-2 text-sm font-bold">
                  Content type
                  <select className={fieldClass} value={task} onChange={(event) => setTask(event.target.value as TaskKey)}>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  Title
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter a clear title" required />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold">Category<input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Business, research, careers..." /></label>
                  <label className="grid gap-2 text-sm font-bold">Source URL<input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://" /></label>
                </div>
                <label className="grid gap-2 text-sm font-bold">Featured image URL<input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://" /></label>
                <label className="grid gap-2 text-sm font-bold">Summary<textarea className={`${fieldClass} min-h-28 resize-y`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Give readers a concise overview" required /></label>
                <label className="grid gap-2 text-sm font-bold">Main content<textarea className={`${fieldClass} min-h-64 resize-y`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write the full article, listing details, or description" required /></label>
              </div>

              {created ? (
                <div className="mt-5 rounded border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded bg-[var(--slot4-page-text)] px-7 text-sm font-bold text-white transition hover:bg-[var(--slot4-accent)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
          </form>

          <aside className="border-t border-[var(--editable-border)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Publishing notes</p>
            <h3 className="editable-display mt-3 text-2xl font-bold">Make every detail count.</h3>
            <div className="mt-5 grid gap-5 text-sm leading-6 text-[var(--slot4-muted-text)]">
              <p>Use a specific title and choose the closest category so readers can find your post.</p>
              <p>Add a working source and image URL when available. Posts remain readable when either is omitted.</p>
              <p>Write a short summary first, then include the complete information in the main content field.</p>
            </div>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
