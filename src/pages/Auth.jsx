import { useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import AuthLeftPanel from "../component/auth/AuthLeftPanel";

import LoginForm from "../component/auth/LoginForm";

import RegisterForm from "../component/auth/RegisterForm";

export default function Auth() {
  const navigate = useNavigate();

  const location = useLocation();

  // CHECK IF LOGIN PAGE

  const isLogin = location.pathname === "/login";

  // AUTO REDIRECT IF LOGGED IN

  useEffect(() => {
    const token = localStorage.getItem("token");

    const user = localStorage.getItem("user");

    if (token && user) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div
      className="
        w-full
        h-screen
        flex
        bg-gray-100
        overflow-hidden
      "
    >
      {/* LEFT SIDE */}

      <AuthLeftPanel register={!isLogin} />

      {/* RIGHT SIDE */}

      <div
        className="
          flex-1
          flex
          justify-center
          items-center
          px-6
        "
      >
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
