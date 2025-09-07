import Button from "@/components/Button";
import { NextAuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Profile() {
  const session = await getServerSession(authOptions as NextAuthOptions);
  return <>{session ? <Button type="signout" /> : <Button type="signin" />}</>;
}
