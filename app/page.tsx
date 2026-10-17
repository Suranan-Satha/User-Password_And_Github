import Link from "next/link";
import { auth, signOut } from "@/app/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold">Next.js Auth + RBAC Demo</h1>

      {session?.user ? (
        <div className="mt-4 space-y-3">
          <p>
            เข้าสู่ระบบแล้ว: {session.user.name ?? session.user.email} (role:{" "}
            <b>{session.user.role}</b>)
          </p>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              ไปหน้า Admin
            </Link>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="rounded bg-gray-800 px-4 py-2 text-white">
                Logout
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex gap-3">
          <Link
            href="/login"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded border border-gray-300 px-4 py-2"
          >
            Sign Up
          </Link>
        </div>
      )}
    </main>
  );
}
