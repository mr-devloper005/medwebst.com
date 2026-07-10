'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, Plus, Search, UserRound, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { EditableBrand } from '@/editable/shell/EditableBrand'

const publicNavItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Search', href: '/search' },
]

const authNavItems = [
  { label: 'Sign up', href: '/signup' },
  { label: 'Sign in', href: '/login' },
]

const publicNavItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Search', href: '/search' },
]

const authNavItems = [
  { label: 'Sign up', href: '/signup' },
  { label: 'Sign in', href: '/login' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = session ? publicNavItems : [...publicNavItems, ...authNavItems]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-white text-[var(--slot4-page-text)]">
      <div className="bg-[var(--slot4-accent)]">
        <div className="mx-auto flex min-h-[86px] max-w-[var(--editable-container)] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0 text-white" aria-label={`${SITE_CONFIG.name} home`}>
            <EditableBrand />
          </Link>

          <form action="/search" className="ml-auto hidden w-full max-w-xl md:block">
            <label className="flex h-10 items-center gap-2 bg-white px-4">
              <Search className="h-4 w-4 text-neutral-500" />
              <input
                name="q"
                type="search"
                placeholder="Search"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-500"
              />
            </label>
          </form>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="ml-auto inline-flex h-10 w-10 items-center justify-center border border-white/40 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav className="mx-auto hidden min-h-[38px] max-w-[var(--editable-container)] items-center gap-6 px-4 text-sm sm:px-6 lg:flex lg:px-8">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href} className={`font-medium transition ${active ? 'text-[var(--slot4-accent)]' : 'hover:text-[var(--slot4-accent)]'}`}>
              {item.label}
            </Link>
          )
        })}
        {session ? (
          <div className="ml-auto flex items-center gap-3">
            <span className="inline-flex max-w-[180px] items-center gap-2 truncate text-sm font-semibold">
              <UserRound className="h-4 w-4 text-[var(--slot4-accent)]" />
              {session.name || session.email}
            </span>
            <Link href="/create" className="inline-flex items-center gap-1.5 bg-[var(--slot4-accent)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white">
              <Plus className="h-3.5 w-3.5" /> Create
            </Link>
            <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] hover:text-[var(--slot4-accent)]">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        ) : null}
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-white px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4 flex h-11 items-center gap-2 border border-[var(--editable-border)] px-3">
            <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
            <input name="q" type="search" placeholder="Search" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </form>
          <div className="grid gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold hover:bg-[var(--slot4-accent-soft)]">
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <div className="mt-2 border-t border-[var(--editable-border)] px-2 pt-3 text-sm font-semibold">
                  {session.name || session.email}
                </div>
                <Link href="/create" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold text-[var(--slot4-accent)]">
                  Create
                </Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="px-2 py-2 text-left text-sm font-semibold">
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
