import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Info, 
  X, 
  Plus, 
  Minus,
  Upload,
  Edit,
  Trash2,
  Settings,
  LogOut,
  User,
  Home,
  Film,
  Users,
  Building,
  TrendingUp,
  BookOpen,
  PieChart,
  Lightbulb,
  Award
} from 'lucide-react';
import './App.css';

// Mock data for real estate training content
const realEstateCategories = [
  {
    id: 1,
    name: 'Fundamentos Inmobiliarios',
    icon: Home,
    videos: [
      {
        id: 1,
        title: 'Introducción al Mercado Inmobiliario',
        description: 'Aprende los conceptos básicos del sector inmobiliario y sus oportunidades.',
        thumbnail: 'https://images.unsplash.com/photo-1559458049-9d62fceeb52b',
        duration: '45 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '98%'
      },
      {
        id: 2,
        title: 'Tipos de Propiedades y Clasificaciones',
        description: 'Conoce los diferentes tipos de propiedades y sus características.',
        thumbnail: 'https://images.pexels.com/photos/418285/pexels-photo-418285.jpeg',
        duration: '35 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '95%'
      }
    ]
  },
  {
    id: 2,
    name: 'Marketing y Ventas',
    icon: TrendingUp,
    videos: [
      {
        id: 3,
        title: 'Estrategias de Marketing Digital',
        description: 'Domina las técnicas de marketing digital para bienes raíces.',
        thumbnail: 'https://images.unsplash.com/photo-1515263487990-61b07816b324',
        duration: '55 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '92%'
      },
      {
        id: 4,
        title: 'Técnicas de Venta Efectivas',
        description: 'Aprende las mejores técnicas para cerrar ventas exitosas.',
        thumbnail: 'https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg',
        duration: '40 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '89%'
      }
    ]
  },
  {
    id: 3,
    name: 'Regulaciones y Ética',
    icon: BookOpen,
    videos: [
      {
        id: 5,
        title: 'Marco Legal Inmobiliario',
        description: 'Comprende las leyes y regulaciones del sector inmobiliario.',
        thumbnail: 'https://images.unsplash.com/photo-1618505497364-f97e23c8b70a',
        duration: '50 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '96%'
      }
    ]
  },
  {
    id: 4,
    name: 'Finanzas y Economía',
    icon: PieChart,
    videos: [
      {
        id: 6,
        title: 'Análisis Financiero de Propiedades',
        description: 'Aprende a evaluar la rentabilidad de las inversiones inmobiliarias.',
        thumbnail: 'https://images.unsplash.com/photo-1563271978-de56ca503913',
        duration: '60 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '94%'
      }
    ]
  },
  {
    id: 5,
    name: 'Tecnología Inmobiliaria',
    icon: Lightbulb,
    videos: [
      {
        id: 7,
        title: 'Herramientas Digitales para Agentes',
        description: 'Descubre las últimas tecnologías para mejorar tu productividad.',
        thumbnail: 'https://images.pexels.com/photos/4090093/pexels-photo-4090093.jpeg',
        duration: '45 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '91%'
      }
    ]
  },
  {
    id: 6,
    name: 'Negociación y Cierre',
    icon: Award,
    videos: [
      {
        id: 8,
        title: 'Estrategias de Negociación',
        description: 'Domina el arte de la negociación inmobiliaria.',
        thumbnail: 'https://images.unsplash.com/photo-1584785933913-feb6e407f2a2',
        duration: '50 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '97%'
      }
    ]
  },
  {
    id: 7,
    name: 'Desarrollo Personal',
    icon: Users,
    videos: [
      {
        id: 9,
        title: 'Liderazgo en Bienes Raíces',
        description: 'Desarrolla tus habilidades de liderazgo y comunicación.',
        thumbnail: 'https://images.pexels.com/photos/159746/notebook-pen-pencil-education-159746.jpeg',
        duration: '42 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '88%'
      }
    ]
  },
  {
    id: 8,
    name: 'Evaluación de Propiedades',
    icon: Building,
    videos: [
      {
        id: 10,
        title: 'Métodos de Valuación',
        description: 'Aprende los diferentes métodos para valuar propiedades.',
        thumbnail: 'https://images.pexels.com/photos/7663144/pexels-photo-7663144.jpeg',
        duration: '38 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '93%'
      }
    ]
  },
  {
    id: 9,
    name: 'Atención al Cliente',
    icon: Film,
    videos: [
      {
        id: 11,
        title: 'Gestión de Relaciones con Clientes',
        description: 'Mejora tus habilidades de atención y servicio al cliente.',
        thumbnail: 'https://images.unsplash.com/photo-1709015207441-4c148b5c5928',
        duration: '48 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '90%'
      }
    ]
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [infoModalVideo, setInfoModalVideo] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState(realEstateCategories);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [customization, setCustomization] = useState({
    logo: null,
    heroBanner: 'https://images.unsplash.com/photo-1524292691042-82ed9c62673b',
    loginBackground: 'https://images.unsplash.com/photo-1559458049-9d62fceeb52b',
    companyName: 'REALTY ONE GROUP MÉXICO'
  });

  // Load saved customization from localStorage
  useEffect(() => {
    const savedCustomization = localStorage.getItem('netflixRealEstateCustomization');
    if (savedCustomization) {
      setCustomization(JSON.parse(savedCustomization));
    }
  }, []);

  // Save customization to localStorage
  const saveCustomization = (newCustomization) => {
    setCustomization(newCustomization);
    localStorage.setItem('netflixRealEstateCustomization', JSON.stringify(newCustomization));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'unbrokerage@realtyonegroupmexico.mx') {
      if (password === 'OneVision$07') {
        setUserRole('admin');
        setIsAuthenticated(true);
      } else if (password === 'AgenteONE13') {
        setUserRole('user');
        setIsAuthenticated(true);
      } else {
        alert('Contraseña incorrecta');
      }
    } else {
      alert('Email no reconocido');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setEmail('');
    setPassword('');
    setShowUserMenu(false);
    setShowAdminPanel(false);
  };

  const playVideo = (video) => {
    setSelectedVideo(video);
  };

  const showMoreInfo = (video) => {
    setInfoModalVideo(video);
  };

  const closeModals = () => {
    setSelectedVideo(null);
    setInfoModalVideo(null);
  };

  // Login Component
  const LoginComponent = () => (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${customization.loginBackground})`
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black bg-opacity-80 p-8 rounded-lg w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C5A95E] mb-2">
            {customization.companyName}
          </h1>
          <p className="text-gray-300">Plataforma de Capacitación Inmobiliaria</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-[#C5A95E] focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-[#C5A95E] focus:outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#C5A95E] text-black font-semibold py-3 rounded-md hover:bg-[#B8A055] transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </motion.div>
    </div>
  );

  // Video Card Component
  const VideoCard = ({ video, category }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <motion.div
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1559458049-9d62fceeb52b';
            }}
          />
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 bg-gray-900 p-4 rounded-b-lg z-20 border-t-2 border-[#C5A95E]"
            >
              <h3 className="text-white font-semibold text-sm mb-2">{video.title}</h3>
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={() => playVideo(video)}
                  className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-200 flex items-center space-x-1"
                >
                  <Play size={14} />
                  <span>Reproducir</span>
                </button>
                <button
                  onClick={() => showMoreInfo(video)}
                  className="bg-gray-700 text-white p-1 rounded-full hover:bg-gray-600"
                >
                  <Info size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="text-[#C5A95E] font-semibold">{video.match} Coincidencia</span>
                <span>{video.duration}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Video Player Modal
  const VideoPlayerModal = () => (
    <AnimatePresence>
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModals}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModals}
              className="absolute -top-10 right-0 text-white hover:text-[#C5A95E] z-10"
            >
              <X size={32} />
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="bg-gray-900 p-6 rounded-b-lg">
              <h2 className="text-white text-2xl font-bold mb-2">{selectedVideo.title}</h2>
              <p className="text-gray-300">{selectedVideo.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Info Modal
  const InfoModal = () => (
    <AnimatePresence>
      {infoModalVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModals}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModals}
              className="absolute -top-10 right-0 text-white hover:text-[#C5A95E] z-10"
            >
              <X size={32} />
            </button>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-800">
                <img
                  src={infoModalVideo.thumbnail}
                  alt={infoModalVideo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-white text-2xl font-bold mb-2">{infoModalVideo.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <span className="text-[#C5A95E] font-semibold">{infoModalVideo.match} Coincidencia</span>
                      <span>{infoModalVideo.duration}</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">HD</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playVideo(infoModalVideo);
                      setInfoModalVideo(null);
                    }}
                    className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 flex items-center space-x-2"
                  >
                    <Play size={16} />
                    <span>Reproducir</span>
                  </button>
                </div>
                <p className="text-gray-300 mb-4">{infoModalVideo.description}</p>
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-white font-semibold mb-2">Categoría: Capacitación Inmobiliaria</h3>
                  <p className="text-gray-400 text-sm">
                    Contenido educativo diseñado para profesionales del sector inmobiliario.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Admin Panel Component
  const AdminPanel = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-96 bg-gray-900 shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Panel de Administración</h2>
          <button
            onClick={() => setShowAdminPanel(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-[#C5A95E] font-semibold mb-3">Personalización de Marca</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-white text-sm mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={customization.companyName}
                  onChange={(e) => saveCustomization({...customization, companyName: e.target.value})}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-[#C5A95E] focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-1">URL de Fondo de Login</label>
                <input
                  type="url"
                  value={customization.loginBackground}
                  onChange={(e) => saveCustomization({...customization, loginBackground: e.target.value})}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-[#C5A95E] focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-1">URL de Banner Principal</label>
                <input
                  type="url"
                  value={customization.heroBanner}
                  onChange={(e) => saveCustomization({...customization, heroBanner: e.target.value})}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-[#C5A95E] focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#C5A95E] font-semibold mb-3">Gestión de Categorías</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                  <span className="text-white text-sm">{category.name}</span>
                  <div className="flex space-x-1">
                    <button className="text-gray-400 hover:text-white">
                      <Edit size={14} />
                    </button>
                    <button className="text-gray-400 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#C5A95E] font-semibold mb-3">Gestión de Contenido</h3>
            <button className="w-full bg-[#C5A95E] text-black py-2 rounded font-semibold hover:bg-[#B8A055] flex items-center justify-center space-x-2">
              <Upload size={16} />
              <span>Subir Nuevo Video</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Main Dashboard Component
  const Dashboard = () => (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="relative z-40 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-[#C5A95E] text-2xl font-bold">
              {customization.companyName}
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-white hover:text-[#C5A95E] transition">Inicio</a>
              <a href="#" className="text-white hover:text-[#C5A95E] transition">Cursos</a>
              <a href="#" className="text-white hover:text-[#C5A95E] transition">Mi Progreso</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {userRole === 'admin' && (
              <button
                onClick={() => setShowAdminPanel(true)}
                className="text-white hover:text-[#C5A95E] transition"
              >
                <Settings size={24} />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-white hover:text-[#C5A95E] transition"
              >
                <User size={24} />
              </button>
              
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700"
                >
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-white text-sm font-semibold">
                      {userRole === 'admin' ? 'Administrador' : 'Usuario'}
                    </p>
                    <p className="text-gray-400 text-xs">{email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-white hover:bg-gray-800 transition"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${customization.heroBanner})`
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h2 className="text-white text-5xl font-bold mb-4">
              Capacitación Inmobiliaria Profesional
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Domina el mercado inmobiliario con nuestros cursos especializados. 
              Aprende técnicas avanzadas, estrategias de venta y tendencias del sector.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 flex items-center space-x-2">
                <Play size={20} />
                <span>Comenzar Ahora</span>
              </button>
              <button className="bg-gray-600 bg-opacity-50 text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-70 flex items-center space-x-2">
                <Info size={20} />
                <span>Más Información</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {categories.map((category) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: category.id * 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <category.icon className="text-[#C5A95E]" size={28} />
              <h3 className="text-white text-2xl font-bold">{category.name}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {category.videos.map((video) => (
                <VideoCard key={video.id} video={video} category={category} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal />
      
      {/* Info Modal */}
      <InfoModal />

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdminPanel && <AdminPanel />}
      </AnimatePresence>
    </div>
  );

  if (!isAuthenticated) {
    return <LoginComponent />;
  }

  return <Dashboard />;
}

export default App;