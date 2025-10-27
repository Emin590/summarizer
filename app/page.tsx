import React from 'react'
import Title from '@/components/Title';
import { Input } from '@/components/ui/input';

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen items-center bg-navbar gap-8 pt-20 px-4 sm:px-6 lg:px-8'>
      <Title />
      <Input />
    </div>
  )
}

export default Home