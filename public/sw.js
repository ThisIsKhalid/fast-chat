// Minimal service worker for push notifications
self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Notification";
  const options = {
    body: data.body || "",
    icon: data.icon || "/favicon.ico",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// self.addEventListener("notificationclick", function (event) {
//   console.log("🔔 Notification clicked:", event);

//   const notification = event.notification;
//   const action = event.action;
//   const data = notification.data;

//   event.notification.close();

//   if (data.type === "participation_request") {
//     const sessionId = data.sessionId;

//     if (action === "participate" || action === "not_participate") {
//       // Handle action button clicks (API call to backend)
//       event.waitUntil(handleParticipationAction(sessionId, action, data));
//     } else {
//       // Handle notification body click (open frontend page)
//       event.waitUntil(
//         clients.openWindow(data.url) // This will now open your frontend URL
//       );
//     }
//   }
// });

// Updated API call to use your backend URL
// async function handleParticipationAction(sessionId, action) {
//   try {
//     console.log(`🔄 Processing ${action} for session ${sessionId}`);

//     const userId = await getCurrentUserId();

//     // 🔥 Call your backend API (not frontend)
//     const response = await fetch(
//       `https://api.shfflr.com/api/sessions/${sessionId}/participate`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${await getAuthToken()}`,
//         },
//         body: JSON.stringify({
//           userId,
//           action,
//         }),
//       }
//     );

//     const result = await response.json();

//     if (result.success) {
//       await self.registration.showNotification(
//         action === "participate"
//           ? "✅ Participation Confirmed!"
//           : "👍 Response Recorded",
//         {
//           body: result.message,
//           icon: "/icons/success.png",
//           tag: `confirmation-${sessionId}`,
//           requireInteraction: false,
//           // 🔥 If user wants to view session, open frontend
//           data: {
//             type: "participation_confirmation",
//             sessionId,
//             url: `http://localhost:3000/sessions/${sessionId}`, // Frontend URL
//           },
//         }
//       );
//     }
//   } catch (error) {
//     console.error("❌ Failed to handle participation action:", error);
//   }
// }
