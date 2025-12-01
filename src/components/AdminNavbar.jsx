import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services';
import ordersService from '../services/ordersService';
import contactService from '../services/contactService';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [undeliveredCount, setUndeliveredCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [orders, contact] = await Promise.all([
        ordersService.getStatistics(),
        contactService.getStatistics(),
      ]);

      // Compter les commandes non livrées
      const undelivered = orders.orders_by_status?.reduce((sum, item) => {
        if (item.status !== 'delivered') return sum + item.count;
        return sum;
      }, 0) || 0;

      setUndeliveredCount(undelivered);
      setUnreadMessagesCount(contact.unread_messages || 0);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Récupérer les sessions actives
      const response = await authService.getSessions();
      const sessions = response.sessions || [];
      const currentUserAgent = navigator.userAgent;

      // Trouver la session active (celle du navigateur courant)
      const currentSession = sessions.find(
        (session) => session.user_agent === currentUserAgent
      );

      // Invalider la session active si trouvée
      if (currentSession) {
        await authService.invalidateSession(currentSession.id);
      }

      // Déconnecter l'utilisateur
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Faire le logout quand même en cas d'erreur
      logout();
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      path: '/admin/books',
      label: 'Livres',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.228 6.228 2 10.228 2 15s4.228 8.772 10 8.772 10-4.228 10-8.772c0-4.772-4.228-8.747-10-8.747zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      path: '/admin/orders',
      label: 'Commandes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />
        </svg>
      ),
    },
    {
      path: '/admin/payments',
      label: 'Paiements',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10m4 0a1 1 0 11-2 0 1 1 0 012 0zM3 6a2 2 0 012-2h14a2 2 0 012 2v2H3V6z" />
        </svg>
      ),
    },
    {
      path: '/admin/messages',
      label: 'Messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },

    {
      path: '/admin/admins',
      label: 'Administrateurs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a4 4 0 01-4-4v-2a4 4 0 014-4h4a4 4 0 014 4v2a4 4 0 01-4 4H6z" />
        </svg>
      ),
      superuser: true,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="text-xl font-bold text-primary">
            ZOONOVA
          </Link>

          {/* Navigation Links */}
           <div className="hidden md:flex items-center space-x-1">
             {navItems.map((item) => {
               // Cache les liens superuser si l'utilisateur n'est pas superuser
               if (item.superuser && !user?.is_superuser) return null;
               
               return (
                 <Link
                   key={item.path}
                   to={item.path}
                   className={`px-4 py-2 transition flex items-center space-x-2 border rounded-lg relative ${
                     isActive(item.path)
                       ? 'text-primary border-primary'
                       : 'text-gray-600 border-transparent hover:text-primary hover:border-primary'
                   }`}
                 >
                   {item.icon}
                   <span className="text-sm">{item.label}</span>
                   
                   {/* Badge pour Commandes non livrées */}
                   {item.path === '/admin/orders' && undeliveredCount > 0 && (
                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                       {undeliveredCount > 99 ? '99+' : undeliveredCount}
                     </span>
                   )}
                   
                   {/* Badge pour Messages non lus */}
                   {item.path === '/admin/messages' && unreadMessagesCount > 0 && (
                     <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                       {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                     </span>
                   )}
                 </Link>
               );
             })}
           </div>

          {/* User Name & Icons */}
          <div className="flex items-center space-x-4">
            {/* User Name */}
            <span className="hidden sm:block text-sm font-medium text-gray-900">
              {user?.first_name}
            </span>

            {/* Profile Icon */}
            <Link
              to="/admin/settings"
              className="text-gray-600 hover:text-primary transition p-2 rounded-lg hover:bg-gray-100"
              title="Paramètres du compte"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-red-600 hover:text-red-700 transition p-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Déconnexion"
            >
              {loggingOut ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
         {isOpen && (
           <div className="md:hidden pb-4 border-t border-gray-200">
             <div className="flex flex-col space-y-2 pt-4 px-4">
               {navItems.map((item) => {
                 // Cache les liens superuser si l'utilisateur n'est pas superuser
                 if (item.superuser && !user?.is_superuser) return null;
                 
                 return (
                   <Link
                     key={item.path}
                     to={item.path}
                     onClick={() => setIsOpen(false)}
                     className={`px-4 py-2 text-sm transition flex items-center space-x-2 border rounded-lg relative ${
                       isActive(item.path)
                         ? 'text-primary border-primary bg-gray-50'
                         : 'text-gray-600 border-transparent hover:text-primary hover:border-primary'
                     }`}
                   >
                     {item.icon}
                     <span>{item.label}</span>
                     
                     {/* Badge pour Commandes non livrées */}
                     {item.path === '/admin/orders' && undeliveredCount > 0 && (
                       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                         {undeliveredCount > 99 ? '99+' : undeliveredCount}
                       </span>
                     )}
                     
                     {/* Badge pour Messages non lus */}
                     {item.path === '/admin/messages' && unreadMessagesCount > 0 && (
                       <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                         {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                       </span>
                     )}
                   </Link>
                 );
               })}
             </div>
           </div>
         )}
      </div>
    </nav>
  );
}
