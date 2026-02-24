import { getAuthUser } from "@/libs/auth-utils";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const user = await getAuthUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
      <p className="mt-4 text-lg">
        Welcome back, <span className="font-semibold">{user.name}</span>!
      </p>
      <p className="text-gray-600">Email: {user.email}</p>

      <LogoutButton />
    </div>
  );
}
