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
  TrendingDown,
  Save,
  UserPlus,
  Eye,
  EyeOff,
  ChevronDown,
  BarChart3,
  BookMarked
} from 'lucide-react';
import './App.css';
import { 
  authAPI, 
  usersAPI, 
  categoriesAPI, 
  videosAPI, 
  settingsAPI, 
  bannerVideoAPI, 
  themeAPI 
} from './apiService';
import EmergencyImageFix from './EmergencyImageFix';

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [infoModalVideo, setInfoModalVideo] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState(realEstateCategories);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showVideoManagement, setShowVideoManagement] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [bannerVideo, setBannerVideo] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // home, courses, progress
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'unbrokerage@realtyonegroupmexico.mx',
      password: 'OneVision$07',
      role: 'admin',
      name: 'Administrador',
      createdAt: '2024-01-01',
      lastLogin: null,
      isActive: true
    }
  ]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [customization, setCustomization] = useState({
    logoUrl: '',
    companyName: 'Realty ONE Group Mexico',
    loginBackgroundUrl: '',
    bannerUrl: '',
    loginTitle: 'Iniciar Sesión',
    loginSubtitle: 'Accede a tu plataforma de capacitación inmobiliaria'
  });

  // Animation controls
  const controls = useAnimation();
  const userMenuRef = useRef(null);

  // Load data from backend and theme from localStorage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load theme
      const savedTheme = localStorage.getItem('netflixRealEstateTheme') || 'dark';
      setTheme(savedTheme);
      
      try {
        // Load settings from backend
        const response = await fetch('https://one-production-6db5.up.railway.app/api/settings');
        const settingsData = await response.json();
        
        if (settingsData) {
          setCustomization({
            logoUrl: settingsData.logoUrl || '',
            companyName: settingsData.companyName || 'Realty ONE Group Mexico',
            loginBackgroundUrl: settingsData.loginBackgroundUrl || '',
            bannerUrl: settingsData.bannerUrl || '',
            loginTitle: settingsData.loginTitle || 'Iniciar Sesión',
            loginSubtitle: settingsData.loginSubtitle || 'Accede a tu plataforma de capacitación inmobiliaria'
          });
        }
        
        // Load categories
        const categoriesResponse = await fetch('https://one-production-6db5.up.railway.app/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData && categoriesData.length > 0) {
          const frontendCategories = categoriesData.map(category => ({
            id: parseInt(category.id) || category.id,
            name: category.name,
            icon: category.icon,
            videos: category.videos || []
          }));
          setCategories(frontendCategories);
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        setCategories(realEstateCategories);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Save settings to backend - SIMPLE VERSION
  const saveCustomization = async (newCustomization) => {
    try {
      setCustomization(newCustomization);
      
      const response = await fetch('https://one-production-6db5.up.railway.app/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl: newCustomization.logoUrl,
          companyName: newCustomization.companyName,
          loginBackgroundUrl: newCustomization.loginBackgroundUrl,
          bannerUrl: newCustomization.bannerUrl,
          loginTitle: newCustomization.loginTitle,
          loginSubtitle: newCustomization.loginSubtitle
        })
      });
      
      if (!response.ok) throw new Error('Save failed');
      
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const saveUsers = async (newUsers) => {
    setUsers(newUsers);
    // Users are automatically saved when created/deleted via API
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    themeAPI.set(newTheme);
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

    if (searchQuery) {
      videos = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      videos = videos.filter(video => video.categoryId === parseInt(filterCategory));
    }

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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Login attempt:', email, password); // Debug log
      
      // Use backend authentication API
      const loginResult = await authAPI.login(email, password);
      
      console.log('Login successful:', loginResult); // Debug log
      
      setCurrentUser({
        id: Date.now(), // Generate temporary ID for frontend
        name: loginResult.name,
        email: loginResult.email,
        role: loginResult.role,
        isActive: true
      });
      setUserRole(loginResult.role);
      setIsAuthenticated(true);
      
      console.log('User role set to:', loginResult.role); // Debug log
      
    } catch (error) {
      console.log('Login failed:', error.message); // Debug log
      alert('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setShowUserMenu(false);
    setShowAdminPanel(false);
    setCurrentView('home');
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      // Use backend API to create user
      await usersAPI.create({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role || 'user'
      });

      // Refresh users list
      const updatedUsers = await usersAPI.getAll();
      setUsers(updatedUsers);
      
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      alert('Usuario creado exitosamente');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear usuario: ' + error.message);
    }
  };

  const toggleUserStatus = (userId) => {
    // This functionality might need backend support for user status updates
    // For now, we'll keep it as frontend-only
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    );
    setUsers(updatedUsers);
  };

  const deleteUser = async (userId) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await usersAPI.delete(userId);
        
        // Refresh users list
        const updatedUsers = await usersAPI.getAll();
        setUsers(updatedUsers);
        
        alert('Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar usuario: ' + error.message);
      }
    }
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
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center py-2 px-4 ${currentView === 'home' ? 'text-[#C5A95E]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Inicio</span>
        </button>
        <button 
          onClick={() => setCurrentView('courses')}
          className={`flex flex-col items-center py-2 px-4 ${currentView === 'courses' ? 'text-[#C5A95E]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <BookMarked size={20} />
          <span className="text-xs mt-1">Cursos</span>
        </button>
        <button 
          onClick={() => setCurrentView('progress')}
          className={`flex flex-col items-center py-2 px-4 ${currentView === 'progress' ? 'text-[#C5A95E]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <BarChart3 size={20} />
          <span className="text-xs mt-1">Mi Progreso</span>
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

  // Login Component
  const LoginComponent = () => {
    const [localEmail, setLocalEmail] = useState('');
    const [localPassword, setLocalPassword] = useState('');
    const [localShowPassword, setLocalShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        console.log('Login attempt with API:', localEmail, localPassword);
        
        // Use backend authentication API
        const loginResult = await authAPI.login(localEmail, localPassword);
        
        console.log('Login successful:', loginResult);
        
        setCurrentUser({
          id: Date.now(), // Generate temporary ID for frontend
          name: loginResult.name,
          email: loginResult.email,
          role: loginResult.role,
          isActive: true
        });
        setUserRole(loginResult.role);
        setIsAuthenticated(true);
        setEmail(localEmail);
        setPassword(localPassword);
        
        console.log('User role set to:', loginResult.role); // Debug log
        console.log('IsAuthenticated set to:', true); // Debug log
        
      } catch (error) {
        console.log('Login failed:', error.message);
        setErrorMessage('Credenciales incorrectas');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div 
        className={`min-h-screen flex items-center justify-center bg-cover bg-center relative ${theme === 'light' ? 'bg-gray-100' : ''}`}
        style={{
          backgroundImage: theme === 'dark' ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${customization.loginBackgroundUrl})` : `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${customization.loginBackgroundUrl})`
        }}
      >
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black opacity-40' : 'bg-white opacity-60'}`}></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme === 'dark' ? 'bg-black bg-opacity-80' : 'bg-white bg-opacity-90'} p-8 rounded-lg w-full max-w-md relative z-10 shadow-2xl`}
        >
          <div className="text-center mb-8">
            {customization.logoUrl ? (
              <>
                {console.log('🖼️ Rendering logo:', customization.logoUrl)}
                <img 
                  src={customization.logoUrl} 
                  alt={customization.companyName}
                  className="h-16 mx-auto mb-4 object-contain"
                  onError={(e) => {
                    console.error('❌ Logo failed to load:', customization.logoUrl);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => console.log('✅ Logo loaded successfully')}
                />
              </>
            ) : null}
            <h1 className={`text-4xl font-bold text-[#C5A95E] mb-2`} style={{display: customization.logo ? 'none' : 'block'}}>
              {customization.companyName}
            </h1>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {customization.loginTitle}
            </p>
            {customization.loginSubtitle && (
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm mt-2`}>
                {customization.loginSubtitle}
              </p>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'} text-sm font-medium mb-2`}>
                Correo Electrónico
              </label>
              <input
                type="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-md border focus:border-[#C5A95E] focus:outline-none transition-colors`}
                required
                autoComplete="email"
                placeholder="usuario@ejemplo.com"
              />
            </div>
            
            <div>
              <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-700'} text-sm font-medium mb-2`}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={localShowPassword ? "text" : "password"}
                  value={localPassword}
                  onChange={(e) => setLocalPassword(e.target.value)}
                  className={`w-full p-3 pr-10 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-md border focus:border-[#C5A95E] focus:outline-none transition-colors`}
                  required
                  autoComplete="current-password"
                  placeholder="Ingrese su contraseña"
                />
                <button
                  type="button"
                  onClick={() => setLocalShowPassword(!localShowPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {localShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {errorMessage && (
              <div className="text-red-500 text-sm font-medium error">
                {errorMessage}
              </div>
            )}
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#C5A95E] text-black font-semibold py-3 rounded-md hover:bg-[#B8A055] transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </motion.button>
          </form>
          
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
  };

  // Video Player Modal - Smaller size like Netflix
  const VideoPlayerModal = () => (
    <AnimatePresence>
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={closeModals}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
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
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-4">
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
              className="bg-gray-900 p-6 rounded-lg"
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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

  // Video Management Modal
  const VideoManagementModal = () => {
    const getAllVideosForManagement = () => {
      const allVideos = [];
      
      // Add banner video if exists
      if (bannerVideo) {
        allVideos.push({...bannerVideo, categoryName: 'Banner Principal', categoryId: 'banner'});
      }
      
      // Add category videos
      categories.forEach(category => {
        category.videos.forEach(video => {
          allVideos.push({
            ...video,
            categoryName: category.name,
            categoryId: category.id
          });
        });
      });
      
      return allVideos;
    };

    const deleteVideo = async (videoId, categoryId) => {
      if (!window.confirm('¿Está seguro de eliminar este video?')) return;

      try {
        if (categoryId === 'banner') {
          await bannerVideoAPI.delete();
          setBannerVideo(null);
        } else {
          await videosAPI.delete(videoId);
          
          // Refresh categories to get updated data
          const updatedCategories = await categoriesAPI.getAll();
          const frontendCategories = updatedCategories.map(category => ({
            id: parseInt(category.id) || category.id,
            name: category.name,
            icon: category.icon,
            videos: category.videos || []
          }));
          setCategories(frontendCategories);
        }
        
        alert('Video eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Error al eliminar video: ' + error.message);
      }
    };

    const editVideo = (video) => {
      setEditingVideo(video);
      setShowVideoManagement(false);
      setShowVideoUpload(true);
    };

    return (
      <AnimatePresence>
        {showVideoManagement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideoManagement(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-2xl`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>
                    Gestión de Videos
                  </h2>
                  <button
                    onClick={() => setShowVideoManagement(false)}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition`}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Video</th>
                          <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Categoría</th>
                          <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Duración</th>
                          <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Vistas</th>
                          <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getAllVideosForManagement().map(video => (
                          <tr key={`${video.categoryId}-${video.id}`} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <td className="p-3">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={video.thumbnail} 
                                  alt={video.title}
                                  className="w-16 h-9 object-cover rounded"
                                />
                                <div>
                                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>
                                    {video.title}
                                  </p>
                                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                    {video.description?.substring(0, 50)}...
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} p-3`}>
                              <span className={`px-2 py-1 rounded text-xs ${
                                video.categoryId === 'banner' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {video.categoryName}
                              </span>
                            </td>
                            <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} p-3`}>
                              {video.duration}
                            </td>
                            <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} p-3`}>
                              {video.views}
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => editVideo(video)}
                                  className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                                  title="Editar video"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => deleteVideo(video.id, video.categoryId)}
                                  className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition"
                                  title="Eliminar video"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  const UserManagementModal = () => {
    const [localNewUser, setLocalNewUser] = useState({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });

    const handleCreateUser = () => {
      if (!localNewUser.name || !localNewUser.email || !localNewUser.password) {
        alert('Por favor complete todos los campos');
        return;
      }

      if (users.find(u => u.email === localNewUser.email)) {
        alert('Ya existe un usuario con este email');
        return;
      }

      const user = {
        id: Date.now(),
        ...localNewUser,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null,
        isActive: true
      };

      const updatedUsers = [...users, user];
      saveUsers(updatedUsers);
      setLocalNewUser({ name: '', email: '', password: '', role: 'user' });
      alert('Usuario creado exitosamente');
    };

    return (
      <AnimatePresence>
        {showUserManagement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUserManagement(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-2xl`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>
                    Gestión de Usuarios
                  </h2>
                  <button
                    onClick={() => setShowUserManagement(false)}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition`}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6">
                  {/* Create New User */}
                  <div className="mb-8">
                    <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-semibold mb-4`}>
                      Crear Nuevo Usuario
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={localNewUser.name}
                        onChange={(e) => setLocalNewUser({...localNewUser, name: e.target.value})}
                        className={`p-3 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                      />
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={localNewUser.email}
                        onChange={(e) => setLocalNewUser({...localNewUser, email: e.target.value})}
                        className={`p-3 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                      />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        value={localNewUser.password}
                        onChange={(e) => setLocalNewUser({...localNewUser, password: e.target.value})}
                        className={`p-3 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                      />
                      <select
                        value={localNewUser.role}
                        onChange={(e) => setLocalNewUser({...localNewUser, role: e.target.value})}
                        className={`p-3 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <button
                      onClick={handleCreateUser}
                      className="mt-4 bg-[#C5A95E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B8A055] transition flex items-center space-x-2"
                    >
                      <UserPlus size={20} />
                      <span>Crear Usuario</span>
                    </button>
                  </div>

                  {/* Users List */}
                  <div>
                    <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-semibold mb-4`}>
                      Usuarios Registrados ({users.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Usuario</th>
                            <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Email</th>
                            <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Rol</th>
                            <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Estado</th>
                            <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Último Acceso</th>
                            <th className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left p-3`}>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                              <td className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} p-3`}>{user.name || 'Administrador'}</td>
                              <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} p-3`}>{user.email}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                  {user.role === 'admin' ? 'Admin' : 'Usuario'}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                  {user.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} p-3`}>
                                {user.lastLogin || 'Nunca'}
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => toggleUserStatus(user.id)}
                                    className={`p-1 rounded ${user.isActive ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900' : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'} transition`}
                                    title={user.isActive ? 'Desactivar' : 'Activar'}
                                  >
                                    {user.isActive ? <X size={16} /> : <Plus size={16} />}
                                  </button>
                                  {user.role !== 'admin' && (
                                    <button
                                      onClick={() => deleteUser(user.id)}
                                      className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition"
                                      title="Eliminar usuario"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Video Upload Modal
  const VideoUploadModal = () => {
    const [newVideo, setNewVideo] = useState({
      title: '',
      description: '',
      categoryId: categories[0]?.id || 1,
      difficulty: 'Principiante',
      videoUrl: '',
      thumbnail: '',
      duration: ''
    });

    // Load editing video data when modal opens
    useEffect(() => {
      if (editingVideo) {
        setNewVideo({
          title: editingVideo.title,
          description: editingVideo.description,
          categoryId: editingVideo.categoryId,
          difficulty: editingVideo.difficulty,
          videoUrl: `https://youtube.com/watch?v=${editingVideo.youtubeId}`,
          thumbnail: editingVideo.thumbnail,
          duration: editingVideo.duration
        });
      } else {
        setNewVideo({
          title: '',
          description: '',
          categoryId: categories[0]?.id || 1,
          difficulty: 'Principiante',
          videoUrl: '',
          thumbnail: '',
          duration: ''
        });
      }
    }, [editingVideo, showVideoUpload]);

    const extractYouTubeId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleUploadVideo = async () => {
      if (!newVideo.title || !newVideo.videoUrl) {
        alert('Por favor complete título y URL del video');
        return;
      }

      const youtubeId = extractYouTubeId(newVideo.videoUrl);
      if (!youtubeId) {
        alert('Por favor ingrese una URL válida de YouTube');
        return;
      }

      const videoData = {
        title: newVideo.title,
        description: newVideo.description,
        thumbnail: newVideo.thumbnail || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        duration: newVideo.duration || '45 min',
        youtubeId: youtubeId,
        match: editingVideo ? editingVideo.match : '95%',
        difficulty: newVideo.difficulty,
        rating: editingVideo ? editingVideo.rating : 4.5,
        views: editingVideo ? editingVideo.views : 0,
        releaseDate: editingVideo ? editingVideo.releaseDate : new Date().toISOString().split('T')[0],
        categoryId: newVideo.categoryId.toString()
      };

      try {
        if (editingVideo) {
          // Update existing video
          if (editingVideo.categoryId === 'banner') {
            await bannerVideoAPI.set({
              title: videoData.title,
              description: videoData.description,
              thumbnail: videoData.thumbnail,
              youtubeId: videoData.youtubeId
            });
            const updatedBanner = await bannerVideoAPI.get();
            setBannerVideo(updatedBanner);
          } else {
            await videosAPI.update(editingVideo.id, videoData);
            
            // Refresh categories
            const updatedCategories = await categoriesAPI.getAll();
            const frontendCategories = updatedCategories.map(category => ({
              id: parseInt(category.id) || category.id,
              name: category.name,
              icon: category.icon,
              videos: category.videos || []
            }));
            setCategories(frontendCategories);
          }
          alert('Video actualizado exitosamente');
        } else {
          // Create new video
          if (newVideo.categoryId === 'banner') {
            await bannerVideoAPI.set({
              title: videoData.title,
              description: videoData.description,
              thumbnail: videoData.thumbnail,
              youtubeId: videoData.youtubeId
            });
            const updatedBanner = await bannerVideoAPI.get();
            setBannerVideo(updatedBanner);
          } else {
            await videosAPI.create(videoData);
            
            // Refresh categories
            const updatedCategories = await categoriesAPI.getAll();
            const frontendCategories = updatedCategories.map(category => ({
              id: parseInt(category.id) || category.id,
              name: category.name,
              icon: category.icon,
              videos: category.videos || []
            }));
            setCategories(frontendCategories);
          }
          alert('Video subido exitosamente');
        }
        
        setEditingVideo(null);
        setShowVideoUpload(false);
      } catch (error) {
        console.error('Error uploading/updating video:', error);
        alert('Error al procesar video: ' + error.message);
      }
    };

    const handleCloseModal = () => {
      setEditingVideo(null);
      setShowVideoUpload(false);
    };

    return (
      <AnimatePresence>
        {showVideoUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-2xl`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
                    {editingVideo ? 'Editar Video' : 'Subir Nuevo Video'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-medium mb-1`}>
                      Título del Video
                    </label>
                    <input
                      type="text"
                      placeholder="Ingrese el título del video"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                      className={`w-full p-2 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-medium mb-1`}>
                      Descripción
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Descripción del video..."
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                      className={`w-full p-2 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none resize-none`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-medium mb-1`}>
                        Categoría
                      </label>
                      <select 
                        value={newVideo.categoryId}
                        onChange={(e) => setNewVideo({...newVideo, categoryId: e.target.value})}
                        className={`w-full p-2 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                        disabled={editingVideo?.categoryId === 'banner'}
                      >
                        <option value="banner">Banner Principal</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-medium mb-1`}>
                        Dificultad
                      </label>
                      <select 
                        value={newVideo.difficulty}
                        onChange={(e) => setNewVideo({...newVideo, difficulty: e.target.value})}
                        className={`w-full p-2 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                      >
                        <option value="Principiante">Principiante</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-medium mb-1`}>
                      URL del Video (YouTube)
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={newVideo.videoUrl}
                      onChange={(e) => setNewVideo({...newVideo, videoUrl: e.target.value})}
                      className={`w-full p-2 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-medium mb-1`}>
                        URL de Miniatura (opcional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/miniatura.jpg"
                        value={newVideo.thumbnail}
                        onChange={(e) => setNewVideo({...newVideo, thumbnail: e.target.value})}
                        className={`w-full p-2 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-medium mb-1`}>
                        Duración
                      </label>
                      <input
                        type="text"
                        placeholder="45 min"
                        value={newVideo.duration}
                        onChange={(e) => setNewVideo({...newVideo, duration: e.target.value})}
                        className={`w-full p-2 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-lg border focus:border-[#C5A95E] focus:outline-none`}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-3">
                    <button
                      onClick={handleUploadVideo}
                      className="flex-1 bg-[#C5A95E] text-black py-2 px-4 rounded-lg font-semibold hover:bg-[#B8A055] transition flex items-center justify-center space-x-2 text-sm"
                    >
                      <Upload size={16} />
                      <span>{editingVideo ? 'Actualizar Video' : 'Subir Video'}</span>
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Enhanced Admin Panel
  const AdminPanel = () => {
    const [newCategoryName, setNewCategoryName] = useState('');

    const addCategory = async () => {
      if (!newCategoryName.trim()) {
        alert('Por favor ingrese un nombre para la categoría');
        return;
      }

      try {
        await categoriesAPI.create({
          name: newCategoryName.trim(),
          icon: 'BookOpen' // Default icon
        });

        // Refresh categories
        const updatedCategories = await categoriesAPI.getAll();
        const frontendCategories = updatedCategories.map(category => ({
          id: parseInt(category.id) || category.id,
          name: category.name,
          icon: category.icon,
          videos: category.videos || []
        }));
        setCategories(frontendCategories);
        
        setNewCategoryName('');
        alert('Categoría agregada exitosamente');
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Error al agregar categoría: ' + error.message);
      }
    };

    const editCategory = async (category) => {
      const newName = prompt('Nuevo nombre para la categoría:', category.name);
      if (newName && newName.trim() && newName !== category.name) {
        try {
          await categoriesAPI.update(category.id.toString(), {
            name: newName.trim(),
            icon: category.icon
          });

          // Refresh categories
          const updatedCategories = await categoriesAPI.getAll();
          const frontendCategories = updatedCategories.map(cat => ({
            id: parseInt(cat.id) || cat.id,
            name: cat.name,
            icon: cat.icon,
            videos: cat.videos || []
          }));
          setCategories(frontendCategories);
          
          alert('Categoría actualizada exitosamente');
        } catch (error) {
          console.error('Error updating category:', error);
          alert('Error al actualizar categoría: ' + error.message);
        }
      }
    };

    const deleteCategory = async (categoryId) => {
      if (window.confirm('¿Está seguro de eliminar esta categoría y todos sus videos?')) {
        try {
          await categoriesAPI.delete(categoryId.toString());
          
          // Refresh categories
          const updatedCategories = await categoriesAPI.getAll();
          const frontendCategories = updatedCategories.map(category => ({
            id: parseInt(category.id) || category.id,
            name: category.name,
            icon: category.icon,
            videos: category.videos || []
          }));
          setCategories(frontendCategories);
          
          alert('Categoría eliminada exitosamente');
        } catch (error) {
          console.error('Error deleting category:', error);
          alert('Error al eliminar categoría: ' + error.message);
        }
      }
    };

    return (
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
              className={`fixed inset-y-0 right-0 w-80 max-w-sm ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-2xl z-50 overflow-y-auto`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>
                    Panel de Administración
                  </h2>
                  <button
                    onClick={() => setShowAdminPanel(false)}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-[#C5A95E] font-semibold mb-2 text-sm">Personalización de Marca</h3>
                    
                    <EmergencyImageFix 
                      customization={customization}
                      setCustomization={setCustomization}
                      saveCustomization={saveCustomization}
                      theme={theme}
                    />
                    
                    <div className="space-y-2 mt-4">
                      <div>
                        <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xs mb-1`}>
                          URL del Logo
                        </label>
                        <input
                          type="text"
                          value={customization.logoUrl}
                          onChange={(e) => {
                            const newCustomization = {...customization, logoUrl: e.target.value};
                            setCustomization(newCustomization);
                            clearTimeout(window.logoTimer);
                            window.logoTimer = setTimeout(() => {
                              saveCustomization(newCustomization);
                            }, 1000);
                          }}
                          className={`w-full p-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none transition-colors`}
                          placeholder="https://ejemplo.com/logo.png"
                        />
                      </div>
                      <div>
                        <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xs mb-1`}>
                          Nombre de la Empresa
                        </label>
                        <input
                          type="text"
                          defaultValue={customization.companyName}
                          onBlur={(e) => saveCustomization({...customization, companyName: e.target.value})}
                          className={`w-full p-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none transition-colors`}
                        />
                      </div>
                      <div>
                        <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xs mb-1`}>
                          Título del Login
                        </label>
                        <input
                          type="text"
                          defaultValue={customization.loginTitle}
                          onBlur={(e) => saveCustomization({...customization, loginTitle: e.target.value})}
                          className={`w-full p-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none transition-colors`}
                        />
                      </div>
                      <div>
                        <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xs mb-1`}>
                          Subtítulo del Login
                        </label>
                        <input
                          type="text"
                          defaultValue={customization.loginSubtitle}
                          onBlur={(e) => saveCustomization({...customization, loginSubtitle: e.target.value})}
                          className={`w-full p-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none transition-colors`}
                        />
                      </div>
                      <div>
                        <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xs mb-1`}>
                          URL de Fondo de Login
                        </label>
                        <input
                          type="text"
                          value={customization.loginBackgroundUrl}
                          onChange={(e) => {
                            const newCustomization = {...customization, loginBackgroundUrl: e.target.value};
                            setCustomization(newCustomization);
                            clearTimeout(window.backgroundTimer);
                            window.backgroundTimer = setTimeout(() => {
                              saveCustomization(newCustomization);
                            }, 1000);
                          }}
                          className={`w-full p-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none transition-colors`}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                      <div>
                        <label className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xs mb-1`}>
                          URL de Banner Principal
                        </label>
                        <input
                          type="text"
                          defaultValue={customization.bannerUrl}
                          onBlur={(e) => saveCustomization({...customization, bannerUrl: e.target.value})}
                          className={`w-full p-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none transition-colors`}
                          placeholder="https://ejemplo.com/banner.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#C5A95E] font-semibold mb-2 text-sm">Gestión de Usuarios</h3>
                    <button 
                      onClick={() => setShowUserManagement(true)}
                      className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2 transition text-sm"
                    >
                      <Users size={14} />
                      <span>Gestionar Usuarios</span>
                    </button>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Total de usuarios: {users.length}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#C5A95E] font-semibold mb-2 text-sm">Gestión de Categorías</h3>
                    
                    {/* Add new category */}
                    <div className="mb-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Nombre de nueva categoría"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className={`flex-1 p-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded border focus:border-[#C5A95E] focus:outline-none`}
                        />
                        <button
                          onClick={addCategory}
                          className="bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700 transition"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category.id} className={`flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded text-xs`}>
                          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center space-x-2`}>
                            <category.icon size={12} />
                            <span>{category.name}</span>
                          </span>
                          <div className="flex space-x-1">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => editCategory(category)}
                              className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition`}
                              title="Editar categoría"
                            >
                              <Edit size={10} />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteCategory(category.id)}
                              className={`${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition`}
                              title="Eliminar categoría"
                            >
                              <Trash2 size={10} />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#C5A95E] font-semibold mb-2 text-sm">Gestión de Contenido</h3>
                    <motion.button 
                      onClick={() => setShowVideoUpload(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#C5A95E] text-black py-2 rounded font-semibold hover:bg-[#B8A055] flex items-center justify-center space-x-2 transition text-sm mb-2"
                    >
                      <Upload size={14} />
                      <span>Subir Nuevo Video</span>
                    </motion.button>
                    
                    <motion.button 
                      onClick={() => setShowVideoManagement(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 flex items-center justify-center space-x-2 transition text-sm"
                    >
                      <Edit size={14} />
                      <span>Gestionar Videos</span>
                    </motion.button>
                  </div>

                  <div className={`pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs text-center`}>
                      Panel de Administración - v3.0
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  // Progress View Component
  const ProgressView = () => (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-8`}>
          Mi Progreso de Aprendizaje
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-[#C5A95E] p-3 rounded-full">
                <BookMarked className="text-white" size={24} />
              </div>
              <div>
                <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>Cursos Completados</h3>
                <p className="text-[#C5A95E] text-2xl font-bold">7</p>
              </div>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>Tiempo Total</h3>
                <p className="text-blue-600 text-2xl font-bold">42h</p>
              </div>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>Certificaciones</h3>
                <p className="text-green-600 text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-semibold mb-4`}>
            Progreso por Categoría
          </h3>
          <div className="space-y-4">
            {categories.slice(0, 5).map((category, index) => (
              <div key={category.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>
                    {category.name}
                  </span>
                  <span className="text-[#C5A95E] font-semibold">
                    {Math.floor(Math.random() * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-[#C5A95E] h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Courses View Component
  const CoursesView = () => (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-8`}>
          Todos los Cursos
        </h1>

        <SearchAndFilter />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getFilteredVideos().map((video, index) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              category={{ name: video.categoryName }} 
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Enhanced Dashboard with view management
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

    const renderCurrentView = () => {
      switch (currentView) {
        case 'courses':
          return <CoursesView />;
        case 'progress':
          return <ProgressView />;
        default:
          return (
            <>
              {/* Hero Section */}
              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-96 bg-cover bg-center flex items-center"
                style={{
                  backgroundImage: bannerVideo ? 
                    `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${bannerVideo.thumbnail})` :
                    `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${customization.heroBanner})`
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
                      {bannerVideo ? bannerVideo.title : 'Capacitación Inmobiliaria Profesional'}
                    </h2>
                    <p className="text-gray-300 text-lg mb-6">
                      {bannerVideo ? bannerVideo.description : 'Domina el mercado inmobiliario con nuestros cursos especializados. Aprende técnicas avanzadas, estrategias de venta y tendencias del sector.'}
                    </p>
                    <div className="flex space-x-4">
                      <motion.button 
                        onClick={() => bannerVideo ? playVideo(bannerVideo) : null}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 flex items-center space-x-2 shadow-lg"
                      >
                        <Play size={20} />
                        <span>{bannerVideo ? 'Reproducir Video' : 'Comenzar Ahora'}</span>
                      </motion.button>
                      <motion.button 
                        onClick={() => bannerVideo ? showMoreInfo(bannerVideo) : null}
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

              {/* Content Sections */}
              <div className="container mx-auto px-4 py-12 space-y-12">
                {categories.map((category, sectionIndex) => (
                  <motion.section
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <motion.div
                        whileHover={{ rotate: 15 }}
                        className="text-[#C5A95E]"
                      >
                        <category.icon size={28} />
                      </motion.div>
                      <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>
                        {category.name}
                      </h3>
                      {category.videos.length > 0 && (
                        <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm`}>
                          ({category.videos.length} video{category.videos.length !== 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                    
                    {category.videos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {category.videos.map((video, index) => (
                          <VideoCard 
                            key={video.id} 
                            video={{...video, categoryName: category.name, categoryId: category.id}} 
                            category={category} 
                            index={index}
                          />
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                      >
                        <Film size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No hay videos disponibles en esta categoría.</p>
                      </motion.div>
                    )}
                  </motion.section>
                ))}
              </div>
            </>
          );
      }
    };

    return (
      <div className={`min-h-screen pb-20 lg:pb-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
        {/* Enhanced Header */}
        <header className={`relative z-40 ${theme === 'dark' ? 'bg-black bg-opacity-50' : 'bg-white bg-opacity-90'} backdrop-blur-sm border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer flex items-center space-x-3"
                onClick={() => setCurrentView('home')}
              >
                {customization.logoUrl ? (
                  <img 
                    src={customization.logoUrl} 
                    alt={customization.companyName}
                    className="h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <h1 className={`text-[#C5A95E] text-2xl font-bold ${customization.logo ? 'hidden' : 'block'}`}>
                  {customization.companyName}
                </h1>
              </motion.div>
              <nav className="hidden md:flex space-x-6">
                <motion.button 
                  onClick={() => setCurrentView('home')}
                  whileHover={{ scale: 1.05 }}
                  className={`${currentView === 'home' ? 'text-[#C5A95E]' : theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition`}
                >
                  Inicio
                </motion.button>
                <motion.button 
                  onClick={() => setCurrentView('courses')}
                  whileHover={{ scale: 1.05 }}
                  className={`${currentView === 'courses' ? 'text-[#C5A95E]' : theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition`}
                >
                  Cursos
                </motion.button>
                <motion.button 
                  onClick={() => setCurrentView('progress')}
                  whileHover={{ scale: 1.05 }}
                  className={`${currentView === 'progress' ? 'text-[#C5A95E]' : theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition`}
                >
                  Mi Progreso
                </motion.button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Simple Search Icon */}
              <motion.button
                onClick={() => setCurrentView('courses')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800`}
                title="Buscar contenido"
              >
                <Search size={24} />
              </motion.button>

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
              
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-white hover:text-[#C5A95E]' : 'text-gray-900 hover:text-[#C5A95E]'} transition p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800`}
                >
                  <User size={24} />
                  <ChevronDown size={16} />
                </motion.button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute right-0 top-full mt-2 min-w-max ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} min-w-max`}>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-semibold whitespace-nowrap`}>
                          {currentUser?.name || 'Usuario'}
                        </p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs whitespace-nowrap`}>
                          {currentUser?.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs whitespace-nowrap`}>
                          {currentUser?.email}
                        </p>
                      </div>
                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                        className={`w-full flex items-center space-x-2 px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} transition whitespace-nowrap`}
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

        {/* Dynamic Content */}
        {renderCurrentView()}

        {/* Enhanced Modals */}
        <VideoPlayerModal />
        <InfoModal />
        <AdminPanel />
        <UserManagementModal />
        <VideoUploadModal />
        <VideoManagementModal />
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