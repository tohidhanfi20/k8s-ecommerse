
"use client"
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    // Automatically sign out when this page loads
    signOut({ 
      callbackUrl: "/",
      redirect: true 
    });
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h2>Signing you out...</h2>
      <p>Please wait while we sign you out.</p>
      <button 
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3958D8',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Sign Out Now
      </button>
    </div>
  )
}
