import {
  FiMail,
  FiUser,
  FiShoppingBag,
  FiEye,
  FiEyeOff,
  FiShoppingCart,
} from "react-icons/fi";

import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../../services/api";

export default function RegisterForm() {

  const navigate =
    useNavigate();

  const [storeName, setStoreName] =
    useState("");

  const [ownerName, setOwnerName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

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

  /* REGISTER */

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !storeName ||
      !email ||
      !username ||
      !password ||
      !confirmPassword
    ) {

      setError(
        "Please fill in all required fields."
      );

      return;
    }

    if (!validateEmail(email)) {

      setError(
        "Please enter a valid email."
      );

      return;
    }

    if (password.length < 8) {

      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }

    try {

      setLoading(true);

      await api.post(
        "/auth/register",
        {
          store_name: storeName,
          owner_name: ownerName,
          email,
          username,
          password,
        }
      );

      setSuccess(
        "Account created successfully!"
      );

      setStoreName("");
      setOwnerName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {

        navigate("/login");

      }, 1500);

    } catch (err) {

      setError(
        err.response?.data?.detail ||
        "Registration failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="
        w-full
        max-w-[400px]
        bg-white
        rounded-[28px]
        shadow-2xl
        border border-gray-100
        px-7
        py-6
      "
    >

      {/* LOGO */}

      <div
        className="
          w-11 h-11
          rounded-2xl
          bg-orange-500
          flex justify-center items-center
          text-white text-lg
          shadow-lg shadow-orange-500/30
        "
      >
        <FiShoppingCart />
      </div>

      {/* TITLE */}

      <div className="mt-4">

        <h1
          className="
            text-[28px]
            leading-tight
            font-bold
            text-gray-900
          "
        >
          Create

          <span className="text-orange-500">
            {" "}Store Account
          </span>

        </h1>

        <p
          className="
            mt-2
            text-gray-500
            text-[13px]
            leading-5
          "
        >
          Start managing your store smarter
          with AI-powered insights.
        </p>

      </div>

      {/* ERROR */}

      {error && (

        <div
          className="
            mt-4
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
            mt-4
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
        onSubmit={handleRegister}
        className="
          mt-5
          space-y-2.5
        "
      >

        {/* STORE NAME */}

        <InputField
          label="Store Name"
          type="text"
          value={storeName}
          onChange={(e) =>
            setStoreName(
              e.target.value
            )
          }
          placeholder="e.g. Tristan Store"
          icon={<FiShoppingBag />}
        />

        {/* OWNER */}

        <InputField
          label="Owner Name"
          type="text"
          value={ownerName}
          onChange={(e) =>
            setOwnerName(
              e.target.value
            )
          }
          placeholder="e.g. Juan Dela Cruz"
          icon={<FiUser />}
        />

        {/* EMAIL */}

        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          placeholder="Enter your email"
          icon={<FiMail />}
        />

        {/* USERNAME */}

        <InputField
          label="Username"
          type="text"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          placeholder="Choose username"
          icon={<FiUser />}
        />

        {/* PASSWORDS */}

        <div className="grid grid-cols-2 gap-2">

          <PasswordField
            label="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            placeholder="Password"
            show={showPassword}
            setShow={setShowPassword}
          />

          <PasswordField
            label="Confirm"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            placeholder="Confirm"
            show={showConfirmPassword}
            setShow={
              setShowConfirmPassword
            }
          />

        </div>

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            h-9
            bg-orange-500
            hover:bg-orange-600
            disabled:bg-orange-300
            disabled:cursor-not-allowed
            transition-all
            duration-200
            rounded-xl
            text-white
            font-semibold
            text-[13px]
            shadow-lg
            shadow-orange-500/20
          "
        >

          {loading
            ? "Creating..."
            : "Create Account"
          }

        </button>

      </form>

      {/* FOOTER */}

      <p
        className="
          mt-5
          text-center
          text-gray-500
          text-sm
        "
      >

        Already have an account?

        <span
          onClick={() =>
            navigate("/login")
          }
          className="
            text-orange-500
            font-semibold
            cursor-pointer
            ml-2
            hover:text-orange-600
          "
        >
          Login here
        </span>

      </p>

    </div>
  );
}

/* INPUT FIELD */

function InputField({
  label,
  icon,
  ...props
}) {

  return (

    <div>

      <label
        className="
          font-medium
          text-gray-700
          text-sm
        "
      >
        {label}
      </label>

      <div className="mt-1.5 relative">

        <input
          {...props}
          className="
            w-full
            h-9
            border border-gray-300
            rounded-xl
            px-4
            pr-11
            text-sm
            outline-none
            transition-all
            focus:border-orange-500
            focus:ring-4
            focus:ring-orange-100
          "
        />

        <div
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            text-base
          "
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/* PASSWORD FIELD */

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  show,
  setShow,
}) {

  return (

    <div>

      <label
        className="
          font-medium
          text-gray-700
          text-sm
        "
      >
        {label}
      </label>

      <div className="mt-1.5 relative">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full
            h-9
            border border-gray-300
            rounded-xl
            px-4
            pr-11
            text-sm
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
            setShow(!show)
          }
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-orange-500
            transition
            text-base
          "
        >

          {show
            ? <FiEyeOff />
            : <FiEye />
          }

        </button>

      </div>

    </div>
  );
}