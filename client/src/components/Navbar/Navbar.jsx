import "./Navbar.css";
import {Link, useLocation} from "react-router-dom";
import {useState} from "react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    {
      title: "Home",
      link: "/"
    },
    {
      title: "Modules",
      link: "/previous-courses"
    },
    {
      title: "Input Modules",
      link: "/select-course"
    },
    {
      title: "Simulations",
      link: "/simulations"
    }
  ]

  return (
      <div className="cont">
        <div className="container">
          <div className="logo">
            <h1 style={{ fontFamily: "Benzin-Medium" }}>Sweat</h1>
          </div>
          <div className="links">
            <ul>
              {navItems?.map((item, index) =>
                <li key={index}>
                  <Link
                      to={item?.link}
                      className={location?.pathname === item?.link ? 'link-active' : 'link'}
                  >
                    {item?.title}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
