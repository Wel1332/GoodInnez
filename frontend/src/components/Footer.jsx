import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Column 1: Brand Only (Buttons Removed) */}
        <div className="footer-col brand-col">
          <h2 className="footer-logo">Good Innez</h2>
          <p className="footer-desc">
            Your premium partner for the best stays and experiences in Cebu City.
          </p>
        </div>

        {/* Column 2: Company */}
        <div className="footer-col">
          <h3>COMPANY</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Legal Information</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Blogs</a></li>
          </ul>
        </div>

        {/* Column 3: Help Center */}
        <div className="footer-col">
          <h3>HELP CENTER</h3>
          <ul>
            <li><a href="#">Find a Hotel</a></li>
            <li><a href="#">Find Activities</a></li>
            <li><a href="#">Why Us?</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Guides</a></li>
          </ul>
        </div>

        {/* Column 4: Contact Info Only (Socials Removed) */}
        <div className="footer-col contact-col">
          <h3>CONTACT INFO</h3>
          <p>Phone: 0969696969</p>
          <p>Email: admin.goodinnez@gmail.com</p>
          <p>Location: Pasil, Cebu City</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Good Innez | All rights reserved</p>
      </div>
    </footer>
  );
}