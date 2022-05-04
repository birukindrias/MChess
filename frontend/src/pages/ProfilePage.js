import useAuth from "../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  return <h1>Hello {user.username}</h1>;
}
