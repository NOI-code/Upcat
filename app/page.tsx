"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Star, ShoppingBag, FileText, Printer, Facebook, Instagram, Linkedin } from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState("ecommerce")

  const handleRedirectToApp = () => {
    window.location.href = "/app"
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top section with light background */}
      <div className="bg-gray-200">
        {/* Header */}
        <header className="w-full py-4 px-6 flex justify-between items-center max-w-6xl mx-auto">
          <Link href="/" className="text-xl font-bold text-[#0f1758]">
            Upcat
          </Link>
          <button
            onClick={handleRedirectToApp}
            className="bg-[#dbff26] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#c7e822]"
          >
            Probar Upcat
          </button>
        </header>

        {/* Placeholder image section */}
        <div className="w-full py-16 px-6 flex justify-center">
          <div className="w-full max-w-md aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dark blue section */}
      <div className="bg-[#0f1758] text-white flex-1">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-12">
          {/* Left side - Main heading with underline specifically under "un solo clic" */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Restaura y mejora tus fotos con IA,
              <span className="relative inline-block">
                <span className="whitespace-nowrap"> en un solo clic</span>
                <span className="absolute bottom-0 left-0 w-[110%] h-1.5 bg-[#dbff26]" style={{ right: "-10%" }}></span>
              </span>
            </h1>
          </div>

          {/* Right side - Features and CTA with glass effect */}
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-[#dbff26]" size={20} />
              <span className="text-[#dbff26] font-medium">Gratuito</span>
            </div>

            <p className="text-gray-300 mb-6 text-sm">
              Upcat afina y mejora tus imágenes con la precisión de un gato. Convierte imágenes de baja calidad en
              imágenes nítidas y detalladas.
            </p>

            {/* Glass effect container */}
            <div className="border border-dashed border-white/30 rounded-lg p-8 flex flex-col items-center bg-white/5 backdrop-blur-sm">
              <h3 className="text-white text-xl font-medium mb-4 text-center">Sube una imágen para escalar</h3>
              <button
                onClick={handleRedirectToApp}
                className="bg-[#dbff26] text-black px-6 py-3 rounded-full font-medium hover:bg-[#c7e822] mb-4"
              >
                Escoger archivo
              </button>

              <p className="text-sm text-center text-[#dbff26]">
                Solo imágenes menores a 1920x1080 <br />
                píxeles. (.jpg, .jpeg y .png)
              </p>
            </div>
          </div>
        </div>

        {/* Alta Calidad Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-bold mb-8">
                Alta calidad,
                <br />
                sin el alto costo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-3">Es gratuito</h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Puedes mejorar tus imágenes sin pagar desde el primer uso sin necesidad de una suscripción.
                  </p>
                  <button
                    onClick={handleRedirectToApp}
                    className="bg-[#dbff26] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#c7e822]"
                  >
                    Probar Upcat
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">+50% en calidad</h3>
                  <p className="text-sm text-gray-300">
                    Te ofrecemos mejor calidad a diferencia de otros escaladores caros de imágenes populares.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative">
              <div className="relative h-80 w-full flex items-center justify-center">
                {/* Stacked image cards - now with only 2 cards and thin black outlines */}
                <div className="absolute w-72 h-72 bg-white rounded-3xl transform rotate-6 shadow-lg border border-black">
                  <div className="w-full h-full flex items-center justify-center">{/* Empty card */}</div>
                </div>
                <div className="absolute w-72 h-72 bg-white rounded-3xl transform -rotate-3 shadow-lg border border-black z-10">
                  <div className="w-full h-full flex items-center justify-center">
                    {/* Placeholder image icon */}
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Possibilities Section - Updated with selection functionality */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-2 text-center">Posibilidades infinitas de negocio</h2>
          <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
            Eleva la calidad de tus fotos y crea contenido profesional de primer nivel para cualquier necesidad
            comercial.
          </p>

          <div className="flex justify-center mb-12">
            <button
              onClick={handleRedirectToApp}
              className="bg-[#dbff26] text-black px-6 py-3 rounded-full font-medium hover:bg-[#c7e822]"
            >
              Probar Upcat
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Ecommerce Card */}
            <button
              onClick={() => setSelectedOption("ecommerce")}
              className={`text-left rounded-lg p-6 transition-colors ${
                selectedOption === "ecommerce" ? "bg-[#dbff26]" : "bg-[#1a2675]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  selectedOption === "ecommerce" ? "bg-[#0f1758]" : "bg-[#dbff26]"
                }`}
              >
                <ShoppingBag
                  size={20}
                  className={selectedOption === "ecommerce" ? "text-[#dbff26]" : "text-[#0f1758]"}
                />
              </div>
              <h3 className={`text-xl font-bold mb-4 ${selectedOption === "ecommerce" ? "text-black" : "text-white"}`}>
                Ecommerce
              </h3>
              <p className={`text-sm ${selectedOption === "ecommerce" ? "text-black" : "text-gray-300"}`}>
                Mejora la calidad de tus imágenes de producto y maximiza el impacto de tu negocio en línea.
              </p>
            </button>

            {/* Revistas Card */}
            <button
              onClick={() => setSelectedOption("revistas")}
              className={`text-left rounded-lg p-6 transition-colors ${
                selectedOption === "revistas" ? "bg-[#dbff26]" : "bg-[#1a2675]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  selectedOption === "revistas" ? "bg-[#0f1758]" : "bg-[#dbff26]"
                }`}
              >
                <FileText size={20} className={selectedOption === "revistas" ? "text-[#dbff26]" : "text-[#0f1758]"} />
              </div>
              <h3 className={`text-xl font-bold mb-4 ${selectedOption === "revistas" ? "text-black" : "text-white"}`}>
                Revistas
              </h3>
              <p className={`text-sm ${selectedOption === "revistas" ? "text-black" : "text-gray-300"}`}>
                Crea fotos nítidas y en alta resolución que harán que tus artículos destaquen y atraigan a más lectores.
              </p>
            </button>

            {/* Servicios de Impresión Card */}
            <button
              onClick={() => setSelectedOption("impresion")}
              className={`text-left rounded-lg p-6 transition-colors ${
                selectedOption === "impresion" ? "bg-[#dbff26]" : "bg-[#1a2675]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  selectedOption === "impresion" ? "bg-[#0f1758]" : "bg-[#dbff26]"
                }`}
              >
                <Printer size={20} className={selectedOption === "impresion" ? "text-[#dbff26]" : "text-[#0f1758]"} />
              </div>
              <h3 className={`text-xl font-bold mb-4 ${selectedOption === "impresion" ? "text-black" : "text-white"}`}>
                Servicios de impresión
              </h3>
              <p className={`text-sm ${selectedOption === "impresion" ? "text-black" : "text-gray-300"}`}>
                Escala y mejora imágenes de baja calidad para obtener impresiones de alta resolución en gran formato.
              </p>
            </button>
          </div>
        </div>

        {/* CTA Section - Updated to match the design */}
        <div className="px-6 py-8 mb-8">
          <div className="max-w-6xl mx-auto bg-gray-600 rounded-3xl py-16 px-6">
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Prueba Upcat ahora</h2>
              <p className="text-gray-200 mb-8">
                Prueba Upcat ahora y mejora la calidad a tus fotos.
                <br />
                Obtén un magnífico resultado garantizado.
              </p>
              <button
                onClick={handleRedirectToApp}
                className="bg-[#dbff26] text-black px-6 py-3 rounded-full font-medium hover:bg-[#c7e822]"
              >
                Probar Upcat
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Updated to match the design */}
        <footer className="w-full py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Link href="/" className="text-xl font-bold">
                Upcat
              </Link>
            </div>

            <div className="flex items-center mb-4 md:mb-0">
              <Link href="#" className="text-sm text-gray-400 hover:text-white mr-4">
                Política de privacidad
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Términos y condiciones
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="#" className="text-white hover:text-[#dbff26]">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-white hover:text-[#dbff26]">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-white hover:text-[#dbff26]">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
