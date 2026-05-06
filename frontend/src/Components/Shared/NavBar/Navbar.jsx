import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaChevronDown, FaSignOutAlt, FaUserShield } from "react-icons/fa";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Mocked Auth (Replace with your actual hooks)
  const user = {
    email: "abdurrazzak@gmail.com",
    displayName: "Abdur Razzak",
    photoURL: "https://cdn-icons-png.flaticon.com/512/219/219986.png"
  };
  const LogOut = () => console.log("Logged out");

  const isAdmin = ["abdurrazzak118348@gmail.com", "alfat422@gmail.com"].includes(user?.email);

  const navItems = [
    { name: "Home", path: "/" },
    {
      name: "About",
      subItems: [
        { name: "About Us", path: "/about" },
        { name: "Mission & Vision", path: "/about/missionVision" },
      ],
    },
    {
      name: "Academic",
      subItems: [
        { name: "Result", path: "/result" },
        { name: "Exam Notice", path: "/academic/examNotice" },
        { name: "Academic Rules", path: "/academic/academicRules" },

      ],
    },
    {
      name: "Administration",
      subItems: [
        { name: "Chairman Message", path: "/administration/messageChairman" },
        { name: "Principal's Message", path: "/administration/messagePrincipal" },
        { name: "Hostel Incharge", path: "/administration/hostelIncharge" },
      ],
    },
    { name: "Admission", path: "/admission" },
    { name: "Contact", path: "/contact" },
    ...(isAdmin ? [{ name: "Admin", path: "/admin", icon: <FaUserShield /> }] : []),
  ];

  // Handle Navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 px-3 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg py-2" : "bg-gray-100 py-4"
        }`}
    >
      <div className=" max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="overflow-hidden rounded-full w-10 h-10 border-2 border-emerald-600 transition-transform group-hover:scale-110">
            <img
              src="/logo.png"
              alt="Logo"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-md md:text-xl font-extrabold tracking-tight text-gray-800 ">
            Islamic Research <span className="text-yellow-500">Center</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item, idx) => (
            <li
              key={idx}
              className="relative px-3 text-sm"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {item.subItems ? (
                <>
                  <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-yellow-500 transition-colors">
                    {item.name}
                    <FaChevronDown className={`text-[10px] transition-transform duration-300 ${hoveredIndex === idx ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.ul
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2"
                      >
                        {item.subItems.map((sub, i) => (
                          <li key={i}>
                            <NavLink
                              to={sub.path}
                              className={({ isActive }) => `
                                block px-5 py-2.5 text-sm transition-colors
                                ${isActive ? "bg-emerald-50 text-yellow-500 font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-yellow-500"}
                              `}
                            >
                              {sub.name}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    relative font-medium transition-colors
                    ${isActive ? "text-yellow-500" : "text-gray-700 hover:text-yellow-500"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-2">{item.icon} {item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute -bottom-[16px] left-0 right-0 h-0.5 bg-yellow-500 "
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* User Actions */}
        <div className="relative group hidden md:flex">
          {user ? (
            <div className="relative">
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full border-2 border-green-700 cursor-pointer overflow-hidden"
                title={user?.displayName || "User"}
              >
                <img
                  src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/219/219986.png"}
                  alt="user"
                  className="w-10 h-10 rounded-full border"
                />
              </div>

              {/* Hover Card */}
              <div
                className="
          absolute right-0 mt-3 w-52
          bg-white dark:bg-gray-800
          rounded-xl shadow-lg
          border dark:border-gray-700
          opacity-0 invisible
          group-hover:opacity-100 group-hover:visible
          transition-all duration-300
          z-50
        "
              >
                <div className="px-4 py-3 border-b dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="p-3">
                  <button
                    onClick={LogOut}
                    className="
              w-full py-2 text-sm font-medium
              rounded-lg
              text-white bg: bg-yellow-500 hover:bg-yellow-800 active:scale-95 transition-all shadow-lg

            "
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-white bg: bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-all shadow-lg"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
<button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-3xl text-gray-700"
          >
            {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-2/3 max-w-3xl bg-white shadow-2xl z-[110] p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-2xl"><HiX /></button>
            </div>

            <ul className="space-y-4">
              {navItems.map((item, idx) => (
                <li key={idx}>
                  {item.subItems ? (
                    <details className="group">
                      <summary className="list-none flex justify-between items-center font-semibold text-gray-800 py-2">
                        {item.name}
                        <FaChevronDown className="group-open:rotate-180 transition-transform" />
                      </summary>
                      <ul className="pl-4 mt-2 border-l-2 border-emerald-100 space-y-2">
                        {item.subItems.map((sub, i) => (
                          <li key={i}>
                            <NavLink
                              to={sub.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-1 text-gray-600"
                            >
                              {sub.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-semibold text-gray-800 py-2"
                    >
                      {item.name}
                    </NavLink>
                  )}
                </li>
              ))}
              <li>
                {user && (

                  <p className="font-semibold text-gray-800 py-2">User: {user.displayName}</p>

                )}
              </li>
            </ul>

            {user && (
              <div className="mt-8 pt-3 border-t">

                <button
                  onClick={LogOut}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl font-bold"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;