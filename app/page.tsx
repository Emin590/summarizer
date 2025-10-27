import React from 'react'
import Title from '@/components/Title';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen items-center bg-navbar gap-8 pt-20 px-4 sm:px-6 lg:px-8'>
      <Title />
      <div className='flex flex-row gap-2 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl'>
        <Input type="text" placeholder="Enter link here" className="bg-white border-none"/>
        <Button variant="outline" className="bg-button border-none hover:bg-white">Summarize</Button>
      </div>

    </div>  
  )
}

export default Home