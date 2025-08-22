export const dynamic = 'force-dynamic'

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Welcome Back to PeerPen</h1>
          <p className="text-muted-foreground">Sign in to continue sharing and reviewing essays</p>
        </div>

        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              card: "bg-card border border-border shadow-lg",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border border-border hover:bg-accent",
              formFieldInput: "border border-border bg-background",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}
