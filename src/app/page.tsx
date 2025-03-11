import { MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <nav className="bg-background absolute top-0 w-full">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center gap-2">
                <MessageCircleQuestion className="text-foreground h-8 w-auto" />
                <span className="text-foreground text-3xl">
                  <span className="font-extrabold">Quiz</span>Track
                </span>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-4">
              <Link
                href="/sign-in"
                className="bg-primary hover:bg-primary/80 text-primary-foreground inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              {/* <Link
                href="/sign-up"
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
              >
                Sign Up
              </Link> */}
            </div>
          </div>
        </div>
      </nav>
      <span className="text-6xl text-white">
        <span className="font-extrabold">Quiz</span>Track
      </span>
      <span className="text-3xl text-white">is your team ready?</span>
    </main>
  );
}
