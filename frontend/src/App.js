import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, stagger, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSwipeable } from 'react-swipeable';
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
  Award,
  Search,
  Filter,
  SortAsc,
  Sun,
  Moon,
  Menu,
  Star,
  Clock,
  TrendingDown
} from 'lucide-react';
import './App.css';

// Mock data for real estate training content with enhanced metadata
const realEstateCategories = [
  {
    id: 1,
    name: 'Fundamentos Inmobiliarios',
    icon: Home,
    videos: [
      {
        id: 1,
        title: 'Introducción al Mercado Inmobiliario',
        description: 'Aprende los conceptos básicos del sector inmobiliario y sus oportunidades de crecimiento profesional.',
        thumbnail: 'https://images.unsplash.com/photo-1559458049-9d62fceeb52b',
        duration: '45 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '98%',
        difficulty: 'Principiante',
        rating: 4.8,
        views: 1250,
        releaseDate: '2024-01-15'
      },
      {
        id: 2,
        title: 'Tipos de Propiedades y Clasificaciones',
        description: 'Conoce los diferentes tipos de propiedades y sus características específicas en el mercado.',
        thumbnail: 'https://images.pexels.com/photos/418285/pexels-photo-418285.jpeg',
        duration: '35 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '95%',
        difficulty: 'Principiante',
        rating: 4.6,
        views: 980,
        releaseDate: '2024-01-20'
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
        description: 'Domina las técnicas de marketing digital más efectivas para el sector inmobiliario moderno.',
        thumbnail: 'https://images.unsplash.com/photo-1515263487990-61b07816b324',
        duration: '55 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '92%',
        difficulty: 'Intermedio',
        rating: 4.7,
        views: 1420,
        releaseDate: '2024-02-01'
      },
      {
        id: 4,
        title: 'Técnicas de Venta Efectivas',
        description: 'Aprende las mejores técnicas psicológicas y estratégicas para cerrar ventas exitosas.',
        thumbnail: 'https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg',
        duration: '40 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '89%',
        difficulty: 'Intermedio',
        rating: 4.5,
        views: 890,
        releaseDate: '2024-02-05'
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
        description: 'Comprende las leyes y regulaciones fundamentales que rigen el sector inmobiliario.',
        thumbnail: 'https://images.unsplash.com/photo-1618505497364-f97e23c8b70a',
        duration: '50 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '96%',
        difficulty: 'Avanzado',
        rating: 4.9,
        views: 750,
        releaseDate: '2024-02-10'
      }
    ]
  },
  // ... (continuing with the same pattern for other categories)
  {
    id: 4,
    name: 'Finanzas y Economía',
    icon: PieChart,
    videos: [
      {
        id: 6,
        title: 'Análisis Financiero de Propiedades',
        description: 'Aprende a evaluar la rentabilidad y el potencial de inversión en propiedades immobiliarias.',
        thumbnail: 'https://images.unsplash.com/photo-1563271978-de56ca503913',
        duration: '60 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '94%',
        difficulty: 'Avanzado',
        rating: 4.8,
        views: 1100,
        releaseDate: '2024-02-15'
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
        description: 'Descubre las últimas tecnologías y herramientas digitales para mejorar tu productividad.',
        thumbnail: 'https://images.pexels.com/photos/4090093/pexels-photo-4090093.jpeg',
        duration: '45 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '91%',
        difficulty: 'Intermedio',
        rating: 4.4,
        views: 670,
        releaseDate: '2024-02-20'
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
        description: 'Domina el arte de la negociación inmobiliaria con técnicas probadas y efectivas.',
        thumbnail: 'https://images.unsplash.com/photo-1584785933913-feb6e407f2a2',
        duration: '50 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '97%',
        difficulty: 'Avanzado',
        rating: 4.9,
        views: 1350,
        releaseDate: '2024-02-25'
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
        description: 'Desarrolla tus habilidades de liderazgo y comunicación para destacar en el sector.',
        thumbnail: 'https://images.pexels.com/photos/159746/notebook-pen-pencil-education-159746.jpeg',
        duration: '42 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '88%',
        difficulty: 'Intermedio',
        rating: 4.3,
        views: 540,
        releaseDate: '2024-03-01'
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
        description: 'Aprende los diferentes métodos profesionales para valuar propiedades con precisión.',
        thumbnail: 'https://images.pexels.com/photos/7663144/pexels-photo-7663144.jpeg',
        duration: '38 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '93%',
        difficulty: 'Avanzado',
        rating: 4.7,
        views: 820,
        releaseDate: '2024-03-05'
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
        description: 'Mejora tus habilidades de atención y servicio al cliente para fidelizar y crecer tu negocio.',
        thumbnail: 'https://images.unsplash.com/photo-1709015207441-4c148b5c5928',
        duration: '48 min',
        youtubeId: 'dQw4w9WgXcQ',
        match: '90%',
        difficulty: 'Intermedio',
        rating: 4.5,
        views: 690,
        releaseDate: '2024-03-10'
      }
    ]
  }
];

// Theme configurations
const themes = {
  dark: {
    primary: '#000000',
    secondary: '#1a1a1a',
    accent: '#C5A95E',
    text: '#ffffff',
    textSecondary: '#d1d5db',
    border: '#374151'
  },
  light: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    accent: '#C5A95E',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb'
  }
};

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
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customization, setCustomization] = useState({
    logo: null,
    heroBanner: 'https://images.unsplash.com/photo-1524292691042-82ed9c62673b',
    loginBackground: 'https://images.unsplash.com/photo-1559458049-9d62fceeb52b',
    companyName: 'REALTY ONE GROUP MÉXICO'
  });

  // Animation controls
  const controls = useAnimation();

  // Load saved settings from localStorage
  useEffect(() => {
    const savedCustomization = localStorage.getItem('netflixRealEstateCustomization');
    const savedTheme = localStorage.getItem('netflixRealEstateTheme');
    
    if (savedCustomization) {
      setCustomization(JSON.parse(savedCustomization));
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // Save settings to localStorage
  const saveCustomization = (newCustomization) => {
    setCustomization(newCustomization);
    localStorage.setItem('netflixRealEstateCustomization', JSON.stringify(newCustomization));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('netflixRealEstateTheme', newTheme);
  };

  // Get all videos for search and filtering
  const getAllVideos = () => {
    return categories.flatMap(category => 
      category.videos.map(video => ({
        ...video,
        categoryName: category.name,
        categoryId: category.id
      }))
    );
  };

  // Filter and sort videos
  const getFilteredVideos = () => {
    let videos = getAllVideos();

    // Apply search filter
    if (searchQuery) {
      videos = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      videos = videos.filter(video => video.categoryId === parseInt(filterCategory));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        videos.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'oldest':
        videos.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        break;
      case 'rating':
        videos.sort((a, b) => b.rating - a.rating);
        break;
      case 'views':
        videos.sort((a, b) => b.views - a.views);
        break;
      case 'duration':
        videos.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      default:
        break;
    }

    return videos;
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

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );

  // Enhanced Video Card with animations
  const VideoCard = ({ video, category, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { ref, inView } = useInView({
      threshold: 0.1,
      triggerOnce: true
    });
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05, zIndex: 20 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-300 dark:bg-gray-800 shadow-lg">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1559458049-9d62fceeb52b';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 p-4 rounded-b-lg z-30 border-t-2 border-[#C5A95E] shadow-xl"
            >
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-2">{video.title}</h3>
              
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={() => playVideo(video)}
                  className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-200 flex items-center space-x-1 transition-all duration-200 hover:scale-105"
                >
                  <Play size={14} />
                  <span>Reproducir</span>
                </button>
                <button
                  onClick={() => showMoreInfo(video)}
                  className="bg-gray-700 text-white p-1 rounded-full hover:bg-gray-600 transition-all duration-200 hover:scale-110"
                >
                  <Info size={14} />
                </button>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span className="text-[#C5A95E] font-semibold">{video.match} Coincidencia</span>
                <span>{video.duration}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-500" />
                  <span>{video.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={12} />
                  <span>{video.views}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  video.difficulty === 'Principiante' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  video.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {video.difficulty}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Enhanced Search and Filter Component
  const SearchAndFilter = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar cursos, categorías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border-none focus:ring-2 focus:ring-[#C5A95E] focus:outline-none"
          />
        </div>
        
        {/* Filter by Category */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border-none focus:ring-2 focus:ring-[#C5A95E] focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        {/* Sort */}
        <div className="relative">
          <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border-none focus:ring-2 focus:ring-[#C5A95E] focus:outline-none appearance-none cursor-pointer"
          >
            <option value="newest">Más Recientes</option>
            <option value="oldest">Más Antiguos</option>
            <option value="rating">Mejor Calificados</option>
            <option value="views">Más Vistos</option>
            <option value="duration">Por Duración</option>
          </select>
        </div>
      </div>
      
      {/* Results count */}
      {(searchQuery || filterCategory !== 'all') && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {getFilteredVideos().length} resultado(s) encontrado(s)
        </div>
      )}
    </motion.div>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40"
    >
      <div className="flex justify-around py-2">
        <button className="flex flex-col items-center py-2 px-4 text-[#C5A95E]">
          <Home size={20} />
          <span className="text-xs mt-1">Inicio</span>
        </button>
        <button className="flex flex-col items-center py-2 px-4 text-gray-600 dark:text-gray-400">
          <Search size={20} />
          <span className="text-xs mt-1">Buscar</span>
        </button>
        <button className="flex flex-col items-center py-2 px-4 text-gray-600 dark:text-gray-400">
          <Film size={20} />
          <span className="text-xs mt-1">Mi Lista</span>
        </button>
        <button 
          className="flex flex-col items-center py-2 px-4 text-gray-600 dark:text-gray-400"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <User size={20} />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </motion.div>
  );

  // Login Component with theme support
  const LoginComponent = () => (
    <div 
      className={`min-h-screen flex items-center justify-center bg-cover bg-center relative ${theme === 'light' ? 'bg-gray-100' : ''}`}
      style={{
        backgroundImage: theme === 'dark' ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${customization.loginBackground})` : `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${customization.loginBackground})`
      }}
    >
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black opacity-40' : 'bg-white opacity-60'}`}></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme === 'dark' ? 'bg-black bg-opacity-80' : 'bg-white bg-opacity-90'} p-8 rounded-lg w-full max-w-md relative z-10 shadow-2xl`}
      >
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold text-[#C5A95E] mb-2`}>
            {customization.companyName}
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Plataforma de Capacitación Inmobiliaria
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'} text-sm font-medium mb-2`}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-md border focus:border-[#C5A95E] focus:outline-none transition-colors`}
              required
            />
          </div>
          
          <div>
            <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'} text-sm font-medium mb-2`}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-md border focus:border-[#C5A95E] focus:outline-none transition-colors`}
              required
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#C5A95E] text-black font-semibold py-3 rounded-md hover:bg-[#B8A055] transition duration-200"
          >
            Iniciar Sesión
          </motion.button>
        </form>
        
        {/* Theme toggle on login page */}
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'} hover:scale-110 transition-all`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </motion.div>
    </div>
  );

  // Enhanced Video Player Modal
  const VideoPlayerModal = () => (
    <AnimatePresence>
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
          onClick={closeModals}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-6xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">{selectedVideo.title}</h2>
              <motion.button
                onClick={closeModals}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-[#C5A95E] bg-gray-800 bg-opacity-80 rounded-full p-2 transition"
                title="Cerrar"
              >
                <X size={24} />
              </motion.button>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gray-900 p-6 rounded-b-lg"
            >
              <p className="text-gray-300 mb-4">{selectedVideo.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="text-[#C5A95E] font-semibold">{selectedVideo.match} Coincidencia</span>
                  <span>{selectedVideo.duration}</span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-500" />
                    <span>{selectedVideo.rating}</span>
                  </div>
                </div>
                <span className="text-gray-500">{selectedVideo.views} visualizaciones</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Enhanced Info Modal
  const InfoModal = () => (
    <AnimatePresence>
      {infoModalVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeModals}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={closeModals}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-10 right-0 text-white hover:text-[#C5A95E] z-10"
            >
              <X size={32} />
            </motion.button>
            <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg overflow-hidden shadow-2xl`}>
              <div className="aspect-video bg-gray-800">
                <img
                  src={infoModalVideo.thumbnail}
                  alt={infoModalVideo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl font-bold mb-2`}>
                      {infoModalVideo.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <span className="text-[#C5A95E] font-semibold">{infoModalVideo.match} Coincidencia</span>
                      <span>{infoModalVideo.duration}</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">HD</span>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500" />
                        <span>{infoModalVideo.rating}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      playVideo(infoModalVideo);
                      setInfoModalVideo(null);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 flex items-center space-x-2 ml-4"
                  >
                    <Play size={16} />
                    <span>Reproducir</span>
                  </motion.button>
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  {infoModalVideo.description}
                </p>
                <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>
                        Categoría
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {infoModalVideo.categoryName}
                      </p>
                    </div>
                    <div>
                      <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>
                        Dificultad
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {infoModalVideo.difficulty}
                      </p>
                    </div>
                    <div>
                      <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>
                        Visualizaciones
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {infoModalVideo.views} vistas
                      </p>
                    </div>
                    <div>
                      <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>
                        Fecha de Lanzamiento
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(infoModalVideo.releaseDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Enhanced Admin Panel
  const AdminPanel = () => (
    <AnimatePresence>
      {showAdminPanel && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowAdminPanel(false)}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 right-0 w-96 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-2xl z-50 overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
                  Panel de Administración
                </h2>
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition`}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[#C5A95E] font-semibold mb-3">Personalización de Marca</h3>
                  <div className="space-y-3">
                    <div>
                      <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm mb-1`}>
                        Nombre de la Empresa
                      </label>
                      <input
                        type="text"
                        value={customization.companyName}
                        onChange={(e) => saveCustomization({...customization, companyName: e.target.value})}
                        className={`w-full p-2 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none text-sm transition-colors`}
                      />
                    </div>
                    <div>
                      <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm mb-1`}>
                        URL de Fondo de Login
                      </label>
                      <input
                        type="url"
                        value={customization.loginBackground}
                        onChange={(e) => saveCustomization({...customization, loginBackground: e.target.value})}
                        className={`w-full p-2 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none text-sm transition-colors`}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    <div>
                      <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm mb-1`}>
                        URL de Banner Principal
                      </label>
                      <input
                        type="url"
                        value={customization.heroBanner}
                        onChange={(e) => saveCustomization({...customization, heroBanner: e.target.value})}
                        className={`w-full p-2 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none text-sm transition-colors`}
                        placeholder="https://ejemplo.com/banner.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[#C5A95E] font-semibold mb-3">Gestión de Categorías</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className={`flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded`}>
                        <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm`}>
                          {category.name}
                        </span>
                        <div className="flex space-x-1">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition`}
                            title="Editar categoría"
                          >
                            <Edit size={14} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition`}
                            title="Eliminar categoría"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[#C5A95E] font-semibold mb-3">Gestión de Contenido</h3>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#C5A95E] text-black py-2 rounded font-semibold hover:bg-[#B8A055] flex items-center justify-center space-x-2 transition"
                  >
                    <Upload size={16} />
                    <span>Subir Nuevo Video</span>
                  </motion.button>
                </div>

                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs text-center`}>
                    Panel de Administración - v1.0
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Enhanced Dashboard with theme support
  const Dashboard = () => {
    const filteredVideos = getFilteredVideos();
    const groupedVideos = searchQuery || filterCategory !== 'all' ? 
      { 'Resultados de Búsqueda': filteredVideos } :
      categories.reduce((acc, category) => {
        acc[category.name] = category.videos.map(video => ({
          ...video,
          categoryName: category.name,
          categoryId: category.id
        }));
        return acc;
      }, {});

    return (
      <div className={`min-h-screen pb-20 lg:pb-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
        {/* Enhanced Header */}
        <header className={`relative z-40 ${theme === 'dark' ? 'bg-black bg-opacity-50' : 'bg-white bg-opacity-90'} backdrop-blur-sm border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <motion.h1 
                whileHover={{ scale: 1.05 }}
                className="text-[#C5A95E] text-2xl font-bold cursor-pointer"
              >
                {customization.companyName}
              </motion.h1>
              <nav className="hidden md:flex space-x-6">
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.05 }}
                  className={`${theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition`}
                >
                  Inicio
                </motion.a>
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.05 }}
                  className={`${theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition`}
                >
                  Cursos
                </motion.a>
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.05 }}
                  className={`${theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition`}
                >
                  Mi Progreso
                </motion.a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'} hover:scale-110 transition-all`}
                title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {userRole === 'admin' && (
                <motion.button
                  onClick={() => setShowAdminPanel(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800`}
                  title="Panel de Administración"
                >
                  <Settings size={24} />
                </motion.button>
              )}
              
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800`}
                >
                  <User size={24} />
                </motion.button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute right-0 top-full mt-2 w-48 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-semibold`}>
                          {userRole === 'admin' ? 'Administrador' : 'Usuario'}
                        </p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                          {email}
                        </p>
                      </div>
                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                        className={`w-full flex items-center space-x-2 px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} transition`}
                      >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-96 bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${customization.heroBanner})`
          }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl"
            >
              <h2 className="text-white text-5xl font-bold mb-4 hero-text">
                Capacitación Inmobiliaria Profesional
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Domina el mercado inmobiliario con nuestros cursos especializados. 
                Aprende técnicas avanzadas, estrategias de venta y tendencias del sector.
              </p>
              <div className="flex space-x-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 flex items-center space-x-2 shadow-lg"
                >
                  <Play size={20} />
                  <span>Comenzar Ahora</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-600 bg-opacity-50 text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-70 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <Info size={20} />
                  <span>Más Información</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Search and Filter Section */}
        <div className="container mx-auto px-4 py-8">
          <SearchAndFilter />
        </div>

        {/* Enhanced Content Sections */}
        <div className="container mx-auto px-4 pb-12 space-y-12">
          {Object.entries(groupedVideos).map(([sectionName, videos], sectionIndex) => (
            <motion.section
              key={sectionName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                {sectionName !== 'Resultados de Búsqueda' && (
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="text-[#C5A95E]"
                  >
                    {categories.find(cat => cat.name === sectionName)?.icon && 
                      React.createElement(categories.find(cat => cat.name === sectionName).icon, { size: 28 })}
                  </motion.div>
                )}
                <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>
                  {sectionName}
                </h3>
                {videos.length > 0 && (
                  <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm`}>
                    ({videos.length} video{videos.length !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              
              {videos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {videos.map((video, index) => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      category={{ name: video.categoryName }} 
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                >
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No se encontraron videos que coincidan con tu búsqueda.</p>
                </motion.div>
              )}
            </motion.section>
          ))}
        </div>

        {/* Enhanced Modals */}
        <VideoPlayerModal />
        <InfoModal />
        <AdminPanel />
        <MobileBottomNav />
      </div>
    );
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#C5A95E] border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h2 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            Cargando plataforma...
          </motion.h2>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginComponent />;
  }

  return <Dashboard />;
}

export default App;