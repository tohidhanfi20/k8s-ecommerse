"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/profile"
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        minWidth: '300px'
      }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button type="submit" style={{
          padding: '12px',
          backgroundColor: '#3958D8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          Sign In
        </button>
      </form>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Use any email and password to sign in (dummy authentication)
      </p>
    </div>
  )
}
