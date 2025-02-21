self.addEventListener("push", function (event) {
  if (event.data) {
    let payload;
    try {
      payload = event.data.json();
    } catch (e) {
      payload = {
        title: "Somnyx",
        body: event.data.text(),
        icon: "/icon-192x192.png",
      };
    }

    const options = {
      body: payload.body,
      icon: payload.icon || "/icon-192x192.png",
      badge: "/icon-192x192.png", // Optional: adds a small icon for Android
      vibrate: [100, 50, 100],
      tag: payload.data?.type || "default", // Groups similar notifications
      data: {
        url: payload.url,
        ...payload.data,
        dateOfArrival: Date.now(),
      },
      actions: payload.actions || [], // Optional: add action buttons
    };

    event.waitUntil(self.registration.showNotification(payload.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Get the URL from the notification data or fallback to scope
  const url = event.notification.data?.url || self.registration.scope;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // If no window/tab is already open, open a new one
      return clients.openWindow(url);
    })
  );
});
