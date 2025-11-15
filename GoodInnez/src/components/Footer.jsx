import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Good Innez</h3>
          <p>axd'jDxrjS$-D-MjbcbuA5sf"SO.5ckJB js.lsic dkb</p>
          <div className="app-buttons">
            <button className="app-btn">▶ Playstore</button>
            <button className="app-btn">⚫ Appstore</button>
          </div>
        </div>

        <div className="footer-section">
          <h4>COMPANY</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#legal">Legal Information</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#blogs">Blogs</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>HELP CENTER</h4>
          <ul>
            <li><a href="#find-hotel">Find a Hotel</a></li>
            <li><a href="#find-activities">Find Activities</a></li>
            <li><a href="#why-us">Why Us?</a></li>
            <li><a href="#faqs">FAQs</a></li>
            <li><a href="#guides">Guides</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>CONTACT INFO</h4>
          <p>Phone: 6969696969</p>
          <p>Email: admin@goodinnez@good.inn</p>
          <p>Location: Paarl, Cebu city</p>
          <div className="social-links">
            <a href="#facebook">f</a>
            <a href="#twitter">𝕏</a>
            <a href="#instagram">📷</a>
            <a href="#linkedin">in</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Good-Innez | All rights reserved</p>
      </div>
    </footer>
  )
}
