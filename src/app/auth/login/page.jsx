"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as Picture from "../../../assets/pictures/iExport";
import * as Icon from "../../../assets/icons/iExport";
import Cookies from 'js-cookie';
import {Authentication} from "../../../context/Authentication";

const firstVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      when: "beforeChildren",
      staggerChildren: 0.2,
      type: "tween",
    },
  },
};
const secondVariants = {
  initial: {
    opacity: 0,
    y: -12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      when: "beforeChildren",
      type: "tween",
    },
  },
};
const alertVariants = {
  initial: { x: "100vw", opacity: 0 },
  animate: {
    x: "0",
    opacity: 1,
    transition: { duration: 0.4, type: "tween" },
  },
};

const Page = () => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = Authentication()
  const [isLoginLoading, setLoginLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPassValid, setIsPassValid] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emptyDetailsError, setEmptyDetailsError] = useState(false);
  const [alertLogin, setAlertLogin] = useState({isVisible: false, message: ''});
  const [IsLoginSuccess, setIsLoginSuccess] = useState(false);
  const router = useRouter();
  const [controls, setControls] = useState({
    checkbox: false,
    emailValidator: new RegExp(
      "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
    ),
    emailInput: "",
    passInput: "",
  });
  useEffect(() => {
    document.title = "Movies4WIZ | Login";
    if (isAuthenticated) {
      router.push('/')
    } else {
    const authToken = Cookies.get('authToken');
    const ValidateUser = async () => {
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
          router.push("/");
          setIsAuthenticated(true)
        }
        setIsLoginSuccess(false)
      } catch (error) {}
    }
    ValidateUser()
  }}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEmailValid && isPassValid) {
      setEmptyDetailsError(false);
      const submitData = async () => {
        try {
          setLoginLoading(true)
          const Body = JSON.stringify({
            email: controls.emailInput,
            password: controls.passInput,
          });
          const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: Body,
          });
            const actResponse = await response.json();
            setLoginLoading(false)
            setAlertLogin({isVisible: true, message: actResponse.message})
            if (response.status === 200) {
              setIsLoginSuccess(true)
              const authToken = Cookies.get('authToken');
              localStorage.setItem('authToken', authToken);
              setIsAuthenticated(true)
              const interval = setInterval(()=>{
                router.push('/')
              },5000)
              return () => clearInterval(interval)
            }
        } catch (error) {}
      };
      submitData();
    } else {
      setEmptyDetailsError(true);
    }
  };
  const validateData = (data, type) => {
    if (type === "email") {
      if (controls.emailValidator.test(data)) {
        setIsEmailValid(true);
      } else {
        setIsEmailValid(false);
      }
    } else if (type === "pass") {
      if (data.length >= 8) {
        setIsPassValid(true);
      } else {
        setIsPassValid(false);
      }
    }
  };
  useEffect(() => {
    validateData(controls.emailInput, "email");
    validateData(controls.passInput, "pass");
  }, [controls.emailInput, controls.passInput]);
  useEffect(() => {
    const errorClearTimeout1 = setTimeout(() => {
      setEmailError(false);
    }, 5000);

    return () => {
      clearTimeout(errorClearTimeout1);
    };
  }, [emailError]);
  useEffect(() => {
    const errorClearTimeout2 = setTimeout(() => {
      setPasswordError(false);
    }, 5000);

    return () => {
      clearTimeout(errorClearTimeout2);
    };
  }, [passwordError]);
  useEffect(() => {
    const errorClearTimeout3 = setTimeout(() => {
      setEmptyDetailsError(false);
    }, 5000);

    return () => {
      clearTimeout(errorClearTimeout3);
    };
  }, [emptyDetailsError]);
  useEffect(() => {
    const errorClearTimeout4 = setTimeout(() => {
      setAlertLogin({...alertLogin, isVisible: false});
    }, 5000);

    return () => {
      clearTimeout(errorClearTimeout4);
    };
  }, [emptyDetailsError]);
  return (
    <div className="flex flex-col items-center w-screen h-[calc(100vh-60px)] justify-between bg-green-300">
      {isLoginLoading && (<div className="absolute z-[5] h-screen w-screen bg-[rgba(10,10,10,0.65)]"></div>)}
      <div className="mt-3">
        <AnimatePresence>
          {emailError && (
            <motion.div
              variants={alertVariants}
              initial="initial"
              animate="animate"
              exit={{
                x: "-100vw",
                opacity: 0,
                transition: { type: "tween", duration: 0.5 },
              }}
            >
              <motion.div
                initial={{ width: "100vw" }}
                animate={{ width: "0vw" }}
                transition={{ duration: 5, ease: "easeOut" }}
                className={`h-2 -my-1 ${
                  isEmailValid ? "bg-green-800" : "bg-red-800"
                } `}
              ></motion.div>
              <div
                className={`flex w-screen items-center p-4 ${
                  isEmailValid ? "text-green-400" : "text-red-400"
                } bg-gray-800`}
              >
                <Icon.FaInfoCircle size={27} />
                <div className="ml-3 text-sm font-medium">
                  {isEmailValid
                    ? `Your Email "${controls.emailInput}" is valid.`
                    : `Email "${controls.emailInput}" is invalid. Check Your Email.`}
                </div>
                <button
                  type="button"
                  onClick={() => setEmailError(false)}
                  className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 bg-gray-800 text-red-400 hover:bg-gray-700"
                >
                  <Icon.RxCross1 size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {passwordError && (
            <motion.div
              variants={alertVariants}
              initial="initial"
              animate="animate"
              exit={{
                x: "-100vw",
                opacity: 0,
                transition: { type: "tween", duration: 0.5 },
              }}
              className="mt-0.5"
            >
              <motion.div
                initial={{ width: "100vw" }}
                animate={{ width: "0vw" }}
                transition={{ duration: 5, ease: "easeOut" }}
                className={`h-2 -my-1 ${
                  isPassValid ? "bg-green-800" : "bg-red-800"
                } `}
              ></motion.div>
              <div
                className={`flex w-screen items-center p-4 mt-0.5 ${
                  isPassValid ? "text-green-400" : "text-red-400"
                } bg-gray-800`}
              >
                <Icon.FaInfoCircle size={27} />
                <div className="ml-3 text-sm font-medium">
                  {isPassValid
                    ? `Your Password of length "${controls.passInput.length}" is valid.`
                    : `Password must be greater than 8 characters and the same through which you have registered.`}
                </div>
                <button
                  type="button"
                  onClick={() => setPasswordError(false)}
                  className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 bg-gray-800 text-red-400 hover:bg-gray-700"
                >
                  <Icon.RxCross1 size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {emptyDetailsError && (
            <motion.div
              variants={alertVariants}
              initial="initial"
              animate="animate"
              exit={{
                x: "-100vw",
                opacity: 0,
                transition: { type: "tween", duration: 0.5 },
              }}
              className="mt-0.5"
            >
              <motion.div
                initial={{ width: "100vw" }}
                animate={{ width: "0vw" }}
                transition={{ duration: 5, ease: "easeOut" }}
                className="h-2 -my-1  bg-red-800"
              ></motion.div>
              <div
                className={`flex w-screen items-center p-4 mt-0.5 text-red-400 bg-gray-800`}
              >
                <Icon.FaInfoCircle size={27} />
                <div className="ml-3 text-sm font-medium">
                  Either Email or Password or both is not valid. Please try again with
                  valid details.
                </div>
                <button
                  type="button"
                  onClick={() => setEmptyDetailsError(false)}
                  className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 bg-gray-800 text-red-400 hover:bg-gray-700"
                >
                  <Icon.RxCross1 size={20} />
                </button>
              </div>
            </motion.div>
          )}
          {alertLogin.isVisible && (
            <motion.div
              variants={alertVariants}
              initial="initial"
              animate="animate"
              exit={{
                x: "-100vw",
                opacity: 0,
                transition: { type: "tween", duration: 0.5 },
              }}
              className="mt-0.5"
            >
              <motion.div
                initial={{ width: "100vw" }}
                animate={{ width: "0vw" }}
                transition={{ duration: 5, ease: "easeOut" }}
                className={`h-2 -my-1  bg-red-800  ${
                  IsLoginSuccess ? "bg-green-800" : "bg-red-800"
                }`}
              ></motion.div>
              <div
                className={`flex w-screen items-center p-4 mt-0.5 text-red-400 bg-gray-800 ${
                  IsLoginSuccess ? "text-green-400" : "text-red-400"
                }`}
              >
                <Icon.FaInfoCircle size={27} />
                <div className="ml-3 text-sm font-medium">
                  {alertLogin.message}
                </div>
                <button
                  type="button"
                  onClick={() => setEmptyDetailsError(false)}
                  className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 bg-gray-800 text-red-400 hover:bg-gray-700"
                >
                  <Icon.RxCross1 size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.form
        variants={firstVariants}
        initial="initial"
        animate="animate"
        onSubmit={handleSubmit}
        className="h-[64vh] bg-[#1b2c3a] w-[90vw] lg:w-[70vw] xl:w-[60vw] mb-28 shadow-black p-6 shadow-lg justify-center rounded-xl flex md:justify-end"
      >
        <div className="flex flex-col items-center justify-center mr-4">
          <motion.h1
            variants={secondVariants}
            className="text-white text-4xl mb-4 uppercase tracking-widest"
          >
            Login
          </motion.h1>
          <div className="flex items-center justify-start w-full">
            <motion.input
              variants={secondVariants}
              onChange={(e) =>
                setControls({ ...controls, emailInput: e.target.value })
              }
              type="text"
              placeholder="Email"
              className="px-4 py-2 w-[300px] bg-transparent border-2 mt-5 rounded-[30px] outline-none"
            />
            <motion.label variants={secondVariants}>
              <Icon.AiOutlineUser className="-ml-10  mr-8 mt-4" size={20} />
            </motion.label>
            {controls.emailInput && (
              <Image
                src={isEmailValid ? Picture.success : Picture.fail}
                height={20}
                alt="error"
                className="mt-4 cursor-pointer"
                onClick={() => setEmailError(!emailError)}
              />
            )}
          </div>
          <div className="flex items-center justify-start w-full">
            <motion.input
              variants={secondVariants}
              onChange={(e) =>
                setControls({ ...controls, passInput: e.target.value })
              }
              type={controls.checkbox ? "text" : "password"}
              placeholder="Password"
              className="px-4 py-2 w-[300px] bg-transparent border-2 mt-5 rounded-[30px] outline-none"
            />
            <motion.label variants={secondVariants}>
              <Icon.RiLockPasswordLine className="-ml-10 mr-8 mt-4" size={20} />
            </motion.label>
            {controls.passInput && (
              <Image
                src={isPassValid ? Picture.success : Picture.fail}
                height={20}
                alt="error"
                className="mt-4 cursor-pointer"
                onClick={() => setPasswordError(!passwordError)}
              />
            )}
          </div>
          <motion.div
            variants={secondVariants}
            className="flex mt-2 ml-4 justify-start items-center w-[300px]"
          >
            <input
              type="checkbox"
              name="pass"
              onClick={() =>
                setControls({ ...controls, checkbox: !controls.checkbox })
              }
              onChange={() =>
                setControls({ ...controls, checkbox: !controls.checkbox })
              }
              checked={controls.checkbox ? true : false}
              id="pass"
              className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-300 rounded mr-3 outline-none cursor-pointer"
            />
            <label
              htmlFor="pass"
              className="outline-none appearance-none cursor-pointer text-gray-300"
            >
              Show Password
            </label>
          </motion.div>
          <motion.button
            variants={secondVariants}
            className="uppercase tracking-widest p-3 rounded-xl hover:tracking-[0.25em] duration-500 bg-orange-600 my-5"
            type="submit"
          >
            Login
          </motion.button>

          <motion.p
            variants={secondVariants}
            className="mt-10 flex flex-col text-center gap-3"
          >
            New User?<Link href="/auth/signup">Create a new Account</Link>
          </motion.p>
        </div>
      </motion.form>
    </div>
  );
};

export default Page;
