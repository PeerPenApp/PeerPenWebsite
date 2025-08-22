"use client"

export const dynamic = 'force-dynamic'

import EssayEditor from '@/components/essay-editor'
import Navigation from '@/components/navigation'
import { UserButton } from '@/components/user-button'
import Link from 'next/link'

export default function CreateEssayPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard" className="text-2xl font-bold font-serif text-foreground">
              PeerPen
            </Link>
            <UserButton />
          </div>
          <Navigation />
        </div>
      </header>
      <EssayEditor />
    </div>
  )
}
