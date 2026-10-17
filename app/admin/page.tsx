import { auth, signOut } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <p className="mt-2">เฉพาะ ADMIN เท่านั้น</p>

      <p className="mt-4 text-gray-600">
        เข้าสู่ระบบในชื่อ: {session.user.name ?? session.user.email}
      </p>

      <form
        className="mt-6"
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button className="rounded bg-gray-800 px-4 py-2 text-white">
          Logout
        </button>
      </form>
    </main>
  );
}
