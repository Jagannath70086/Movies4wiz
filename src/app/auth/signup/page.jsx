"use client";
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Notification from "../../../components/signup/notification";
import { success, fail } from "../../../assets/pictures/iExport";
import {
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "../../../assets/icons/iExport";

const firstVariants = {
  hidden: {
    opacity: 0,
    x: "-100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      duration: 1.3,
      stiffness: 120,
      ease: "easeInOut",
      when: "beforeChildren",
    },
  },
};
const secondVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      staggerChildren: 0.3,
      ease: "easeInOut",
    },
  },
};
const thirdVariants = {
  hidden: {
    opacity: 0,
    y: "-12px",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      ease: "easeInOut",
    },
  },
};
const SignUp = () => {
  const router = useRouter();
  const [checkPass, setCheckPass] = useState({
    password: true,
    confirmPassword: true,
  });
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [image, setImage] = useState({
    username: true,
    email: true,
    password: true,
    confirmPassword: true,
  });
  const input = {
    username: "Name at least 5 characters",
    email: "Email must be valid",
    password: {
      no1: "At least 12 characters",
      no2: "At least one uppercase letter",
      no3: "At least one lowercase letter",
      no4: "At least one number",
      no5: "At least one special character",
    },
    confirmPassword: "Passwords must match",
  };
  const validate = (obj, type) => {
    if (type === "username") {
      return obj.length >= 5;
    } else if (type === "email") {
      return obj.includes("@") && obj.includes(".");
    } else if (type === "password") {
      return (
        obj.length >= 12 &&
        obj.match(/[A-Z]/g) &&
        obj.match(/[a-z]/g) &&
        obj.match(/[0-9]/g) &&
        obj.match(/[^a-zA-Z\d]/g) &&
        obj.match(/[@#$%^&*()_+]/g)
      );
    } else if (type === "confirmPassword") {
      return obj === form.password;
    }
  };
  const submitForm = async (e) => {
    if (
      validate(form.username, "username") &&
      validate(form.email, "email") &&
      validate(form.password, "password") &&
      validate(form.confirmPassword, "confirmPassword")
    ) {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:8000/api/auth/user", {
          method: "POST",
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const validData = await response.json();
          alert(validData.authToken);
          setToken(validData.authToken);
          alert("success");
          router.push("/");
        } else if (response.status === 403) {
          alert("User already exists");
        } else if (response.status === 400) {
          alert("Invalid data");
        }
      } catch (error) {
        alert(error);
      }
    } else {
    }
  };

  return (
    <div className="h-[calc(95vh-40px)] w-screen bg-[rgba(182,255,209,0.7)] flex flex-col pt-10 items-center select-none">
      <motion.div
        variants={firstVariants}
        initial="hidden"
        animate="visible"
        className={`h-[75vh] w-[92vw] xl:w-[60vw] bg-[#1b2c3a] rounded-xl justify-center flex mx-5 shadow-black shadow-lg`}
      >
        <motion.form
          onSubmit={(e) => submitForm(e)}
          variants={secondVariants}
          className="flex flex-col items-center w-[50vh] lg:w-1/2 md:ml-auto"
        >
          <motion.span
            variants={thirdVariants}
            className="text-4xl sm:text-3xl lg:text-[40px] font-semibold mt-10 mb-4 lg:mt-[56px] lg:mb-[24px]"
          >
            Get Started now
          </motion.span>
          {Object.keys(input).map((item, i) => {
            return (
              <motion.div
                key={i}
                className="flex md:w-[40vw] xl:w-[30vw] items-center"
              >
                <motion.input
                  variants={thirdVariants}
                  type={
                    item === "username"
                      ? "text"
                      : item === "email"
                      ? "email"
                      : item === "password"
                      ? !checkPass.password
                        ? "text"
                        : "password"
                      : !checkPass.confirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder={
                    item !== "confirmPassword"
                      ? item !== "username"
                        ? item.slice(0, 1).toUpperCase() + item.slice(1)
                        : "Name"
                      : "Confirm Password"
                  }
                  className="p-3 rounded-xl bg-transparent border-2 w-[75vw] border-gray-500 mt-[15px] md:w-[36vw] xl:w-[22vw] xl:ml-16 "
                  value={form[item]}
                  required
                  onChange={(e) => setForm({ ...form, [item]: e.target.value })}
                />
                <Image
                  src={validate(form[item], item) ? success : fail}
                  height={20}
                  alt="Error"
                  width={20}
                  onClick={() => setImage({ ...image, [item]: !image[item] })}
                  className={`${
                    form[item].length > 0 ? "block" : "hidden"
                  } w-5 h-5 ml-3 mt-2 hover:cursor-pointer`}
                />
                {item === "password" || item === "confirmPassword" ? (
                  <motion.div
                    variants={thirdVariants}
                    onClick={() =>
                      setCheckPass({ ...checkPass, [item]: !checkPass[item] })
                    }
                    className="absolute right-[80px] sm:right-24 md:right-[125px] mt-4 lg:right-28 xl:right-[5vw] w-5 h-5 hover:cursor-pointer"
                  >
                    {checkPass[item] ? (
                      <AiOutlineEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </motion.div>
                ) : (
                  ""
                )}
                {form[item].length > 0 && (
                  <Notification
                    text={input[item]}
                    vis={image[item]}
                    bg={validate(form[item], item)}
                    type={item}
                    validation={form[item]}
                  />
                )}
              </motion.div>
            );
          })}
          <motion.button
            type="submit"
            variants={thirdVariants}
            whileHover={{
              scale: [1, 1.2, 1, 1.2, 1],
              color: "#fc5347",
              borderColor: "#fc5347",
              letterSpacing: "4px",
            }}
            className="rounded-xl border-2 p-3 my-3 mt-7 tracking-widest uppercase"
          >
            Sign Up
          </motion.button>
          <motion.span
            variants={thirdVariants}
            className="ml-2 text-xs
            required absolute bottom-[8vh] lg:bottom-[7.6vh] bg-[#1b2c3a] px-2 z-10 tracking-widest "
          >
            Already Signed Up?
          </motion.span>
          <motion.hr
            variants={thirdVariants}
            className="h-1 bottom-[8.5vh] lg:bottom-[8vh] md:w-[30vw] lg:w-[20vw] absolute w-[60vw]"
          />
          <motion.div
            variants={thirdVariants}
            className="mb-1 absolute bottom-[4vh] lg:bottom-[2vh] justify-center flex w-[60vw]"
          >
            <Link href="/auth/login" className="text-xs  tracking-widest">
              Click Here to Login
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default SignUp;
