'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { EditableBrand } from '@/editable/shell/EditableBrand'

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Search', href: '/search' },
]

const footerAuthLinks = [
  { label: 'Sign up', href: '/signup' },
  { label: 'Sign in', href: '/login' },
]

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.25fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex text-white" aria-label={`${SITE_CONFIG.name} home`}><EditableBrand compact /></Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/72">
            Practical articles, useful business listings, and research-friendly resources for people making better professional decisions.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffec35]">Navigate</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-white/72 transition hover:text-white">
                {item.label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-left text-sm font-medium text-white transition hover:text-[#ffec35]">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : footerAuthLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-white/72 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs font-medium text-white/58">
        Copyright {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
