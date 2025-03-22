import { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video } from "@/components/ui/video";
import { baseUrl } from "@/config/app";

export default function InstallGuidePage() {
  return (
    <div className="container mx-auto space-y-10 py-20">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Install Somnyx on Your Device</h1>
        <p className="text-muted-foreground">
          Follow these simple steps to install Somnyx and get the best
          experience
        </p>
      </div>

      <Tabs defaultValue="ios" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ios">iOS (iPhone/iPad)</TabsTrigger>
          <TabsTrigger value="android">Android</TabsTrigger>
        </TabsList>

        <TabsContent value="ios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Installing on iOS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Safari Installation */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Using Safari</h3>
                    <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                      <li>Open Safari on your iOS device</li>
                      <li>Visit somnyx.app</li>
                      <li>Tap the share button (square with arrow)</li>
                      <li>Select &quot;Add to Home Screen&quot;</li>
                      <li>Tap &quot;Add&quot; to confirm</li>
                    </ol>
                  </div>
                  <Video
                    src="https://4uhzx602rx.ufs.sh/f/Hl8XV8t2FkeUnjOV26lTEXKg4nDHBz3jtAvxbJya7le9Gmc1"
                    className="mx-auto aspect-[9/16] w-full max-w-[280px]"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                {/* Chrome Installation */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Using Chrome</h3>
                    <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                      <li>Open Chrome on your iOS device</li>
                      <li>Visit somnyx.app</li>
                      <li>Tap the three dots menu</li>
                      <li>Select &quot;Add to Home Screen&quot;</li>
                      <li>Tap &quot;Add&quot; to confirm</li>
                    </ol>
                  </div>
                  <Video
                    src="https://4uhzx602rx.ufs.sh/f/Hl8XV8t2FkeU82DLWEWhvRmTug0AcFEH4ex73NhK12nJbzCk"
                    className="mx-auto aspect-[9/16] w-full max-w-[280px]"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="android" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Installing on Android</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="mx-auto max-w-md space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Using Chrome</h3>
                  <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                    <li>Open Chrome on your Android device</li>
                    <li>Visit somnyx.app</li>
                    <li>Tap &quot;Install&quot; when prompted</li>
                    <li>
                      Or tap the three dots menu and select &quot;Install
                      app&quot;
                    </li>
                    <li>Tap &quot;Install&quot; to confirm</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Benefits of Installing</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2">
            <li>Faster access to your dreams and insights</li>
            <li>Push notifications for dream reminders</li>
            <li>Feels like a native app</li>
            <li>No App Store required</li>
            <li>Always up to date</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Need help? Contact us at{" "}
          <a
            href="mailto:somnyxapp@gmail.com"
            className="underline transition-colors duration-150 hover:text-primary"
          >
            somnyxapp@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Install Somnyx App - Installation Guide",
  description:
    "Learn how to install Somnyx on your iOS or Android device. Get faster access to your dreams, push notifications, and a native app experience without the App Store.",
  alternates: {
    canonical: `${baseUrl}/install-guide`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Install Somnyx App - Installation Guide",
    description:
      "Learn how to install Somnyx on your iOS or Android device. Get faster access to your dreams, push notifications, and a native app experience without the App Store.",
    url: `${baseUrl}/install-guide`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Install Somnyx App - Installation Guide",
    description:
      "Learn how to install Somnyx on your iOS or Android device. Get faster access to your dreams, push notifications, and a native app experience without the App Store.",
  },
};
