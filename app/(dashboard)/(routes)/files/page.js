  import { UserButton } from '@clerk/nextjs'
  import React from 'react'

  function files() {
    return (
      <div>files
        <UserButton afterSignOutUrl="/" />


      </div>
    )
  }

  export default files