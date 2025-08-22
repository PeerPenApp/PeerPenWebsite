export const dynamic = 'force-dynamic'

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, Users, Star } from "lucide-react"
import { UserButton } from "@/components/user-button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PenTool className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-serif font-black text-foreground">PeerPen</h1>
            </div>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-serif font-black text-foreground mb-6">
            Share, Review, and Perfect Your College Essays
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join a community of students helping each other craft compelling college essays through AI-powered feedback
            and peer reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/sign-up">Start Writing</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">Browse Essays</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">
            Everything You Need to Write Better Essays
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <PenTool className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-serif">AI-Powered Feedback</CardTitle>
                <CardDescription>
                  Get instant, detailed feedback on your essay's flow, voice, and authenticity from our advanced AI
                  assistant.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-serif">Peer Reviews</CardTitle>
                <CardDescription>
                  Connect with fellow students to exchange honest feedback and learn from diverse perspectives.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-serif">Essay Scoring</CardTitle>
                <CardDescription>
                  Track your progress with our comprehensive rubric covering flow, hook, voice, uniqueness, and more.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-4xl font-serif font-black text-foreground mb-6">Ready to Transform Your Writing?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students already improving their essays with PeerPen.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/sign-up">Sign Up Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <PenTool className="h-6 w-6 text-accent" />
              <span className="font-serif font-bold text-foreground">PeerPen</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 PeerPen. Helping students write better essays.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
