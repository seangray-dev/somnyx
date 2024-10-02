"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col items-center justify-center space-y-4 text-center lg:items-start lg:text-start">
                <div className="space-y-2">
                  <h1 className="font-lora text-balance text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Somnyx
                  </h1>
                  <div className="font-openSans text-balance text-muted-foreground md:text-xl">
                    Derived from <em>somnus</em> (Latin for <em>sleep</em>) and{" "}
                    <em>Nyx</em> (Greek goddess of the <em>night</em>
                    ). Somnyx is your elegant space to <em>capture</em> and{" "}
                    <em>explore</em> the hidden world of dreams.
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild>
                    <Link href={{ pathname: "/sign-up" }}>
                      Analyze Your Dreams
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
                height="550"
                src="/placeholder.svg"
                width="550"
              />
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  New Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Faster iteration. More innovation.
                </h2>
                <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The platform for rapid progress. Let your team focus on
                  shipping features instead of managing infrastructure with
                  automated CI/CD, built-in testing, and integrated
                  collaboration.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">
                  Infinite scalability, zero config
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable code to run on-demand without needing to manage your
                  own infrastructure or upgrade hardware.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">
                  Real-time insights and controls
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get granular, first-party, real-user metrics on site
                  performance per deployment.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">
                  Personalization at the edge
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Deliver dynamic, personalized content, while ensuring users
                  only see the best version of your site.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-1 lg:gap-10">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Pricing
              </h2>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan thats right for your business.
              </p>
            </div>
            <div className="flex w-full justify-center">
              <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2 lg:justify-end">
                <Card className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Starter</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Perfect for small teams.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-start">
                      <span className="text-4xl font-bold tracking-tight">
                        $9
                      </span>
                      <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        /month
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Billed annually
                    </p>
                  </div>
                  <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />1
                      user
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />1 GB
                      storage
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      Basic analytics
                    </li>
                  </ul>
                  <Button className="w-full">Get started</Button>
                </Card>
                <Card className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Pro</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Perfect for growing teams.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-start">
                      <span className="text-4xl font-bold tracking-tight">
                        $49
                      </span>
                      <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        /month
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Billed annually
                    </p>
                  </div>
                  <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />5
                      users
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      10 GB storage
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      Advanced analytics
                    </li>
                  </ul>
                  <Button className="w-full">Get started</Button>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
