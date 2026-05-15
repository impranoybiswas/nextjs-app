import React from 'react'

export default function Navbar() {
  return (
    <nav className='max-w-lg mx-auto bg-primary/50 h-16 sticky top-0 z-50 backdrop-blur-sm'>
        <div className='container mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <span className='text-xl font-semibold'>Logo</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='text-xl font-semibold'>Logo</span>
                </div>
            </div>
        </div>
    </nav>
  )
}
