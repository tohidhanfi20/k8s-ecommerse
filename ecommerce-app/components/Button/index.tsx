"use client"
import { signIn, signOut } from "next-auth/react";

export default function Button({type}:{type:string}) {
  return (
    <>
    {
        type==='signout' ? <button onClick={()=>signOut()}>
            SignOut
        </button> : <button onClick={()=>signIn("credentials",{ callbackUrl: '/profile' })}>SignIn</button>
    }</>
  )
}
