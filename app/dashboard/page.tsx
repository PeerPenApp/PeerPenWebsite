export const dynamic = 'force-dynamic'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { Plus, FileText, Search, Users, Settings } from "lucide-react"
import { UserButton } from "@/components/user-button"
import Navigation from "@/components/navigation"
import DatabaseInit from "@/components/db-init"

export default function DashboardPage() {
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to PeerPen - your college essay writing companion</p>
          </div>
          <div className="flex gap-3">
            <SearchBar className="w-full md:w-80" />
            <Button asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                Write Essay
              </Link>
            </Button>
          </div>
        </div>

        {/* Database Status */}
        {/* <div className="mb-8">
          <DatabaseInit />
        </div> */}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/create">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Create Essay</h3>
                  <p className="text-muted-foreground text-sm">Write and edit your essays</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/essays">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Search className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Browse Essays</h3>
                  <p className="text-muted-foreground text-sm">Discover essays from other students</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/search">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <Search className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Search</h3>
                  <p className="text-muted-foreground text-sm">Search essays and writers</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Settings className="h-8 w-8 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Settings</h3>
                  <p className="text-muted-foreground text-sm">Manage your account preferences</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity. Start by creating your first essay!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
