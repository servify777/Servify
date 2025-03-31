import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { RiAuctionFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import './Navbar.css';

const Navbar = () => {
  console.log("Navbar Running !")
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Initial screen size
  const [searchterm, setSearchterm] = useState("");
  const [isDropdownOpen,setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const Account_Type = localStorage.getItem('Account-Type');

  // Function to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Update whether the screen is mobile or not
      if (window.innerWidth >= 768) {
        setMenuOpen(false); // Ensure menu doesn't stay open on large screens
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup event listener on unmount
    };
  }, []);

  const handleRedirect = () => {
    if (searchterm.trim()) {
      navigate(`/search/${searchterm}`);
    }
  };

  const handleLogout = () => {
    try{
      localStorage.removeItem("token");
    localStorage.removeItem('email');
    }

    // eslint-disable-next-line no-unused-vars
    catch(error){
      console.error("Particular Elements in Local Storage are not Found !...");
      
    }
    navigate("/signup");
  };


  // Inline CSS styles
  const styles = {
    menuButton: {
      display: isMobile ? "block" : "none",
      color: "white",
      fontSize: "1.5rem",
      border: "none",
      background: "none",
      cursor: "pointer",
    },
    menu: {
      display: isMobile ? (menuOpen ? "flex" : "none") : "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      gap: "20px",
      width: "100%",
      marginLeft:'120px'
    },
    searchWrapper: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      color:'black',
      maxWidth: isMobile ? "100%" : "600px",
    },
    searchInput: {
      flexGrow: "1",
      padding: "8px",
      borderRadius: "4px 0 0 4px",
      border: "none",
      outline: "none",
      width:'300px'
    },
    searchButton: {
      backgroundColor: "#2563eb",
      color: "white",
      padding: "8px 12px",
      borderRadius: "0 4px 4px 0",
      cursor: "pointer",
      border: "none",
    },
    button: {
      color: "white",
      fontSize: "1rem",
      background: "none",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      margin:'10px',
    },
  };

  return (
    <nav style={{background:'linear-gradient(90deg, #A66EFE, #7AC7FF)'}} className="fixed top-6 left-0 z-50 pt-2 pb-2 pr-5 pl-5 w-full">
      <div className="flex max-w-max items-center justify-between">
        {/* Logo */}
        <div className="ml-2 text-white text-2xl mr-[120px] font-bold whitespace-nowrap" onClick={()=>navigate('/')}>Servify</div>

        {/* Hamburger Menu for Small Screens */}
        <button
          style={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Navbar Items */}
        <div style={styles.menu}>
          {/* Search Box */}
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search..."
              style={styles.searchInput}
              value={searchterm}
              onChange={(e) => setSearchterm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRedirect()}
            />
            <button style={styles.searchButton} className="rounded-2xl" onClick={handleRedirect}>
              Search
              </button>     

          </div>
        </div>
        <RiAuctionFill size={55} strokeWidth={3} className="space" onClick={()=> navigate('/auctions')}/>
        <div className="relative">
          <FontAwesomeIcon icon={faUser} className="space" size={55} strokeWidth={3} onClick={()=>setIsDropdownOpen(!isDropdownOpen)}/>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 w-40 text-gray-500 rounded-lg shadow-xl" style={{background:'rgba(255,255,255,0.5)'}}>
                  <button className="new-font block px-4 py-2 text-center hover:text-black" onClick={()=>{navigate('/settings')}}>Settings</button>
                  <button className="new-font block px-4 py-2 text-center hover:text-black" onClick={()=> navigate('/help')}>Help</button>
                  <button className="new-font block px-4 py-2 text-center hover:text-black" onClick={()=>{navigate('/about')}}>About Us</button>
                  {Account_Type === 'client' ? <button className="new-font block px-4 py-2 text-center hover:text-black text-sm" onClick={()=>{navigate('/add')}}>Add Your Project</button> : null}
                  </div>
            )}
          </div>
        {/* <MdAccountCircle size={55} strokeWidth={3}  className="space"/> */}
        <FiLogOut size={55} strokeWidth={3} className="space" onClick={handleLogout}/>
      </div>
    </nav>
  );
};

export default Navbar;
