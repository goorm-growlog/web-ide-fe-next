'use client'

import Link from 'next/link'
import { Code } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <main className="container mx-auto px-6 py-20 mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold">
              Code smarter, anywhere. 
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The modern web development platform that brings your ideas to life.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/signup"
                className="bg-primary text-primary-foreground px-6 py-3 rounded font-medium hover:bg-primary/90"
              >
                Join us
              </Link>
              <Link 
                href="/signin"
                className="border border-border px-6 py-3 rounded font-medium hover:bg-muted"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center mx-auto">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Cloud IDE</h3>
              <p className="text-muted-foreground">
                Full-featured development environment in your browser.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center mx-auto">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Real-time Collaboration</h3>
              <p className="text-muted-foreground">
                Work together with your team in real-time.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center mx-auto">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Instant Deploy</h3>
              <p className="text-muted-foreground">
                Deploy your applications with one click.
              </p>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
