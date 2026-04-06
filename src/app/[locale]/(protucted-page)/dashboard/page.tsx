import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignoutButton";

// Role অনুযায়ী আলাদা UI component
function AdminView({ name }: { name: string }) {
  return (
    <div className="p-4 bg-primary/10 rounded">
      <h2 className="text-xl font-bold text-red-700">Admin Panel</h2>
      <p>Welcome, {name}! You have full access.</p>
    </div>
  );
}

function ModeratorView({ name }: { name: string }) {
  return (
    <div className="p-4 bg-priamry/10 rounded">
      <h2 className="text-xl font-bold text-yellow-700">Moderator Panel</h2>
      <p>Welcome, {name}! You can manage content.</p>
    </div>
  );
}

function UserView({ name }: { name: string }) {
  return (
    <div className="p-4 bg-primary/10 rounded">
      <h2 className="text-xl font-bold text-green-700">User Dashboard</h2>
      <p>Welcome, {name}!</p>
    </div>
  );
}

const roleViews: Record<UserRole, (name: string) => React.ReactNode> = {
  admin: (name) => <AdminView name={name} />,
  moderator: (name) => <ModeratorView name={name} />,
  user: (name) => <UserView name={name} />,
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const role = (session.user.role as UserRole) ?? "user";
  const name = session.user.name;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <span className="px-3 py-1 rounded-full text-sm capitalize border-primary/70 bg-primary/20 text-primary">
          {role}
        </span>
        <SignOutButton />
      </div>

      {/* Role অনুযায়ী view render */}
      {roleViews[role]?.(name) ?? <UserView name={name} />}
    </div>
  );
}
