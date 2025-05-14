'use client';
import { useState } from "react";
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');

	const fetchUsers=async()=>{
		try {
			const response = await fetch('/api/users');
			console.log(response)
		} catch (error) {
			console.log(error)
		}
	}

  const onSubmit = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }
    try {

    } catch (err: any) {
      setError(err.message);
    }
  };
  
  return (
    <div className=" flex h-[87vh] items-center justify-center bg-background">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
				<div onClick={fetchUsers}>Fetch user</div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-white/5 backdrop-blur-sm border-white/10 focus:outline-none focus:border-primary"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-white/5 backdrop-blur-sm border-white/10 focus:outline-none focus:border-primary"
              required
            />
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="Contact Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-white/5 backdrop-blur-sm border-white/10 focus:outline-none focus:border-primary"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-foreground font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              // onClick={signInWithGoogle}
              className="flex items-center justify-center px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
            >
              <FaGoogle className="mr-2" />
              Google
            </button>
            <button
              // onClick={signInWithGithub}
              className="flex items-center justify-center px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
            >
              <FaGithub className="mr-2" />
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/handler/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
