import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext";

const UserDropdown = () => {
  const { getCurrentUser, logout } = useAuthState();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    checkUser();
  }, [getCurrentUser]);

  useEffect(() => {
    // Click outside to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const avatarName = () => {
    if (!user || !user.username) return "";
    const firstName = user.username ? user.username[0].toUpperCase() : "";
    const lastName = user.lastname ? user.lastname[0].toUpperCase() : "";
    return `${firstName}${lastName ? lastName : ""}`;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User button */}
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-[#9F7933] rounded-full">
          <span className="text-xl text-white">{avatarName()}</span>
        </div>
        <span className="text-[#413620] font-medium pl-2">
          {user.username?.split(" ")[0]}
        </span>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <p className="font-medium text-[#413620]">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <nav className="py-2">
            {user.role === "ADMIN" && (
              <button
                onClick={() => handleNavigation("/administracion/dashboard")}
                className="flex items-center w-full px-4 py-2 text-left text-[#413620] hover:bg-[#FFE8C0] transition-colors"
              >
                <span className="material-symbols-outlined mr-2 text-[#9F7933]">
                  dashboard
                </span>
                Dashboard
              </button>
            )}

            <button
              onClick={() => handleNavigation("/profile")}
              className="flex items-center w-full px-4 py-2 text-left text-[#413620] hover:bg-[#FFE8C0] transition-colors"
            >
              <span className="material-symbols-outlined mr-2 text-[#9F7933]">
                person
              </span>
              Mi Perfil
            </button>

            <button
              onClick={() => handleNavigation("/reservas")}
              className="flex items-center w-full px-4 py-2 text-left text-[#413620] hover:bg-[#FFE8C0] transition-colors"
            >
              <span className="material-symbols-outlined mr-2 text-[#9F7933]">
                calendar_month
              </span>
              Historial de Reservas
            </button>

            <button
              onClick={() => handleNavigation("/favoritos")}
              className="flex items-center w-full px-4 py-2 text-left text-[#413620] hover:bg-[#FFE8C0] transition-colors"
            >
              <span className="material-symbols-outlined mr-2 text-[#9F7933]">
                favorite
              </span>
              Favoritos
            </button>

            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined mr-2">
                  logout
                </span>
                Cerrar Sesión
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;