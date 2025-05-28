'use client';
import { useState } from 'react';
import { FaGoogle, FaGithub, FaEyeSlash, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setError('');

    if (!email || !name) {
      setError('Please fill in all required fields');
      return;
    }
    if (number.length !== 10) {
      setError('Please check your number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, mobile: number }),
      });

      if (response.ok) {
        toast.success('Account created successfully!');
        router.push('/handler/sign-in');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Signup failed');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className=' flex h-[87vh] items-center justify-center bg-background'>
      <div className='bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Create Account</h2>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4' role='alert'>
            <span className='block sm:inline'>{error}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className='space-y-4'
        >
          <div className='relative'>
            <input
              type='text'
              id='name'
              placeholder=' '
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className='w-full px-4 py-2 pt-5 rounded-lg border bg-white/5 backdrop-blur-sm border-white/10 focus:outline-none focus:border-primary peer'
            />
            <label htmlFor='name' className='absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'>
              Your Name
            </label>
          </div>

          <div className='relative'>
            <input
              type='email'
              id='email'
              placeholder=' '
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className='w-full px-4 py-2 pt-5 rounded-lg border bg-white/5 backdrop-blur-sm border-white/10 focus:outline-none focus:border-primary peer'
            />
            <label htmlFor='email' className='absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'>
              Email Address
            </label>
          </div>

          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              placeholder=' '
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className='w-full px-4 py-2 pt-5 rounded-lg border bg-white/5 backdrop-blur-sm border-white/10 focus:outline-none focus:border-primary peer'
            />
            <label htmlFor='password' className='absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'>
              Password
            </label>

            <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors'>
              {showPassword ? <FaEyeSlash className='h-5 w-5' /> : <FaEye className='h-5 w-5' />}
            </button>
          </div>

          <div className='relative'>
            <input
              type='tel'
              id='mobile'
              placeholder=' '
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
                setError('');
              }}
              className='w-full px-4 py-2 pt-5 rounded-lg border bg-white/5 backdrop-blur-sm border-white/10 focus:outline-none focus:border-primary peer'
              pattern='[0-9]{10}'
            />
            <label htmlFor='mobile' className='absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'>
              Contact Number
            </label>
          </div>

          <button type='submit' className='w-full bg-primary text-black font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed' disabled={isLoading}>
            {isLoading ? (
              <div className='flex justify-center items-center'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-white/20'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-background text-gray-500'>Or continue with</span>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-2 gap-4'>
            <button
              // onClick={signInWithGoogle}
              className='flex items-center justify-center px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors'
            >
              <FaGoogle className='mr-2' />
              Google
            </button>
            <button
              // onClick={signInWithGithub}
              className='flex items-center justify-center px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors'
            >
              <FaGithub className='mr-2' />
              GitHub
            </button>
          </div>
        </div>

        <p className='mt-8 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link href='/handler/sign-in' className='text-primary hover:underline'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
