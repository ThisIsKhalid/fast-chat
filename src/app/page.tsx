"use client";

import React, { useState } from "react";

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// TODO: Replace with your actual VAPID public key
const VAPID_PUBLIC_KEY =
  "BO7SwoP8qnXyv9GsPL1KIrJH8bg3u7uLUx4L0ssZhc8HUB_4cyMXiRFBpVQnkeoEhHUTfPzAtYusxSK4PfyPh94";

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZXh1cGJwajAwMGJ6YzczMDRiNm80MWIiLCJlbWFpbCI6Im5vdmExQHlvcG1haWwuY29tIiwicm9sZSI6IlBMQVlFUiIsImlhdCI6MTc1NjYxMjA2OCwiZXhwIjoxNzU2Njk4NDY4fQ.fbByJoxlPC2Fh4tDyqHHasXsmBPcgCSIMY76-zOJP4Q"; // Placeholder for actual access token

const NotificationSubscription = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeToNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Permission denied.");
        setLoading(false);
        return;
      }
      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      const p256dhKey = subscription.getKey("p256dh");
      const authKey = subscription.getKey("auth");
      if (!p256dhKey || !authKey) {
        setError("Failed to get subscription keys.");
        setLoading(false);
        return;
      }
      await fetch(
        "http://localhost:8000/api/v1/web-push-notification/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken}`,
          },
          body: JSON.stringify({
            subscription: {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: btoa(String.fromCharCode(...new Uint8Array(p256dhKey))),
                auth: btoa(String.fromCharCode(...new Uint8Array(authKey))),
              },
            },
          }),
        }
      );
      setSubscribed(true);
    } catch (err) {
      setError("Subscription failed.");
      console.error("Subscription failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      <button
        onClick={subscribeToNotifications}
        disabled={subscribed || loading}
        className={`px-6 py-3 rounded-lg shadow-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          ${
            subscribed
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }
          ${loading ? "opacity-60 cursor-wait" : ""}`}
      >
        {subscribed
          ? "✅ Notifications Enabled"
          : loading
          ? "⏳ Enabling..."
          : "🔔 Enable Notifications"}
      </button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome to Fast Chat
      </h1>
      <NotificationSubscription />
    </main>
  );
}
