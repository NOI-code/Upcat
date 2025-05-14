"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Download, RefreshCw, Upload, X, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Link from "next/link"

// Define an interface for our image objects
interface UploadedImage {
  id: string
  file: File
  url: string
  isProcessing: boolean
}

const MAX_IMAGES = 20

export default function AppPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [activeImageId, setActiveImageId] = useState<string | null>(null)
  const [showScaled, setShowScaled] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isChangingImage, setIsChangingImage] = useState(false)
  const [showSizeError, setShowSizeError] = useState(false)
  const [hasUploadedBefore, setHasUploadedBefore] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [forceUpdate, setForceUpdate] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const changeImageInputRef = useRef<HTMLInputElement>(null)
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null)
  const activeThumbRef = useRef<HTMLButtonElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  // Get the active image
  const activeImage = uploadedImages.find((img) => img.id === activeImageId) || null

  // If we have an active image, scroll to make it visible
  useEffect(() => {
    if (activeImageId && activeThumbRef.current && thumbnailsContainerRef.current) {
      const container = thumbnailsContainerRef.current
      const thumb = activeThumbRef.current

      // Calculate position to center the thumbnail
      const scrollLeft = thumb.offsetLeft - container.clientWidth / 2 + thumb.clientWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: "smooth" })

      // Update the scrollbar thumb position after scrolling
      setTimeout(() => {
        if (thumbRef.current) {
          thumbRef.current.style.transform = `translateX(${getThumbPosition()})`
        }
      }, 300) // Wait for the scroll animation to complete
    }
  }, [uploadedImages, activeImageId])

  const handleButtonClick = () => {
    if (uploadedImages.length >= MAX_IMAGES) {
      toast({
        title: "Límite alcanzado",
        description: `Solo puedes subir hasta ${MAX_IMAGES} imágenes.`,
        variant: "destructive",
        action: <ToastAction altText="Entendido">Entendido</ToastAction>,
      })
      return
    }
    fileInputRef.current?.click()
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (thumbnailsContainerRef.current) {
      e.preventDefault()
      thumbnailsContainerRef.current.scrollBy({
        left: e.deltaY > 0 ? 100 : -100,
        behavior: "smooth",
      })
    }
  }

  // Check image dimensions
  const checkImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)
        resolve(img.width <= 1920 && img.height <= 1080)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  // Updated file change handler to support multiple files
  const handleFileChange = async () => {
    const input = fileInputRef.current
    if (!input || !input.files || input.files.length === 0) return

    // Convert FileList to array
    const files = Array.from(input.files)

    // Check if we've reached the limit
    if (uploadedImages.length + files.length > MAX_IMAGES) {
      const remainingSlots = MAX_IMAGES - uploadedImages.length
      toast({
        title: "Límite excedido",
        description: `Solo puedes subir ${remainingSlots} imágenes más. Se procesarán las primeras ${remainingSlots}.`,
        variant: "destructive",
        action: <ToastAction altText="Entendido">Entendido</ToastAction>,
      })

      // Only process up to the limit
      files.splice(remainingSlots)
    }

    // Process each file
    const validFiles: File[] = []
    const invalidFiles: string[] = []
    const oversizedFiles: string[] = []

    // Check each file
    for (const file of files) {
      // Check if file is jpg, jpeg or png
      if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") {
        // Check dimensions
        const isValidSize = await checkImageDimensions(file)
        if (isValidSize) {
          validFiles.push(file)
        } else {
          oversizedFiles.push(file.name)
        }
      } else {
        invalidFiles.push(file.name)
      }
    }

    if (invalidFiles.length > 0) {
      toast({
        title: "Archivos no válidos",
        description: `Solo se permiten archivos .jpg, .jpeg o .png. ${invalidFiles.length} archivos ignorados.`,
        variant: "destructive",
      })
    }

    if (oversizedFiles.length > 0) {
      setShowErrorMessage(true)
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles)
      setError(null)
      // Start processing the valid files
      processFiles(validFiles)
    }

    // Reset the input so the same files can be selected again
    input.value = ""
  }

  // Handle change image input
  const handleChangeImageInput = async () => {
    const input = changeImageInputRef.current
    if (!input || !input.files || input.files.length === 0 || !activeImageId) {
      setIsChangingImage(false)
      return
    }

    const file = input.files[0]

    // Check if file is jpg, jpeg or png
    if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") {
      // Check dimensions
      const isValidSize = await checkImageDimensions(file)
      if (isValidSize) {
        // Replace the active image
        const newImageUrl = URL.createObjectURL(file)

        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === activeImageId ? { ...img, file: file, url: newImageUrl, isProcessing: true } : img,
          ),
        )

        // Simulate processing
        setTimeout(() => {
          setUploadedImages((prev) =>
            prev.map((img) => (img.id === activeImageId ? { ...img, isProcessing: false } : img)),
          )
          setIsChangingImage(false)
        }, 2000)
      } else {
        setShowSizeError(true)
        setIsChangingImage(false)
      }
    } else {
      toast({
        title: "Archivo no válido",
        description: "Solo se permiten archivos .jpg, .jpeg o .png.",
        variant: "destructive",
      })
      setIsChangingImage(false)
    }

    // Reset the input
    input.value = ""
  }

  const processFiles = (files: File[]) => {
    // If this is the first upload, show the loading screens
    if (uploadedImages.length === 0) {
      // Set uploading state
      setIsUploading(true)
    }

    // Create new image objects for each file
    const newImages: UploadedImage[] = files.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file: file,
      url: URL.createObjectURL(file),
      isProcessing: true,
    }))

    // Add the new images to our array
    setUploadedImages((prev) => [...prev, ...newImages])

    // Set the first new image as active if we don't have an active image
    if (!activeImageId) {
      setActiveImageId(newImages[0].id)
    }

    // If this is the first upload, show the loading screens
    if (uploadedImages.length === 0) {
      // Simulate upload delay (2 seconds)
      setTimeout(() => {
        setIsUploading(false)

        // Show the processing state
        setIsProcessing(true)

        // Simulate processing delay (2 seconds)
        setTimeout(() => {
          setIsProcessing(false)
          setHasUploadedBefore(true)

          // Update all the new images to mark them as processed
          setUploadedImages((prev) =>
            prev.map((img) =>
              newImages.some((newImg) => newImg.id === img.id) ? { ...img, isProcessing: false } : img,
            ),
          )
        }, 2000)
      }, 2000)
    } else {
      // For subsequent uploads, just process the images without showing loading screens
      setTimeout(() => {
        // Update all the new images to mark them as processed
        setUploadedImages((prev) =>
          prev.map((img) => (newImages.some((newImg) => newImg.id === img.id) ? { ...img, isProcessing: false } : img)),
        )
      }, 2000)
    }
  }

  const handleDownload = () => {
    if (!activeImage) return

    setIsDownloading(true)

    // Simulate download delay
    setTimeout(() => {
      // Create a temporary link element
      const link = document.createElement("a")
      link.href = activeImage.url
      link.download = activeImage.file.name || "upcat-image.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsDownloading(false)
    }, 2000)
  }

  const handleAddNew = () => {
    // Check if we've reached the limit
    if (uploadedImages.length >= MAX_IMAGES) {
      toast({
        title: "Límite alcanzado",
        description: `Solo puedes subir hasta ${MAX_IMAGES} imágenes.`,
        variant: "destructive",
        action: <ToastAction altText="Entendido">Entendido</ToastAction>,
      })
      return
    }

    // Just trigger the file input
    fileInputRef.current?.click()
  }

  const handleChangeImage = () => {
    setIsChangingImage(true)

    // Trigger the change image input
    changeImageInputRef.current?.click()
  }

  const handleSelectImage = (imageId: string) => {
    setActiveImageId(imageId)
  }

  const handleErrorModalClose = () => {
    setShowSizeError(false)
  }

  const handleChangeFileFromModal = () => {
    setShowSizeError(false)
    // Trigger file input based on context
    if (isChangingImage) {
      setTimeout(() => {
        changeImageInputRef.current?.click()
      }, 100)
    } else {
      setTimeout(() => {
        fileInputRef.current?.click()
      }, 100)
    }
  }

  // Calculate scrollbar thumb width and position
  const getThumbWidth = () => {
    if (!thumbnailsContainerRef.current || !scrollbarRef.current) return "20%"
    const container = thumbnailsContainerRef.current
    const scrollbar = scrollbarRef.current
    const ratio = container.clientWidth / container.scrollWidth
    return `${Math.max(10, ratio * 100)}%`
  }

  const getThumbPosition = () => {
    if (!thumbnailsContainerRef.current || !scrollbarRef.current) return "0px"
    const container = thumbnailsContainerRef.current
    const scrollbar = scrollbarRef.current
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    if (maxScrollLeft <= 0) return "0px"
    const scrollRatio = container.scrollLeft / maxScrollLeft
    const thumbWidth = Number.parseFloat(getThumbWidth()) / 100
    const maxOffset = scrollbar.clientWidth * (1 - thumbWidth)
    return `${scrollRatio * maxOffset}px`
  }

  // Scrollbar mouse down handler
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!thumbnailsContainerRef.current || !scrollbarRef.current) return

    // If clicked on the thumb, start dragging
    if (e.target === thumbRef.current) {
      setIsDragging(true)
      setStartX(e.clientX)
      setScrollLeft(thumbnailsContainerRef.current.scrollLeft)
    } else {
      // If clicked on the track, jump to that position
      const container = thumbnailsContainerRef.current
      const scrollbar = scrollbarRef.current
      const rect = scrollbar.getBoundingClientRect()
      const clickPosition = (e.clientX - rect.left) / rect.width
      const scrollPosition = clickPosition * (container.scrollWidth - container.clientWidth)

      // Update the thumb position immediately for visual feedback
      if (thumbRef.current) {
        const thumbWidth = Number.parseFloat(getThumbWidth()) / 100
        const maxOffset = scrollbar.clientWidth * (1 - thumbWidth)
        const newPosition = clickPosition * maxOffset
        thumbRef.current.style.transform = `translateX(${newPosition}px)`
      }

      // Scroll the container
      container.scrollTo({ left: scrollPosition, behavior: "smooth" })
    }
  }

  // Mouse move handler for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !thumbnailsContainerRef.current || !scrollbarRef.current) return

    e.preventDefault()
    const container = thumbnailsContainerRef.current
    const scrollbar = scrollbarRef.current

    // Calculate how far the mouse has moved
    const dx = e.clientX - startX

    // Calculate the ratio between scrollbar width and content width
    const scrollRatio = container.scrollWidth / scrollbar.clientWidth

    // Calculate the new scroll position
    const newScrollLeft = scrollLeft + dx * scrollRatio

    // Update the scroll position
    container.scrollLeft = newScrollLeft

    // Force update to ensure smooth visual feedback
    requestAnimationFrame(() => {
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateX(${getThumbPosition()})`
      }
    })
  }

  // Mouse up handler to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startX, scrollLeft])

  // Add this useEffect to update the scrollbar thumb position on initial render and when the content changes
  useEffect(() => {
    // Update the thumb position when the component mounts or when uploadedImages changes
    if (thumbRef.current && thumbnailsContainerRef.current) {
      thumbRef.current.style.transform = `translateX(${getThumbPosition()})`
    }
  }, [uploadedImages, activeImageId])

  // Modify the existing scroll event listener to update the thumb position in real-time
  useEffect(() => {
    const handleScroll = () => {
      // Update the thumb position when the container scrolls
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateX(${getThumbPosition()})`
      }
    }

    const container = thumbnailsContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Update scrollbar position when container scrolls
  useEffect(() => {
    const handleScroll = () => {
      // Force a re-render to update the scrollbar position
      setUploadedImages((prev) => [...prev])
    }

    const container = thumbnailsContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Scroll left/right with buttons
  const scrollLeft10Percent = () => {
    if (!thumbnailsContainerRef.current) return
    const container = thumbnailsContainerRef.current
    const scrollAmount = container.clientWidth * 0.3
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
  }

  const scrollRight10Percent = () => {
    if (!thumbnailsContainerRef.current) return
    const container = thumbnailsContainerRef.current
    const scrollAmount = container.clientWidth * 0.3
    container.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  // Add this useEffect to ensure the scrollbar thumb is positioned correctly on initial render
  useEffect(() => {
    const initializeScrollbarThumb = () => {
      if (thumbRef.current && thumbnailsContainerRef.current && scrollbarRef.current) {
        // Force the thumb to the correct initial position
        const position = getThumbPosition()
        thumbRef.current.style.transform = `translateX(${position})`
      }
    }

    // Run immediately
    initializeScrollbarThumb()

    // Also run after a short delay to ensure DOM is fully rendered
    const timer1 = setTimeout(initializeScrollbarThumb, 50)
    const timer2 = setTimeout(initializeScrollbarThumb, 200)
    const timer3 = setTimeout(initializeScrollbarThumb, 500)

    // Use ResizeObserver to detect when container dimensions change
    if (thumbnailsContainerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        initializeScrollbarThumb()
        setForceUpdate((prev) => prev + 1)
      })

      resizeObserver.observe(thumbnailsContainerRef.current)
      return () => {
        resizeObserver.disconnect()
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [uploadedImages.length]) // Run when images are added/removed

  // If we're in the initial upload state with no images
  if (uploadedImages.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0c1445] text-white">
        <header className="w-full py-6 border-b border-white/10 flex items-center justify-center">
          <Link href="/" className="text-2xl font-medium text-center">
            Upcat
          </Link>
        </header>

        <main className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center w-full max-w-xl space-y-6">
            <h2 className="text-3xl font-bold text-center">
              Sube una imágen
              <br />
              para escalar
            </h2>

            <div
              className={`w-full max-w-lg p-12 rounded-3xl flex flex-col items-center justify-center space-y-8 relative ${
                showErrorMessage ? "bg-[#ffcfcb]" : "bg-[#1e2b6b]"
              }`}
              style={{
                position: "relative",
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='${showErrorMessage ? "%23ffcfcb" : "%231e2b6b"}' rx='24' ry='24'/%3e%3crect width='calc(100%25 - 4px)' height='calc(100%25 - 4px)' stroke='${showErrorMessage ? "%231e2b6b" : "rgba(255, 255, 255, 0.5)"}' strokeWidth='8' strokeDasharray='30, 30' strokeDashoffset='0' strokeLinecap='round' fill='none' x='2' y='2' rx='22' ry='22'/%3e%3c/svg%3e")`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
              }}
            >
              <Button
                onClick={handleButtonClick}
                className={`${
                  showErrorMessage
                    ? "bg-[#1e2b6b] text-white hover:bg-[#1e2b6b]/90"
                    : "bg-[#dbff26] text-black hover:bg-[#dbff26]/90"
                } font-medium px-8 py-2 rounded-full`}
              >
                Escoger archivo
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                multiple
              />

              <p className={`text-sm text-center ${showErrorMessage ? "text-[#1e2b6b]" : "text-[#dbff26]"}`}>
                Solo imágenes menores a 1920x1080
                <br />
                píxeles. (.jpg, .jpeg)
              </p>
            </div>

            {showErrorMessage && (
              <p className="text-center text-sm max-w-lg text-[#ffcfcb]">
                La imágen que escogiste tiene una resolución mayor a 1920x1080 píxeles. Haz la imágen más pequeña y
                subela de nuevo.
              </p>
            )}
          </div>
        </main>

        {/* Error Modal - Redesigned */}
        {showSizeError && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#0f1758] rounded-3xl max-w-md w-full mx-4 overflow-hidden relative border border-[#dbff26]">
              {/* Close button */}
              <button onClick={handleErrorModalClose} className="absolute top-3 right-3 text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>

              {/* Modal content */}
              <div className="p-6 pt-10 pb-8 flex flex-col items-center">
                <h2 className="text-xl font-bold text-center text-white mb-2">¡Ups! La imágen es muy grande</h2>

                <p className="text-sm text-center text-white/80 mb-6">
                  La imágen que escogiste tiene una resolución mayor a 1920x1080 píxeles. Haz la imágen más pequeña y
                  súbela de nuevo.
                </p>

                <button
                  onClick={handleChangeFileFromModal}
                  className="w-48 bg-[#dbff26] text-black hover:bg-[#dbff26]/90 rounded-full py-2 font-medium text-sm"
                >
                  Cambiar archivo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // If we're uploading the first image
  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c1445] text-white">
        <header className="w-full py-6 border-b border-white/10 flex items-center justify-center">
          <Link href="/" className="text-2xl font-medium text-center">
            Upcat
          </Link>
        </header>

        <main className="flex flex-col items-center justify-center flex-1 w-full">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 relative animate-float">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M50 10C30 10 15 25 15 45C15 65 30 80 50 80C70 80 85 65 85 45C85 25 70 10 50 10Z"
                  fill="white"
                />
                <circle cx="35" cy="40" r="5" fill="#0f1758" />
                <circle cx="65" cy="40" r="5" fill="#0f1758" />
                <path d="M40 55C45 60 55 60 60 55" stroke="#0f1758" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 30C15 25 10 35 15 40" fill="white" stroke="white" strokeWidth="2" />
                <path d="M80 30C85 25 90 35 85 40" fill="white" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Subiendo archivo{selectedFiles.length > 1 ? "s" : ""}...</h2>
          </div>
        </main>
      </div>
    )
  }

  // If we're processing the first image
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c1445] text-white">
        <header className="w-full py-6 border-b border-white/10 flex items-center justify-center">
          <Link href="/" className="text-2xl font-medium text-center">
            Upcat
          </Link>
        </header>

        <main className="flex flex-col items-center justify-center flex-1 w-full">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 relative animate-float">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M50 10C30 10 15 25 15 45C15 65 30 80 50 80C70 80 85 65 85 45C85 25 70 10 50 10Z"
                  fill="white"
                />
                <circle cx="35" cy="40" r="5" fill="#0f1758" />
                <circle cx="65" cy="40" r="5" fill="#0f1758" />
                <path d="M40 55C45 60 55 60 60 55" stroke="#0f1758" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 30C15 25 10 35 15 40" fill="white" stroke="white" strokeWidth="2" />
                <path d="M80 30C85 25 90 35 85 40" fill="white" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Mejorando archivo...</h2>
          </div>
        </main>
      </div>
    )
  }

  // Main view with images
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0c1445] text-white">
      <header className="w-full py-6 border-b border-white/10 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center text-white hover:text-[#dbff26]">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Volver</span>
        </Link>
        <Link href="/" className="text-2xl font-medium text-center">
          Upcat
        </Link>
        <div className="w-24"></div> {/* Spacer for centering */}
      </header>

      <main className="flex flex-col items-center w-full max-w-4xl px-4 py-8">
        {/* Thumbnails row with scrollbar */}
        <div className="w-full mb-2 relative">
          <div className="flex flex-col w-full">
            {/* Navigation buttons */}
            <div className="flex items-center justify-between w-full mb-2">
              <button
                onClick={scrollLeft10Percent}
                className="w-8 h-8 rounded-full bg-[#0f1758] flex items-center justify-center hover:bg-[#0f1758]/80"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Image counter */}
              <div className="text-xs text-[#b6b2ed]">
                {uploadedImages.length}/{MAX_IMAGES} imágenes
              </div>

              <button
                onClick={scrollRight10Percent}
                className="w-8 h-8 rounded-full bg-[#0f1758] flex items-center justify-center hover:bg-[#0f1758]/80"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnails container */}
            <div
              className="flex items-center overflow-x-auto pb-2 max-w-full scrollbar-hide relative"
              ref={thumbnailsContainerRef}
              onWheel={handleWheel}
            >
              {/* Add button - in line with thumbnails */}
              <button
                onClick={handleAddNew}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#dbff26] flex items-center justify-center mr-3"
              >
                <Plus className="w-6 h-6 text-black" />
              </button>

              {uploadedImages.map((image, index) => (
                <button
                  key={image.id}
                  ref={activeImageId === image.id ? activeThumbRef : null}
                  onClick={() => handleSelectImage(image.id)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden ${
                    index === 0 && !image.url
                      ? ""
                      : activeImageId === image.id
                        ? "border-2 border-[#dbff26]"
                        : "border-2 border-white/30"
                  } ${index > 0 ? "ml-1" : ""} relative`}
                >
                  <img src={image.url || "/placeholder.svg"} alt="Thumbnail" className="w-full h-full object-cover" />
                  {image.isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-[#dbff26] border-t-transparent animate-spin"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom scrollbar - new implementation */}
            <div
              ref={scrollbarRef}
              className="w-full h-2 bg-white/20 mt-2 rounded-full relative cursor-pointer"
              onMouseDown={handleMouseDown}
            >
              <div
                ref={thumbRef}
                className={`absolute top-0 h-full bg-gray-400 rounded-full cursor-grab ${isDragging ? "cursor-grabbing" : ""}`}
                style={{
                  width: getThumbWidth(),
                  left: "0px",
                  transform: `translateX(${getThumbPosition()})`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Main image display */}
        {activeImage && (
          <>
            <div className="w-full max-w-3xl rounded-lg overflow-hidden mb-3 mt-1">
              <img
                src={activeImage.url || "/placeholder.svg"}
                alt="Uploaded image"
                className={`w-full h-auto object-contain ${showScaled ? "scale-[2] origin-center" : ""}`}
                style={{ transition: "transform 0.3s ease" }}
              />
            </div>

            <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="flex items-center justify-between bg-[#1a2675] px-6 py-4 rounded-3xl w-full md:w-auto">
                <div className="flex flex-col">
                  <p className="text-base font-medium text-white">Ver imágen escalada</p>
                  <p className="text-sm text-white/80">Las imágenes se escalan a 2x.</p>
                </div>
                <Switch
                  checked={showScaled}
                  onCheckedChange={setShowScaled}
                  className="data-[state=checked]:bg-[#dbff26] ml-4"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleChangeImage}
                  variant="outline"
                  disabled={isChangingImage}
                  className="rounded-full border-[#dbff26] border bg-transparent text-[#dbff26] hover:bg-[#dbff26]/10 hover:text-[#dbff26]"
                >
                  {isChangingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Cambiar imágen
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="rounded-full bg-[#dbff26] text-black hover:bg-[#dbff26]/90"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Descargando
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png"
          className="hidden"
          multiple
        />

        <input
          type="file"
          ref={changeImageInputRef}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png"
          className="hidden"
          multiple
        />

        <input
          type="file"
          ref={changeImageInputRef}
          onChange={handleChangeImageInput}
          accept=".jpg,.jpeg,.png"
          className="hidden"
        />

        {/* Error Modal - Redesigned */}
        {showSizeError && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#0f1758] rounded-3xl max-w-md w-full mx-4 overflow-hidden relative border border-[#dbff26]">
              {/* Close button */}
              <button onClick={handleErrorModalClose} className="absolute top-3 right-3 text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>

              {/* Modal content */}
              <div className="p-6 pt-10 pb-8 flex flex-col items-center">
                <h2 className="text-xl font-bold text-center text-white mb-2">¡Ups! La imágen es muy grande</h2>

                <p className="text-sm text-center text-white/80 mb-6">
                  La imágen que escogiste tiene una resolución mayor a 1920x1080 píxeles. Haz la imágen más pequeña y
                  súbela de nuevo.
                </p>

                <button
                  onClick={handleChangeFileFromModal}
                  className="w-48 bg-[#dbff26] text-black hover:bg-[#dbff26]/90 rounded-full py-2 font-medium text-sm"
                >
                  Cambiar archivo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
