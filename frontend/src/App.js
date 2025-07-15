import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, LogOut, Sun, Moon, Save, UserPlus, Upload, 
  Film, Users, Edit, Trash2, X, BarChart3, Home, 
  TrendingUp, Eye, Play
} from 'lucide-react';
import VideoCard from './components/VideoCard';
import VideoDetail from './components/VideoDetail';
import ProgressDashboard from './components/ProgressDashboard';
import ToastContainer, { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast, 
  showInfoToast 
} from './components/ToastContainer';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('dark');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customization, setCustomization] = useState({
    logoUrl: '',
    companyName: 'Realty ONE Group Mexico',
    loginBackgroundUrl: '',
    loginTitle: 'Iniciar Sesión',
    loginSubtitle: 'Accede a tu plataforma de capacitación inmobiliaria'
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const settingsResponse = await fetch(`${API_URL}/settings`);
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();
        setCustomization({
          logoUrl: settings.logoUrl || '',
          companyName: settings.companyName || 'Realty ONE Group Mexico',
          loginBackgroundUrl: settings.loginBackgroundUrl || '',
          loginTitle: settings.loginTitle || 'Iniciar Sesión',
          loginSubtitle: settings.loginSubtitle || 'Accede a tu plataforma de capacitación inmobiliaria'
        });
      }

      const categoriesResponse = await fetch(`${API_URL}/categories`);
      if (categoriesResponse.ok) {
        const cats = await categoriesResponse.json();
        setCategories(cats || []);
      }

      const usersResponse = await fetch(`${API_URL}/users`);
      if (usersResponse.ok) {
        const usersList = await usersResponse.json();
        setUsers(usersList || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const result = await response.json();
        setUserRole(result.role);
        setIsAuthenticated(true);
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setEmail('');
    setPassword('');
    setShowAdminPanel(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const saveSettings = async (field, value) => {
    try {
      const newSettings = { ...customization, [field]: value };
      
      const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      
      if (response.ok) {
        setCustomization(newSettings);
        alert(`✅ ${field} guardado correctamente`);
        // Reload data to confirm
        setTimeout(loadInitialData, 500);
      } else {
        alert('❌ Error al guardar');
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  const saveLogoUrl = () => {
    const input = document.getElementById('logoInput');
    if (input && input.value.trim()) {
      saveSettings('logoUrl', input.value.trim());
    } else {
      alert('Ingrese una URL válida');
    }
  };

  const saveBackgroundUrl = () => {
    const input = document.getElementById('backgroundInput');
    if (input && input.value.trim()) {
      saveSettings('loginBackgroundUrl', input.value.trim());
    } else {
      alert('Ingrese una URL válida');
    }
  };

  const saveCompanyName = () => {
    const input = document.getElementById('companyInput');
    if (input && input.value.trim()) {
      saveSettings('companyName', input.value.trim());
    } else {
      alert('Ingrese un nombre válido');
    }
  };

  const saveLoginTitle = () => {
    const input = document.getElementById('titleInput');
    if (input && input.value.trim()) {
      saveSettings('loginTitle', input.value.trim());
    } else {
      alert('Ingrese un título válido');
    }
  };

  const saveLoginSubtitle = () => {
    const input = document.getElementById('subtitleInput');
    if (input && input.value.trim()) {
      saveSettings('loginSubtitle', input.value.trim());
    } else {
      alert('Ingrese un subtítulo válido');
    }
  };

  const createUser = async () => {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    const role = document.getElementById('userRole').value;

    if (!name || !email || !password) {
      alert('❌ Complete todos los campos');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      if (response.ok) {
        document.getElementById('userName').value = '';
        document.getElementById('userEmail').value = '';
        document.getElementById('userPassword').value = '';
        document.getElementById('userRole').value = 'user';
        alert('✅ Usuario creado exitosamente');
        loadInitialData();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.detail || 'Error al crear usuario'}`);
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  const deleteUser = async (userId) => {
    if (confirm('¿Eliminar usuario?')) {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('✅ Usuario eliminado exitosamente');
          loadInitialData();
        } else {
          alert('❌ Error al eliminar usuario');
        }
      } catch (error) {
        alert('❌ Error de conexión');
      }
    }
  };

  const uploadVideo = async () => {
    const title = document.getElementById('videoTitle').value.trim();
    const description = document.getElementById('videoDescription').value.trim();
    const url = document.getElementById('videoUrl').value.trim();
    const categoryId = document.getElementById('videoCategory').value;
    const duration = document.getElementById('videoDuration').value.trim();

    if (!title || !url || !categoryId) {
      alert('❌ Complete título, URL y categoría');
      return;
    }

    const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (!youtubeId) {
      alert('❌ URL de YouTube inválida');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || 'Sin descripción',
          thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
          duration: duration || '45 min',
          youtubeId,
          match: '95%',
          difficulty: 'Intermedio',
          rating: 4.5,
          views: 0,
          releaseDate: new Date().toISOString().split('T')[0],
          categoryId: categoryId.toString()
        })
      });

      if (response.ok) {
        document.getElementById('videoTitle').value = '';
        document.getElementById('videoDescription').value = '';
        document.getElementById('videoUrl').value = '';
        document.getElementById('videoCategory').value = '';
        document.getElementById('videoDuration').value = '';
        alert('✅ Video subido exitosamente');
        loadInitialData();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.detail || 'Error al subir video'}`);
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  if (!isAuthenticated) {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center relative ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        style={{
          backgroundImage: theme === 'dark' 
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${customization.loginBackgroundUrl})` 
            : `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${customization.loginBackgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className={`${theme === 'dark' ? 'bg-black bg-opacity-80' : 'bg-white bg-opacity-90'} p-8 rounded-lg w-full max-w-md shadow-2xl`}>
          <div className="text-center mb-8">
            {customization.logoUrl && (
              <img 
                src={customization.logoUrl} 
                alt="Logo"
                className="h-16 mx-auto mb-4 object-contain"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <h1 className="text-4xl font-bold text-[#C5A95E] mb-2">{customization.companyName}</h1>
            <h2 className="text-2xl font-semibold mb-2">{customization.loginTitle}</h2>
            <p className="text-gray-400">{customization.loginSubtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} focus:border-[#C5A95E] focus:outline-none`}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} focus:border-[#C5A95E] focus:outline-none`}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#C5A95E] text-white p-3 rounded hover:bg-[#B8975A] transition-colors font-semibold"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>

        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#C5A95E] text-white hover:bg-[#B8975A] transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 flex justify-between items-center shadow-lg`}>
        <div className="flex items-center space-x-3">
          {customization.logoUrl && (
            <img 
              src={customization.logoUrl} 
              alt="Logo"
              className="h-8 object-contain"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <h1 className="text-xl font-bold text-[#C5A95E]">{customization.companyName}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[#C5A95E] text-white hover:bg-[#B8975A] transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {userRole === 'admin' && (
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="p-2 rounded-full bg-[#C5A95E] text-white hover:bg-[#B8975A] transition-colors"
            >
              <Settings size={20} />
            </button>
          )}

          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

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
              className={`fixed right-0 top-0 h-full w-96 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl z-50 overflow-y-auto`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#C5A95E]">Panel de Administración</h2>
                  <button
                    onClick={() => setShowAdminPanel(false)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-[#C5A95E] rounded-lg p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                    <h3 className="text-[#C5A95E] font-bold mb-4 flex items-center text-lg">
                      <Settings className="mr-2" size={20} />
                      🖼️ CONFIGURACIÓN DE IMÁGENES
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                        <label className="block text-sm font-bold mb-2 text-blue-600 dark:text-blue-400">🏢 URL del Logo:</label>
                        <input
                          id="logoInput"
                          type="text"
                          defaultValue={customization.logoUrl}
                          className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                          placeholder="https://ejemplo.com/logo.png"
                        />
                        <button
                          onClick={saveLogoUrl}
                          className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center font-bold shadow-lg"
                        >
                          <Save className="mr-2" size={18} />
                          💾 GUARDAR LOGO
                        </button>
                      </div>

                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                        <label className="block text-sm font-bold mb-2 text-green-600 dark:text-green-400">🌄 URL de Fondo de Login:</label>
                        <input
                          id="backgroundInput"
                          type="text"
                          defaultValue={customization.loginBackgroundUrl}
                          className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-green-500 focus:outline-none"
                          placeholder="https://ejemplo.com/fondo.jpg"
                        />
                        <button
                          onClick={saveBackgroundUrl}
                          className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center font-bold shadow-lg"
                        >
                          <Save className="mr-2" size={18} />
                          💾 GUARDAR FONDO
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-[#C5A95E] rounded-lg p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
                    <h3 className="text-[#C5A95E] font-bold mb-4 flex items-center text-lg">
                      <Edit className="mr-2" size={20} />
                      ✏️ CONFIGURACIÓN DE TEXTOS
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                        <label className="block text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">🏢 Nombre de la Empresa:</label>
                        <input
                          id="companyInput"
                          type="text"
                          defaultValue={customization.companyName}
                          className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          onClick={saveCompanyName}
                          className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center font-bold shadow-lg"
                        >
                          <Save className="mr-2" size={18} />
                          💾 GUARDAR NOMBRE
                        </button>
                      </div>

                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                        <label className="block text-sm font-bold mb-2 text-teal-600 dark:text-teal-400">📋 Título del Login:</label>
                        <input
                          id="titleInput"
                          type="text"
                          defaultValue={customization.loginTitle}
                          className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 focus:outline-none"
                        />
                        <button
                          onClick={saveLoginTitle}
                          className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center justify-center font-bold shadow-lg"
                        >
                          <Save className="mr-2" size={18} />
                          💾 GUARDAR TÍTULO
                        </button>
                      </div>

                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                        <label className="block text-sm font-bold mb-2 text-pink-600 dark:text-pink-400">📝 Subtítulo del Login:</label>
                        <input
                          id="subtitleInput"
                          type="text"
                          defaultValue={customization.loginSubtitle}
                          className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none"
                        />
                        <button
                          onClick={saveLoginSubtitle}
                          className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all duration-200 flex items-center justify-center font-bold shadow-lg"
                        >
                          <Save className="mr-2" size={18} />
                          💾 GUARDAR SUBTÍTULO
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-[#C5A95E] rounded-lg p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800">
                    <h3 className="text-[#C5A95E] font-bold mb-4 flex items-center text-lg">
                      <Users className="mr-2" size={20} />
                      👥 GESTIÓN DE USUARIOS
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-bold mb-2 text-emerald-600 dark:text-emerald-400">👤 Nombre:</label>
                            <input
                              id="userName"
                              type="text"
                              className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                              placeholder="Nombre completo"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2 text-emerald-600 dark:text-emerald-400">📧 Email:</label>
                            <input
                              id="userEmail"
                              type="email"
                              className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                              placeholder="usuario@email.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2 text-emerald-600 dark:text-emerald-400">🔐 Contraseña:</label>
                            <input
                              id="userPassword"
                              type="password"
                              className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                              placeholder="Contraseña"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2 text-emerald-600 dark:text-emerald-400">🎭 Rol:</label>
                            <select
                              id="userRole"
                              className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                            >
                              <option value="user">Usuario</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={createUser}
                          className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center justify-center font-bold shadow-lg"
                        >
                          <UserPlus className="mr-2" size={18} />
                          ➕ CREAR USUARIO
                        </button>
                      </div>

                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                        <h4 className="text-sm font-bold mb-3 text-emerald-600 dark:text-emerald-400">📋 Usuarios existentes:</h4>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {users.map((user) => (
                            <div key={user.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border flex justify-between items-center">
                              <div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{user.email} ({user.role})</div>
                              </div>
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-[#C5A95E] rounded-lg p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900 dark:to-red-800">
                    <h3 className="text-[#C5A95E] font-bold mb-4 flex items-center text-lg">
                      <Film className="mr-2" size={20} />
                      🎬 SUBIR NUEVO VIDEO
                    </h3>
                    
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold mb-2 text-red-600 dark:text-red-400">🎥 Título del Video:</label>
                          <input
                            id="videoTitle"
                            type="text"
                            className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:outline-none"
                            placeholder="Título del video"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-red-600 dark:text-red-400">📝 Descripción:</label>
                          <textarea
                            id="videoDescription"
                            className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:outline-none"
                            placeholder="Descripción del video"
                            rows="3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-red-600 dark:text-red-400">🔗 URL de YouTube:</label>
                          <input
                            id="videoUrl"
                            type="url"
                            className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:outline-none"
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-red-600 dark:text-red-400">📂 Categoría:</label>
                          <select
                            id="videoCategory"
                            className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:outline-none"
                          >
                            <option value="">Seleccionar categoría</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-red-600 dark:text-red-400">⏱️ Duración:</label>
                          <input
                            id="videoDuration"
                            type="text"
                            className="w-full p-3 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 focus:outline-none"
                            placeholder="45 min"
                          />
                        </div>
                        <button
                          onClick={uploadVideo}
                          className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center font-bold shadow-lg"
                        >
                          <Upload className="mr-2" size={18} />
                          ⬆️ SUBIR VIDEO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">Plataforma de Capacitación Inmobiliaria</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all cursor-pointer`}
            >
              <h3 className="text-xl font-semibold text-[#C5A95E] mb-2">{category.name}</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {category.videos?.length || 0} videos disponibles
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;