'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Code, Users, Mic } from 'lucide-react'
import { MainHeader } from '@/widgets/header/ui/main-header'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />

      {/* Main Content */}
      <main className="flex h-screen items-center justify-center pt-[70px] pb-6">
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Hero */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Code smarter, anywhere
              </h1>
              <p className="text-base text-muted-foreground max-w-xl mx-auto">
                Modern web development platform for seamless collaboration
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <Link 
                  href="/signup"
                  className="bg-foreground text-background px-4 py-2 rounded-sm text-sm font-medium hover:bg-foreground/90 transition-all duration-200"
                >
                  Get Started
                </Link>
                <Link 
                  href="/signin"
                  className="border border-border px-4 py-2 rounded-sm text-sm font-medium hover:bg-muted transition-all duration-200"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Product Screenshot */}
            <div className="flex justify-center">
              <div className="relative max-w-3xl w-full">
                <div className="rounded-lg border border-border border-t-0 border-l-0 shadow-md overflow-hidden">
                  <Image
                    src="/web-ide-screenshot.png"
                    alt="Web IDE Interface"
                    width={700}
                    height={420}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="text-center">
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center mx-auto">
                    <Code className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Cloud IDE</h3>
                  <p className="text-xs text-muted-foreground">
                    Browser-based development
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center mx-auto">
                    <Users className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Collaboration</h3>
                  <p className="text-xs text-muted-foreground">
                    Real-time team work
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center mx-auto">
                    <Mic className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Voice Chat</h3>
                  <p className="text-xs text-muted-foreground">
                    Audio communication
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
