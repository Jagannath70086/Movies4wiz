"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import * as Icon from "../assets/icons/iExport";
import * as Pictures from "../assets/pictures/iExport";
import {Authentication} from "../context/Authentication";
import Cookies from 'js-cookie';

const firstVariants = {
  initial: {
    opacity: 0,
    y: "-100vh",
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
};
const secondVariants = {
  initial: {
    opacity: 0,
    x: 12,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      staggerChildren: 0.2,
    },
  },
};
const rightVariants = {
  initial: {
    opacity: 0,
    x: -12,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      staggerChildren: 0.2,
    },
  },
};
const thirdVariants = {
  initial: {
    opacity: 0,
    x: "100vw",
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
    },
  },
};
const no4Variants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  animate: {
    opacity: 1,
    x: 0,
  },
};

const Navbar = () => {
  const {isAuthenticated, user, setIsAuthenticated, setUser} = Authentication();
  const pathname = usePathname();
  const [isLoginAuthenticated, setIsLoginAuthenticated] = useState(isAuthenticated)
  const [LoginUser, setLoginUser] = useState(user)
  const [controls, setControls] = useState({
    menuIcon: true,
    searchIcon: false,
    searchIsVisible: false,
    bigScreen: true,
    searchInput: "", //logic todo
    selected: "home",
  });
  const navigationItems = [
    { label: "Home", icon: "IoHomeOutline" },
    { label: "Movies", icon: "BiMoviePlay" },
    { label: "Series", icon: "FaStripeS" },
    { label: "Kids", icon: "TbMoodKidFilled" },
    { label: "Upcoming", icon: "MdUpcoming" },
    { label: "Help", icon: "BiSolidHelpCircle" },
  ];
  useEffect(() => {
    document.title = "Movies4WIZ | Login";
    if (!isLoginAuthenticated) {
    
      const ValidateUser = async () => {
      const authToken = await Cookies.get('authToken');
      try {
        const response = await fetch("http://localhost:3000/api/fetchUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authToken: authToken,
          },
        });
        if (response.status === 200) {
          setUser(await response.json())
          
          
          setIsAuthenticated(true)
        }
      } catch (error) {}
    }
    ValidateUser()
  }}, []);
  useEffect(() => {
    setLoginUser(user)
    setIsLoginAuthenticated(isAuthenticated)
  }, [isAuthenticated, user])
  useEffect(() => {
    if (!controls.menuIcon) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [controls.menuIcon]);
  useEffect(() => {
    if (pathname === "/") {
      setControls({ ...controls, selected: "home" });
    } else {
      setControls({ ...controls, selected: pathname.slice(1) });
    }
  }, [pathname]);

  const searchPerform = () => {
    //to_do
    console.log("search");
  };
  const performLogout = async () => {
    Cookies.remove('authToken');
    setIsAuthenticated(false)
    setUser(null)
  }
  useEffect(() => {
    if (window.innerWidth > 1279) {
      setControls({ ...controls, bigScreen: true });
    } else if (window.innerWidth < 1281) {
      setControls({ ...controls, bigScreen: false });
    }
  }, []);
  return (
    <>
      <motion.nav
        variants={firstVariants}
        initial="initial"
        animate="animate"
        className=" w-screen relative bg-[#1b2c3a] flex justify-end py-2 shadow-lg shadow-black px-3 items-center"
      >
        <Link href={"/"}>
          <Image src={Pictures.Logo} alt="logo" height={30} className="mx-4" />
        </Link>
        <ul className="hidden xl:flex items-center">
          {navigationItems.map((item, index) => {
            return (
              <motion.li
                key={index}
                variants={secondVariants}
                whileHover={{ scale: [1, 1.2, 1], opacity: [0.6, 0.6, 1] }}
                className={`mx-3 ${
                  controls.selected === item.label.toLowerCase()
                    ? "text-pink-500"
                    : "text-white"
                }`}
              >
                <Link
                  className="flex flex-col items-center"
                  onClick={() => setControls({ ...controls, menuIcon: true })}
                  href={`/${
                    item.label.toLowerCase() !== "home"
                      ? item.label.toLowerCase()
                      : "/"
                  }`}
                >
                  {React.createElement(Icon[item.icon], {
                    size: 23,
                    className: "mx-6 my-1",
                  })}
                  <label className="text-xs cursor-pointer">{item.label}</label>
                </Link>
              </motion.li>
            );
          })}
          <motion.li
            variants={secondVariants}
            whileHover={{ scale: [1, 1.2, 1], opacity: [0.6, 0.6, 1] }}
            className="mx-3"
          >
            <Link
              className="flex flex-col items-center"
              href={"https://www.buymeacoffee.com/movies4wiz"}
            >
              <Icon.FaDonate size={23} className="mx-6 my-1" />
              <label className="text-xs cursor-pointer">Support Us</label>
            </Link>
          </motion.li>
        </ul>
        <div className="flex h-12 ml-auto">
          {!controls.bigScreen && (
            <input
              onChange={(e) =>
                setControls({ ...controls, searchInput: e.target.value })
              }
              onFocus={() => setControls({ ...controls, searchIcon: true })}
              onBlur={() =>
                !controls.searchInput
                  ? setControls({ ...controls, searchIcon: false })
                  : ""
              }
              type="text"
              placeholder="Search"
              className=" w-[230px] h-12 bg-transparent border-2 border-pink-500 rounded-xl p-3 outline-none"
            />
          )}
          <AnimatePresence>
            {controls.bigScreen && controls.searchIsVisible && (
              <motion.input
                variants={thirdVariants}
                exit={{ x: "100vw", opacity: 0, transition: { duration: 1 } }}
                onChange={(e) =>
                  setControls({ ...controls, searchInput: e.target.value })
                }
                onFocus={() => setControls({ ...controls, searchIcon: true })}
                onBlur={() =>
                  !controls.searchInput
                    ? setControls({ ...controls, searchIcon: false })
                    : ""
                }
                type="text"
                placeholder="Search"
                className=" w-[230px] h-12 bg-transparent border-2 border-pink-500 rounded-xl p-3 outline-none"
              />
            )}
          </AnimatePresence>
          <button
            onClick={() => {
              !controls.searchIcon
                ? controls.menuIcon
                  ? setControls({ ...controls, menuIcon: false })
                  : setControls({ ...controls, menuIcon: true })
                : searchPerform();
            }}
            className="ml-3 xl:hidden"
          >
            {controls.searchIcon ? (
              <Icon.BiSearch size={25} />
            ) : controls.menuIcon ? (
              <Icon.IoMenu size={25} />
            ) : (
              <Icon.RxCross1 size={25} />
            )}
          </button>
          <motion.button
            variants={rightVariants}
            className="hidden xl:block mx-3"
            onClick={() =>
              controls.searchInput
                ? searchPerform()
                : controls.searchIsVisible
                ? setControls({ ...controls, searchIsVisible: false })
                : setControls({ ...controls, searchIsVisible: true })
            }
          >
            <Icon.BiSearch size={25} />
          </motion.button>
        </div>
        <div className="hidden xl:flex items-center justify-center">
          <motion.div
            variants={rightVariants}
            className={`${isLoginAuthenticated ? "hidden" : "flex"}`}
          >
            <Link
              href={"/auth/signup"}
              onClick={() => setControls({ ...controls, menuIcon: true })}
              className="uppercase flex justify-center tracking-widest bg-red-600 items-center h-12 px-2.5 rounded-xl ml-3  hover:tracking-[0.25em] duration-500 hover:opacity-80"
            >
              Sign Up
            </Link>
            <Link
              onClick={() => setControls({ ...controls, menuIcon: true })}
              href={"/auth/login"}
              className="uppercase mx-2 justify-center tracking-widest bg-[#f18354] items-center h-12 px-4 rounded-xl flex hover:tracking-[0.25em] duration-500 hover:opacity-80"
            >
              Login
            </Link>
          </motion.div>
          <motion.div
            variants={rightVariants}
            className={`${
              !isLoginAuthenticated ? "hidden" : "flex"
            } items-center justify-center`}
          >
            <button onClick={() => performLogout()} className="uppercase mx-2 justify-center tracking-widest bg-red-600 items-center h-12 px-4 rounded-xl flex hover:tracking-[0.25em] duration-500 hover:opacity-80">
              Logout
            </button>
          </motion.div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {!controls.menuIcon && (
          <>
            <div className="absolute z-[5] h-screen w-screen bg-[rgba(10,10,10,0.65)]"></div>
            <motion.aside
              variants={no4Variants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, x: "-100vw" }}
              className="h-[480px] rounded-xl z-10 absolute p-4 pt-6 w-[300px] bg-black text-white"
            >
              <ul>
                {navigationItems.map((item, i) => {
                  return (
                    <li
                      key={i}
                      className={`${
                        controls.selected === item.label.toLowerCase()
                          ? "bg-[rgb(39,38,38)]"
                          : "bg-black"
                      } rounded-xl h-[50px] flex items-center`}
                    >
                      <Link
                        className="flex items-center"
                        onClick={() =>
                          setControls({ ...controls, menuIcon: true })
                        }
                        href={`/${
                          item.label.toLowerCase() !== "home"
                            ? item.label.toLowerCase()
                            : "/"
                        }`}
                      >
                        {React.createElement(Icon[item.icon], {
                          size: 20,
                          className: "mx-6",
                        })}
                        <label className="mx-4 text-xl">{item.label}</label>
                      </Link>
                    </li>
                  );
                })}
                <li
                  className={`${
                    controls.selected === "Support"
                      ? "bg-[rgb(39,38,38)]"
                      : "bg-black"
                  } rounded-xl h-[50px] flex items-center`}
                >
                  <a
                    className="flex items-center"
                    target="_blank"
                    href={"https://www.buymeacoffee.com/movies4wiz"}
                  >
                    <Icon.FaDonate size={20} className="mx-6" />
                    <label className="mx-4 text-xl">Support Us</label>
                  </a>
                </li>
                <div className={`${isLoginAuthenticated ? "hidden" : "flex"}`}>
                  <Link
                    href={"/auth/signup"}
                    onClick={() => setControls({ ...controls, menuIcon: true })}
                    className="uppercase flex mt-4 justify-center tracking-widest bg-red-600 items-center h-12 rounded-xl mx-3 w-[110px]"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href={"/auth/login"}
                    onClick={() => setControls({ ...controls, menuIcon: true })}
                    className="uppercase mx-2 mt-4 w-[100px] justify-center tracking-widest bg-red-600 items-center h-12 rounded-xl flex"
                  >
                    Login
                  </Link>
                </div>
                <div
                  className={`${
                    !isLoginAuthenticated ? "hidden" : "flex"
                  } items-center justify-center`}
                >
                  <button onClick={() => performLogout()} className="uppercase mx-2 mt-4 w-[150px] justify-center tracking-widest bg-red-600 items-center h-12 rounded-xl flex">
                    Logout
                  </button>
                </div>
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
