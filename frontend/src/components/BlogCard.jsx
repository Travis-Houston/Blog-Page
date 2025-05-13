import React from 'react'

export default function BlogCard({title, desc, image, onClick}) {
  return (
    // Individual blog entry
    <button onClick={onClick} className='border border-teal-200 rounded-md p-6 shadow-sm hover:shadow-lg transition duration-300 hover:border-teal-400 bg-gradient-to-r from-white to-teal-50'>
        <div className='flex flex-row justify-between'>
            <div className='text-left'>
            <h2 className='text-xl font-semibold mb-2 text-teal-700'>{title}</h2>
            <p className='text-gray-600'>{desc.slice(0,100)}</p>
            
            {/* Blog metadata */}
            {/*<div className='mt-4 flex items-center text-xs text-teal-500'>
                <span className='mr-3'>June 15, 2023</span>
                <span>4 min read</span>
            </div>*/}
            </div>
            <img 
            src={image} 
            alt={title}
            className='w-[100px] h-[100px] rounded-md object-cover border-2 border-teal-300'
            />
        </div>
    </button>
  )
}