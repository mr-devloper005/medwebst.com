import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function allPosts(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

function usableImage(post?: SitePost | null) {
  const image = getEditablePostImage(post)
  return image && !image.includes('placeholder') ? image : ''
}

function categoryOf(post?: SitePost | null) {
  return getEditableCategory(post).replace(/_/g, ', ')
}

function MetaLine({ post }: { post: SitePost }) {
  return (
    <p className="text-sm leading-6">
      <Link href="/article" className="underline decoration-[var(--slot4-accent)] underline-offset-2">{categoryOf(post)}</Link>
      <span className="mx-2 text-[var(--slot4-muted-text)]">Latest</span>
    </p>
  )
}

function ImageOrBrand({ post, className = 'aspect-[16/10]' }: { post: SitePost; className?: string }) {
  const image = usableImage(post)
  return (
    <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${className}`}>
      {image ? (
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#172a3d,#d21f86)] px-6 text-center text-sm font-bold uppercase tracking-[0.16em] text-white">
          {SITE_CONFIG.name} insight
        </div>
      )}
    </div>
  )
}

function FeatureCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="group grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div className="pt-1">
        <MetaLine post={post} />
        <Link href={href}>
          <h1 className="mt-3 max-w-xl text-4xl font-bold leading-[1.12] sm:text-5xl">{post.title}</h1>
        </Link>
        <p className="mt-6 max-w-lg text-base leading-7">{getEditableExcerpt(post, 230) || 'Explore a practical perspective for business readers, professionals, students and researchers.'}</p>
        <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline decoration-[var(--slot4-accent)] underline-offset-4">
          Read more <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <Link href={href} className="block">
        <ImageOrBrand post={post} className="aspect-[16/10] lg:aspect-[16/9]" />
      </Link>
    </article>
  )
}

function SideFeature({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="group">
      <Link href={href}><ImageOrBrand post={post} className="aspect-[16/9]" /></Link>
      <MetaLine post={post} />
      <Link href={href}><h2 className="mt-2 text-2xl font-bold leading-tight">{post.title}</h2></Link>
      <p className="mt-2 text-sm">by <span className="underline">{SITE_CONFIG.name}</span></p>
    </article>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="group">
      <Link href={href}><ImageOrBrand post={post} className="aspect-[16/9]" /></Link>
      <MetaLine post={post} />
      <Link href={href}><h3 className="mt-2 text-2xl font-bold leading-tight">{post.title}</h3></Link>
      <p className="mt-2 text-sm">by <span className="underline">{SITE_CONFIG.name}</span></p>
    </article>
  )
}

function HorizontalCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid gap-4 border-t border-[var(--editable-border)] py-5 sm:grid-cols-[160px_minmax(0,1fr)]">
      <ImageOrBrand post={post} className="aspect-[16/10]" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-accent)]">{categoryOf(post)}</p>
        <h3 className="mt-2 text-xl font-bold leading-tight">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

function EditorialListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid grid-cols-[44px_minmax(0,1fr)] gap-4 border-t border-[var(--editable-border)] py-4">
      <span className="editable-display text-3xl font-bold text-[var(--slot4-accent)]">{String(index + 1).padStart(2, '0')}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-muted-text)]">{categoryOf(post)}</p>
        <h3 className="mt-1 text-lg font-bold leading-tight group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
      </div>
    </Link>
  )
}

function CompactTile({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block min-w-[280px] max-w-[280px] shrink-0">
      <ImageOrBrand post={post} className="aspect-[16/9]" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-accent)]">{categoryOf(post)}</p>
      <h3 className="mt-1 line-clamp-2 text-xl font-bold leading-tight">{post.title}</h3>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  const feature = pool[0]
  const side = pool[1]
  if (!feature) return null

  return (
    <section className="bg-white">
      <div className={`${container} py-12 sm:py-14`}>
        <div className="mb-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <form action="/search" className="flex max-w-2xl border border-[var(--editable-border)] bg-white">
            <label className="flex min-w-0 flex-1 items-center gap-2 px-4">
              <Search className="h-5 w-5 text-[var(--slot4-accent)]" />
              <input name="q" placeholder="Search articles, businesses, resources" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" />
            </label>
            <button className="bg-[var(--slot4-accent)] px-5 text-sm font-bold text-white">Search</button>
          </form>
          <p className="text-sm leading-6 text-[var(--slot4-muted-text)]">
            Practical reading and business discovery for professionals, founders, students, researchers and customers.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <FeatureCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} />
          {side ? <SideFeature post={side} href={postHref(primaryTask, side, primaryRoute)} /> : null}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections).slice(2, 14)
  if (!pool.length) return null
  return (
    <section className="bg-white">
      <div className={`${container} py-10 sm:py-12`}>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {pool.slice(0, 8).map((post) => (
            <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  const resources = pool.slice(10, 16)
  const trending = pool.slice(16, 28)
  const rail = pool.slice(4, 14)
  if (!pool.length) return null

  return (
    <>
      {rail.length ? (
        <section className="overflow-hidden bg-[var(--slot4-panel-bg)] py-10">
          <div className={`${container}`}>
            <h2 className="editable-display text-4xl font-bold">Moving picks</h2>
          </div>
          <div className="mt-7 flex w-max gap-7 editable-marquee">
            {[...rail, ...rail].map((post, index) => (
              <CompactTile key={`${post.id || post.slug}-${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-[var(--slot4-panel-bg)]">
        <div className={`${container} grid gap-8 py-14 lg:grid-cols-[1fr_1fr]`}>
          <div className="bg-white p-8">
            <h2 className="editable-display text-4xl font-bold">Resources</h2>
            {resources.slice(0, 1).map((post) => (
              <div key={post.id || post.slug} className="mt-7">
                <ImageOrBrand post={post} className="aspect-[16/10]" />
                <Link href={postHref(primaryTask, post, primaryRoute)}><h3 className="mt-5 text-3xl font-bold leading-tight">{post.title}</h3></Link>
                <p className="mt-4 text-base leading-7">{getEditableExcerpt(post, 230)}</p>
              </div>
            ))}
          </div>
          <div className="bg-white p-8">
            <h2 className="editable-display text-4xl font-bold">Business briefs</h2>
            <div className="mt-5">
              {resources.slice(1, 5).map((post) => (
                <HorizontalCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {trending.length ? (
        <section className="bg-white">
          <div className={`${container} py-14`}>
            <div className="border-t border-[var(--editable-border)] pt-8">
              <h2 className="editable-display text-4xl font-bold">Trending</h2>
            </div>
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {trending.slice(0, 8).map((post) => (
                <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
            <div className="mx-auto mt-12 max-w-2xl">
              {trending.slice(8, 12).map((post, index) => (
                <EditorialListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-dark-bg)] text-white">
      <div className={`${container} py-16`}>
        <div className="editable-float max-w-3xl">
          <p className="text-sm font-bold text-[#ffec35]">On demand insight and business discovery</p>
          <h2 className="editable-display mt-4 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">Gain the ideas to expand your professional opportunities</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/78">Read practical articles, compare useful businesses, and find resources aligned with your next decision.</p>
          <Link href="/create" className="mt-8 inline-flex bg-[#ffec35] px-6 py-3 text-sm font-bold text-black">Create a post</Link>
        </div>
      </div>
    </section>
  )
}
