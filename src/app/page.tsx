import NotificationSubscription from "@/components/NotificationSubscription/NotificationSubscription";

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
