import React, {useEffect, useState, useRef, useCallback} from 'react'
import {EditorContent, useEditor} from '@tiptap/react'
// TipTap editor extensions
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import CodeBlock from '@tiptap/extension-code-block'
// Styles and utilities
import "./style/WriteBlog.css";
import firebase from '../utils/firebase'
import { useNavigate } from 'react-router-dom'

export default function WriteBlog() {
  //==========================================================================
  // STATE MANAGEMENT
  //==========================================================================
  // Editor content state
  const [editorContent, setEditorContent] = useState("<p>Type Here...</p>")
  const fileInputRef = useRef(null)

  // Blog post metadata
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [slug, setSlug] = useState("")
  
  // Image handling states
  const [pendingImages, setPendingImages] = useState([])  // Local image objects before upload
  const [mediaUrls, setMediaUrls] = useState([])         // Final uploaded image URLs
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  //==========================================================================
  // EDITOR CONFIGURATION
  //==========================================================================
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        autolink: true,
        openOnClick: true,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Bold,
      Italic,
      Underline,
      CodeBlock,
    ],
    content: "<p>Type Here...</p>",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML())
    }
  })

  // Sync editor content with state
  useEffect(() => {
    if(editor) {
      editor.on('update', handleChange)
    }
  }, [editor])

  const handleChange = () => {
    if(editor) {
      setEditorContent(editor.getHTML())
    }
  }

  //==========================================================================
  // UTILITY FUNCTIONS
  //==========================================================================
  // Convert title to URL-friendly slug
  const slugify = (str) => str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')

  //==========================================================================
  // IMAGE HANDLING
  //==========================================================================
  // Handle image selection and preview before upload
  const addImagePreview = useCallback((e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    
    // Create a local object URL for preview
    const localImageUrl = URL.createObjectURL(selectedFile)
    
    // Generate unique ID to identify this image later
    const imageId = `img-${Date.now()}`
    
    // Add to pendingImages array with metadata
    setPendingImages(prev => [...prev, {
      id: imageId,
      file: selectedFile,
      previewUrl: localImageUrl
    }])
    
    // Insert image into editor with the local URL
    if(editor) {
      editor.chain().focus().setImage({ 
        src: localImageUrl,
        // Store image ID as data attribute for identification later
        'data-local-id': imageId
      }).run()
    }
  }, [editor])

  // Upload all pending images to Firebase Storage
  const uploadPendingImages = async () => {
    const uploadedUrls = []
    
    for (const img of pendingImages) {
      try {
        const fileFormat = Date.now() + img.file.name + "_"
        const folderName = "write_blog/"
        
        const fileUrl = await firebase.uploadFileAsync(folderName, img.file, fileFormat, 2)
        uploadedUrls.push({
          id: img.id,
          url: fileUrl
        })
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
    
    return uploadedUrls
  }

  //==========================================================================
  // FORM SUBMISSION
  //==========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert("Please enter a title for your blog post")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 1. First upload all pending images to Firebase
      const uploadedImages = await uploadPendingImages()
      
      // 2. Get the first image URL for the blog thumbnail
      const thumbnailUrl = uploadedImages.length > 0 ? uploadedImages[0].url : null
      
      // 3. Replace local image URLs in the editor content with Firebase URLs
      let finalContent = editorContent
      uploadedImages.forEach(img => {
        finalContent = finalContent.replace(
          new RegExp(`data-local-id="${img.id}"[^>]*src="[^"]*"`, 'g'),
          `data-local-id="${img.id}" src="${img.url}"`
        )
      })
      
      // 4. Submit post data to backend API
      const response = await fetch("http://localhost:8000/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc,
          content: finalContent,
          img: thumbnailUrl, // Backend expects a single URL string
          slug: slug,
          created_at: new Date()
        }),
      });

      if (response.status === 200 || response.status === 201) {
        alert("Post published successfully!")
        setTimeout(() => {
          navigate("/");
        }, 1000)
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert(`Failed to publish post: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting post:", error)
      alert("Failed to publish post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Wait for editor to initialize
  if (!editor) {
    return null
  }

  //==========================================================================
  // COMPONENT RENDER
  //==========================================================================
  return (
    // Main container with Miku-themed gradient background
    <div className='flex flex-col items-center min-h-screen py-12 px-4 bg-gradient-to-b from-teal-50 to-cyan-50'>
      {/* Editor container with responsive width */}
      <div className='flex flex-col w-full max-w-[1000px] bg-white shadow-xl rounded-md p-3 sm:p-4 md:p-6 border-t-4 border-[#39C5BB]'>
        {/* Header */}
        <div className='flex flex-row justify-between items-center mb-4 md:mb-6'>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-[#39C5BB] flex items-center'>
            <span className="mr-1 sm:mr-2">♪</span> Write with Miku <span className="ml-1 sm:ml-2">♪</span>
          </h1>
        </div>

        {/* Blog post form */}
        <form className='flex flex-col' onSubmit={handleSubmit}>
          {/* Title input */}
          <input
            placeholder='Title'
            value={title}
            onChange={(e) =>
              {
                setTitle(e.target.value)
                setSlug(slugify(e.target.value))
              } 
            }
            className='py-[10px] sm:py-[15px] h-[60px] sm:h-[80px] text-2xl sm:text-3xl md:text-4xl border-none outline-none bg-transparent placeholder:text-[#b3b3bb] focus:text-[#39C5BB] transition-colors'
            type='text'
          />
          
          {/* Description input */}
          <input
            placeholder='desc'
            value={desc}
            onChange={(e) => 
                {
                  setDesc(e.target.value)
                }
            }
            className='py-[10px] sm:py-[15px] h-[50px] sm:h-[70px] text-lg sm:text-xl border-none outline-none bg-transparent placeholder:text-[#b3b3bb] focus:text-[#39C5BB] transition-colors'
            type='text'
          />

          {/* Formatting toolbar - now with better wrapping for mobile */}
          <div className='flex flex-wrap gap-1 sm:gap-2 p-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg mb-4 shadow-sm'>
            {/* Text formatting buttons */}
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded-md transition-all ${editor.isActive('bold') ? 'bg-[#39C5BB] text-white' : 'bg-white text-[#39C5BB] hover:bg-teal-50'}`}
            >
              Bold
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded-md transition-all ${editor.isActive('italic') ? 'bg-[#39C5BB] text-white' : 'bg-white text-[#39C5BB] hover:bg-teal-50'}`}
            >
              Italic
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded-md transition-all ${editor.isActive('strike') ? 'bg-[#39C5BB] text-white' : 'bg-white text-[#39C5BB] hover:bg-teal-50'}`}
            >
              Strike
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded-md transition-all ${editor.isActive('code') ? 'bg-[#39C5BB] text-white' : 'bg-white text-[#39C5BB] hover:bg-teal-50'}`}
            >
              Code
            </button>
            
            {/* Heading buttons */}
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded-md transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-[#39C5BB] text-white' : 'bg-white text-[#39C5BB] hover:bg-teal-50'}`}
            >
              H1
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded-md transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-[#39C5BB] text-white' : 'bg-white text-[#39C5BB] hover:bg-teal-50'}`}
            >
              H2
            </button>

            {/* Image upload button and hidden input */}
            <div>
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  fileInputRef.current.click()
                }}
                className='px-2 sm:px-3 py-1 text-sm sm:text-base bg-gradient-to-r from-[#39C5BB] to-[#4FD6CC] text-white rounded-md hover:shadow-md transition-all'
              >
                Add Image
              </button>
              <input
                type='file'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={addImagePreview}
                accept="image/*"
              />
            </div>
          </div>

          {/* Rich text editor area - responsive height */}
          <div className="border border-teal-100 rounded-lg p-2 sm:p-4 min-h-[350px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[650px] shadow-inner bg-white">
            <EditorContent 
              editor={editor} 
              className="min-h-[330px] sm:min-h-[430px] md:min-h-[530px] lg:min-h-[630px] tiptap" 
            />
          </div>
          
          {/* Image upload status indicator */}
          {pendingImages.length > 0 && (
            <div className='mt-3 px-3 sm:px-4 py-2 bg-teal-50 rounded text-xs sm:text-sm text-teal-700'>
              {pendingImages.length} {pendingImages.length === 1 ? 'image' : 'images'} will be uploaded when you publish
            </div>
          )}
          
          {/* Submit button */}
          <div className='text-right mt-4 sm:mt-6'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-[#39C5BB] to-[#4FD6CC] text-white rounded-lg cursor-pointer hover:shadow-lg transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Publishing...' : '♪ Publish with Miku ♪'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}