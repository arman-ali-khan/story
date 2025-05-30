"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BookOpen, PenLine } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
console.log(session,'data')
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-xl">Bengali Stories</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/explore">
            <Button variant="ghost">Explore</Button>
          </Link>
          {session?.user ? (
            <>
              <span className="font-medium">{session.user.name}</span>
              <Button variant="ghost" onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="ghost">Sign Up</Button>
              </Link>
            </>
          )}
          <Link href="/write">
            <Button>
              <PenLine className="mr-2 h-4 w-4" />
              Write
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </nav>
  );
}