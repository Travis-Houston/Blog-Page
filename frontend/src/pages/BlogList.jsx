import React, { useState, useEffect } from 'react'
import { HiPencilAlt } from "react-icons/hi";
import BlogCard from '../components/BlogCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

export default function BlogList() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [blogs, setBlogs] = useState([
      {
        id: 1,
        title: "Hello World",
        desc: "Miku ooeeoo",
        image: "https://example.com/image1.jpg",
        slug: "hello-world",
      }
    ]);

    // FastAPI call to fetch blog data
    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/v1/posts');
            console.log(response);
            setBlogs(response.data.result);
        } catch (error) {
          console.log(error);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000)
          console.log("done")
        }
      }

      useEffect(() => {
        fetchBlogs();
      }, [])

  return (
    // Main container with Miku-themed gradient background
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-teal-100 to-teal-50'>
      {/* Loading spinner */}
      {isLoading && <Loading/>}
      
      {/* Blog list container - now fully responsive */}
      <div className='flex flex-col w-full max-w-[95%] sm:max-w-[90%] md:max-w-[560px] lg:max-w-[740px] 
                      bg-white shadow-lg rounded-md p-3 sm:p-4 md:p-6 border-t-4 border-teal-400'>
        
        {/* Header section with responsive title and write button */}
        <div className='flex flex-row justify-between items-center mb-4 md:mb-6'>
          <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-teal-600 mr-2'>
            Travis's Blog Collection
          </h1>
          <button 
            className='border rounded-full p-2 sm:p-3 bg-teal-500 text-white shadow-md hover:shadow-lg hover:bg-teal-400 transition duration-300 flex items-center justify-center'
            onClick={() => navigate("/write")}
          >
            <HiPencilAlt className='w-4 h-4 sm:w-5 sm:h-5'/>
          </button>
        </div>
        
        {/* Blog entries container - responsive grid */}
        <div className='grid gap-3 sm:gap-4'>
            {blogs.map((item, index) => (
                <BlogCard 
                  key={index}
                  title={item.title}
                  desc={item.desc}
                  image={item.img}
                  onClick={() => navigate("/blog/" + item.id)} 
                />
            ))}
        </div>
        
        {/* No blogs state */}
        {!isLoading && blogs.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            <p>No blog posts yet.</p>
            <button 
              onClick={() => navigate("/write")}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-400"
            >
              Create Your First Post
            </button>
          </div>
        )}
        
        {/* Footer section */}
        <div className='mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-teal-100 text-center text-teal-400 text-xs sm:text-sm'>
          <p>© 2025 Travis Houston</p>
        </div>
      </div>
    </div>
  )
}