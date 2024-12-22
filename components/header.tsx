'use client'
import React from 'react'
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from '@clerk/nextjs';
import { Sign } from 'crypto';
import Breadcrumbs from './Breadcrumbs';
import { ModeToggle } from './mode-toggle';

const Header = () => {
    const {user} = useUser();
  return (
    <div className='flex items-center justify-between p-4'>
      {user && (
        <h1 className='font-bold text-xl'>NoteQ</h1>
      )}

      <Breadcrumbs/>

      <div>
        <SignedOut>
          <SignInButton/>
        </SignedOut>

        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
    </div>
  )
}

export default Header