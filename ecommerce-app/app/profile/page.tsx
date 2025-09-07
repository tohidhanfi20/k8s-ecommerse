import Button from "@/components/Button";
import { NextAuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";

export default async function Profile() {
  const session = await getServerSession(authOptions as NextAuthOptions);
  
  if (!session) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1>Welcome to Your Profile</h1>
        <p>Please sign in to view your profile information.</p>
        <Button type="signin" />
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#3958D8', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          User Profile
        </h1>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile Picture"
              width={80}
              height={80}
              style={{ borderRadius: '50%' }}
            />
          )}
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>
              {session.user?.name || 'No Name'}
            </h2>
            <p style={{ margin: '0', color: '#666' }}>
              {session.user?.email || 'No Email'}
            </p>
            {(session.user as any)?.role && (
              <span style={{
                backgroundColor: '#3958D8',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                textTransform: 'uppercase'
              }}>
                {(session.user as any).role}
              </span>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#3958D8', marginBottom: '10px' }}>Orders</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>0</p>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>Total Orders</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#3958D8', marginBottom: '10px' }}>Wishlist</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>0</p>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>Saved Items</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#3958D8', marginBottom: '10px' }}>Cart</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>0</p>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>Items in Cart</p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/cart" style={{
            backgroundColor: '#3958D8',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            View Cart
          </Link>
          
          <Link href="/" style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Continue Shopping
          </Link>
          
          <Button type="signout" />
        </div>
      </div>
    </div>
  );
}
