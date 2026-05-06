import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../Components/Shared/NavBar/Navbar";
import Footer from "../Components/Shared/Footer/Footer";
import useTheme from "../hooks/useTheme";

const Layout = () => {
  const theme = useTheme();

  // Apply dark mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-300 ease-in-out font-inter">
      <Navbar />

      <main
        className="
          pt-16 lg:pt-16
          max-w-7xl mx-auto px-6
min-h-[calc(100vh-10rem)]
        "
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
