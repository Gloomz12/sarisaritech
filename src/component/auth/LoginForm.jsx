import {
  FiMail,
  FiShoppingCart,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../../services/api";

export default function LoginForm() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* EMAIL VALIDATION */

  const validateEmail = (email) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  };

  /* LOGIN */

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {

      setError(
        "Please fill in all fields."
      );

      return;
    }

    if (!validateEmail(email)) {

      setError(
        "Please enter a valid email."
      );

      return;
    }

    try {

      setLoading(true);

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      /* SAVE USER */

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setSuccess(
        "Login successful!"
      );

      setTimeout(() => {

        navigate(
          "/dashboard"
        );

      }, 1000);

    } catch (err) {

      setError(
        err.response?.data?.detail ||
        "Invalid credentials."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="
        w-full
        max-w-md
        bg-white
        rounded-[30px]
        shadow-2xl
        border border-gray-100
        p-8
      "
    >

      {/* LOGO */}

      <div
        className="
          w-14 h-14
          rounded-2xl
          bg-orange-500
          flex justify-center items-center
          text-white text-2xl
          shadow-lg shadow-orange-500/30
        "
      >
        <FiShoppingCart />
      </div>

      {/* TITLE */}

      <div className="mt-6">

        <h1
          className="
            text-3xl
            font-bold
            text-gray-900
            leading-tight
          "
        >
          Sign in to

          <span className="text-orange-500">
            {" "}SariSariTech
          </span>

        </h1>

        <p
          className="
            mt-3
            text-gray-500
            text-base
            leading-6
          "
        >
          Access your AI-powered
          store dashboard.
        </p>

      </div>

      {/* ERROR */}

      {error && (

        <div
          className="
            mt-5
            bg-red-50
            border border-red-200
            text-red-500
            rounded-xl
            px-4 py-3
            text-sm
          "
        >
          {error}
        </div>

      )}

      {/* SUCCESS */}

      {success && (

        <div
          className="
            mt-5
            bg-green-50
            border border-green-200
            text-green-600
            rounded-xl
            px-4 py-3
            text-sm
          "
        >
          {success}
        </div>

      )}

      {/* FORM */}

      <form
        onSubmit={handleLogin}
        className="
          mt-8
          space-y-5
        "
      >

        {/* EMAIL */}

        <div>

          <label
            className="
              font-medium
              text-gray-700
            "
          >
            Email
          </label>

          <div className="mt-2 relative">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="
                w-full
                h-12
                border border-gray-300
                rounded-xl
                px-4
                pr-12
                outline-none
                transition-all
                focus:border-orange-500
                focus:ring-4
                focus:ring-orange-100
              "
            />

            <FiMail
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                text-lg
              "
            />

          </div>

        </div>

        {/* PASSWORD */}

        <div>

          <label
            className="
              font-medium
              text-gray-700
            "
          >
            Password
          </label>

          <div className="mt-2 relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
                w-full
                h-12
                border border-gray-300
                rounded-xl
                px-4
                pr-12
                outline-none
                transition-all
                focus:border-orange-500
                focus:ring-4
                focus:ring-orange-100
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-orange-500
                transition
                text-lg
              "
            >

              {showPassword
                ? <FiEyeOff />
                : <FiEye />
              }

            </button>

          </div>

        </div>

        {/* OPTIONS */}

        <div
          className="
            flex items-center
            justify-between
          "
        >

          <label
            className="
              flex items-center gap-2
              text-sm text-gray-500
              cursor-pointer
            "
          >
          </label>

          <button
            type="button"
            className="
              text-sm
              text-orange-500
              hover:text-orange-600
              font-medium
            "
          >
            Forgot password?
          </button>

        </div>

        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            h-12
            bg-orange-500
            hover:bg-orange-600
            disabled:bg-orange-300
            disabled:cursor-not-allowed
            transition-all
            duration-200
            rounded-xl
            text-white
            font-semibold
            text-base
            shadow-lg
            shadow-orange-500/20
          "
        >

          {loading
            ? "Logging in..."
            : "Login"
          }

        </button>

      </form>

      {/* FOOTER */}

      <p
        className="
          mt-8
          text-center
          text-gray-500
        "
      >

        Don&apos;t have an account?

        <span
          onClick={() =>
            navigate("/register")
          }
          className="
            text-orange-500
            font-semibold
            cursor-pointer
            ml-2
            hover:text-orange-600
          "
        >
          Register here
        </span>

      </p>

    </div>
  );
}