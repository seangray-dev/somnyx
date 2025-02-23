import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InstallGuidePage() {
  return (
    <div className="container mx-auto space-y-6 p-4">
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
              <div className="space-y-4">
                <h3 className="font-semibold">
                  Step 1: Using Safari or Chrome
                </h3>
                <p>
                  You can install Somnyx using either Safari or Chrome on your
                  iOS device.
                </p>
                {/* TODO: Add browser icons */}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Step 2: Open Share Menu</h3>
                <p>
                  In Safari: Tap the share button (square with arrow) at the
                  bottom of the screen.
                  <br />
                  In Chrome: Tap the three dots menu at the bottom of the
                  screen.
                </p>
                {/* TODO: Add share menu screenshots for both browsers */}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Step 3: Add to Home Screen</h3>
                <p>
                  In both browsers, look for and tap &quot;Add to Home Screen&quot;.
                  You might need to scroll to find this option.
                </p>
                {/* TODO: Add add to home screen screenshot */}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Step 4: Confirm Installation</h3>
                <p>
                  Tap &quot;Add&quot; in the top right corner. Somnyx will now
                  be installed on your home screen.
                </p>
                {/* TODO: Add confirmation screenshot */}
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
              <div className="space-y-4">
                <h3 className="font-semibold">Step 1: Installation Prompt</h3>
                <p>
                  You should see an &quot;Add to Home Screen&quot; prompt
                  automatically.
                  If not, continue to step 2.
                </p>
                {/* TODO: Add prompt screenshot */}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Step 2: Menu Option</h3>
                <p>
                  Tap the three dots menu in Chrome and select &quot;Add to
                  Home Screen&quot;.                  
                </p>
                {/* TODO: Add menu screenshot */}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Step 3: Confirm Installation</h3>
                <p>
                  Tap &quot;Add&quot; when prompted. Somnyx will now be installed
                  on your home screen.
                  home screen.
                </p>
                {/* TODO: Add confirmation screenshot */}
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
            <li>Works offline - record dreams anytime</li>
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
          <a href="mailto:support@somnyx.com" className="underline">
            support@somnyx.com
          </a>
        </p>
      </div>
    </div>
  );
}
