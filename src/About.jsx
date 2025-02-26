import { FaFacebookF } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { BsTwitterX } from "react-icons/bs";
import { FaCopyright, FaYoutube } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";
import { MdOndemandVideo } from "react-icons/md";

const About = () => {
  return (
    <div className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white py-10 px-6 md:px-20">
      <div className="grid md:grid-cols-3 gap-10 items-start">
        
        {/* Left - Brand & Address */}
        <div>
          <h1 className="text-4xl font-bold">Servify</h1>
          <p className="mt-4 text-lg">
            5/94 Dwaraka Nagar, Manali New Town, Chennai-600103
          </p>
        </div>

        {/* Middle - Social Media */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Social Media</h2>
          <div className="space-y-3 text-lg">
            <div className="flex items-center gap-3">
              <MdOndemandVideo className="text-red-500 text-xl" />
              @ServifyTeam
            </div>
            <div className="flex items-center gap-3">
              <BsTwitterX className="text-white text-xl" />
              @Servify/X
            </div>
            <div className="flex items-center gap-3">
              <FaFacebookF className="text-blue-600 text-xl" />
              Servify@facebook.com
            </div>
            <div className="flex items-center gap-3">
              <FaYoutube className="text-red-600 text-xl" />
              Servify@youtube.com
            </div>
          </div>
        </div>

        {/* Right - Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <div className="space-y-3 text-lg">
            <div className="flex items-center gap-3">
              <AiOutlineMail className="text-white text-xl" />
              ServifyTeam@gmail.com
            </div>
            <div className="flex items-center gap-3">
              <MdLocalPhone className="text-blue-500 text-xl" />
              +91-9342669768
            </div>
            <div className="flex items-center gap-3">
              <FaCopyright className="text-white text-xl" />
              All Copyrights Reserved 2025
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
