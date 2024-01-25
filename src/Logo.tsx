// src/components/Logo.tsx
import React from "react";
import logoImage from "./Logo.png"; // Replace with the actual path to your logo image

        
interface LogoProps{
  height?: string | number 
}

const Logo: React.FC<LogoProps> = ({height}: LogoProps) => {
    const logoStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: height || "100px", // Adjust the height as needed
        padding: '10px',
      };
  const loglImgStyle = {
    height: '100%'
  }
   
  return (
    <div style={logoStyle}>
      <img src={logoImage}  style={loglImgStyle} alt="Logo" />
    </div>
  );
};

export default Logo;
