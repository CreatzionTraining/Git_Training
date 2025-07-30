  'use client';

  import Header from '@/app/_components/Header';
  import { SignIn } from '@clerk/nextjs';

  export default function Page() {
    return (
      
      <section className="bg-white">
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
          <SignIn />
        </div>
      </section>
    );
  }
