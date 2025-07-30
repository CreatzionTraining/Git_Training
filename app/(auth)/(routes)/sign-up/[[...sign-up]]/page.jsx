'use client';

import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <section className="bg-white">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm p-4 ">
          <SignUp />
        </div>
      </div>
    </section>
  );
}
