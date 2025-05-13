import React from 'react'
import mikuLoadingGif from '../image/miku-loading.gif'

export default function Loading() {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-teal-50/90 backdrop-blur-sm'>
      <div className='flex flex-col items-center bg-white py-6 px-12 border border-teal-200 rounded-lg shadow-xl cursor-default'>
        {/* Miku GIF container */}
        <div className='w-48 h-48 flex items-center justify-center'>
          <img 
            src={mikuLoadingGif}
            alt="Hatsune Miku Loading"
            className='max-w-full max-h-full object-contain'
          />
        </div>
        
        {/* Cute Miku-themed loading text animation */}
        <div className='flex items-center mt-4 space-x-1 font-medium'>
          {/* Music note */}
          <span className="text-[#39C5BB] animate-bounce text-xl inline-block">♪</span>
          
          {/* Animated text with letters bouncing in sequence */}
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '0.1s'}}>L</span>
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '0.2s'}}>o</span>
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '0.3s'}}>a</span>
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '0.4s'}}>d</span>
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '0.5s'}}>i</span>
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '0.6s'}}>n</span>
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '0.7s'}}>g</span>
          
          {/* Animated dots */}
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '0.8s'}}>.</span>
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '0.9s'}}>.</span>
          <span className="text-[#39C5BB] animate-bounce inline-block" style={{animationDelay: '1s'}}>.</span>
          
          {/* Music note */}
          <span className="text-[#39C5BB] animate-bounce text-xl inline-block" style={{animationDelay: '1.1s'}}>♪</span>
        </div>
      </div>
    </div>
  )
}