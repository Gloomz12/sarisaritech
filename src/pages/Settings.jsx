import React, { useState, useEffect } from "react";

import { useOutletContext } from "react-router-dom";

import api from "../services/api";

import { FiLock, FiSettings, FiEye, FiEyeOff } from "react-icons/fi";

import { FaStore } from "react-icons/fa";

import toast from "react-hot-toast";

export default function Settings() {
  const { darkMode, setDarkMode } = useOutletContext();

  const [form, setForm] = useState({
    store_name: "",

    owner_name: "",

    contact_number: "",

    store_address: "",

    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",

    new_password: "",

    confirm_password: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,

    new: false,

    confirm: false,
  });

  /* LOAD USER */

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setForm({
        store_name: user.store_name || "",

        owner_name: user.owner_name || "",

        contact_number: user.contact_number || "",

        store_address: user.store_address || "",

        email: user.email || "",
      });
    }
  }, []);

  /* HANDLE INPUT */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact_number") {
      if (/^\d*$/.test(value) && value.length <= 11) {
        setForm({
          ...form,
          [name]: value,
        });
      }

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* SAVE SETTINGS */

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const loadingToast = toast.loading("Saving settings...");

      const response = await api.put("/settings/", {
        store_name: form.store_name,

        owner_name: form.owner_name,

        email: form.email,

        contact_number: form.contact_number,

        store_address: form.store_address,
      });

      const updatedUser = {
        ...user,

        store_name: response.data.user.store_name,

        owner_name: response.data.user.owner_name,

        email: response.data.user.email,

        contact_number: response.data.user.contact_number,

        store_address: response.data.user.store_address,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new Event("userUpdated"));

      toast.dismiss(loadingToast);

      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response?.data?.message || "Failed to update settings");
    }
  };

  /* CHANGE PASSWORD */

  const handlePasswordChange = async () => {
    try {
      if (passwordForm.new_password !== passwordForm.confirm_password) {
        toast.error("Passwords do not match");

        return;
      }

      if (passwordForm.new_password.length < 6) {
        toast.error("Password must be at least 6 characters");

        return;
      }

      const loadingToast = toast.loading("Changing password...");

      await api.put("/settings/change-password", {
        current_password: passwordForm.current_password,

        new_password: passwordForm.new_password,
      });

      toast.dismiss(loadingToast);

      toast.success("Password changed successfully!");

      setPasswordForm({
        current_password: "",

        new_password: "",

        confirm_password: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to change password");
    }
  };

  return (
    <div
      className="
        w-full
        space-y-4

        transition-all
        duration-300
      "
    >
      {/* HEADER */}

      <div>
        <h1
          className="
            text-[28px]
            font-black

            text-[#0F172A]
            dark:text-white
          "
        >
          Settings
        </h1>

        <p
          className="
            mt-2
            text-sm

            text-gray-500
            dark:text-gray-400
          "
        >
          Manage your store information and account security.
        </p>
      </div>

      {/* STORE INFO */}

      <Card>
        <CardHeader
          icon={<FaStore className="text-orange-500 text-[20px]" />}
          title="Store Information"
          subtitle="Update your store details."
        />

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3

            gap-4
            mt-6
          "
        >
          <Input label="Store Name" name="store_name" value={form.store_name} onChange={handleChange} />

          <Input label="Owner Name" name="owner_name" value={form.owner_name} onChange={handleChange} />

          <Input
            label="Contact Number"
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            placeholder="09XXXXXXXXX"
          />

          <Input label="Email Address" name="email" value={form.email} onChange={handleChange} />

          <div className="xl:col-span-2">
            <Input
              label="Store Address"
              name="store_address"
              value={form.store_address}
              onChange={handleChange}
              placeholder="Enter store address"
            />
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <PrimaryButton onClick={handleSave}>Save Changes</PrimaryButton>
        </div>
      </Card>

      {/* PASSWORD */}

      <Card>
        <CardHeader
          icon={<FiLock className="text-orange-500 text-[20px]" />}
          title="Change Password"
          subtitle="Update your password securely."
        />

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3

            gap-4
            mt-6
          "
        >
          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            value={passwordForm.current_password}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,

                current_password: e.target.value,
              })
            }
            show={showPasswords.current}
            toggleShow={() =>
              setShowPasswords({
                ...showPasswords,

                current: !showPasswords.current,
              })
            }
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={passwordForm.new_password}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,

                new_password: e.target.value,
              })
            }
            show={showPasswords.new}
            toggleShow={() =>
              setShowPasswords({
                ...showPasswords,

                new: !showPasswords.new,
              })
            }
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            value={passwordForm.confirm_password}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,

                confirm_password: e.target.value,
              })
            }
            show={showPasswords.confirm}
            toggleShow={() =>
              setShowPasswords({
                ...showPasswords,

                confirm: !showPasswords.confirm,
              })
            }
          />
        </div>

        <div className="flex justify-end mt-5">
          <PrimaryButton onClick={handlePasswordChange}>Change Password</PrimaryButton>
        </div>
      </Card>

      {/* PREFERENCES */}

      <Card>
        <CardHeader
          icon={<FiSettings className="text-orange-500 text-[20px]" />}
          title="Preferences"
          subtitle="Customize your application preferences."
        />

        <div
          className="
            flex
            items-center
            justify-between

            mt-5
          "
        >
          <div>
            <h3
              className="
                text-[16px]
                font-bold

                text-[#0F172A]
                dark:text-white
              "
            >
              Dark Mode
            </h3>

            <p
              className="
                mt-1
                text-[13px]

                text-gray-500
                dark:text-gray-400
              "
            >
              Enable dark mode for a better viewing experience.
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
              relative

              w-[58px]
              h-[32px]

              rounded-full

              transition-all
              duration-300

              ${darkMode ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"}
            `}
          >
            <div
              className={`
                absolute
                top-1

                w-[24px]
                h-[24px]

                rounded-full
                bg-white

                shadow-md

                transition-all
                duration-300

                ${darkMode ? "translate-x-8" : "translate-x-1"}
              `}
            />
          </button>
        </div>
      </Card>
    </div>
  );
}

/* PASSWORD INPUT */

function PasswordInput({ label, show, toggleShow, ...props }) {
  return (
    <div>
      <label
        className="
          block
          text-[12px]
          font-semibold
          mb-2

          text-[#1E293B]
          dark:text-gray-300
        "
      >
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className="
            w-full
            h-[44px]

            rounded-xl

            border
            border-gray-200
            dark:border-[#374151]

            px-4
            pr-12

            text-[14px]

            outline-none

            bg-white
            dark:bg-[#1F2937]

            text-[#0F172A]
            dark:text-white

            placeholder:text-gray-400
            dark:placeholder:text-gray-500

            focus:border-orange-400
            focus:ring-4
            focus:ring-orange-100
            dark:focus:ring-orange-500/20

            transition-all
          "
        />

        <button
          type="button"
          onClick={toggleShow}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2

            text-gray-400
            hover:text-orange-500

            transition-all
          "
        >
          {show ? <FiEye /> : <FiEyeOff />}
        </button>
      </div>
    </div>
  );
}

/* BUTTON */

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        h-[40px]
        min-w-[160px]

        px-6

        rounded-xl

        bg-orange-500
        hover:bg-orange-600

        text-white
        text-[13px]
        font-semibold

        hover:shadow-md

        transition-all
        duration-300
      "
    >
      {children}
    </button>
  );
}

/* CARD */

function Card({ children }) {
  return (
    <div
      className="
        bg-white
        dark:bg-[#111827]

        rounded-[22px]

        border
        border-gray-100
        dark:border-[#1F2937]

        shadow-sm

        px-5
        py-5
      "
    >
      {children}
    </div>
  );
}

/* CARD HEADER */

function CardHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="
          w-[50px]
          h-[50px]

          rounded-[14px]

          bg-orange-50
          dark:bg-orange-500/10

          flex
          items-center
          justify-center
        "
      >
        {icon}
      </div>

      <div>
        <h2
          className="
            text-[20px]
            font-black

            text-[#0F172A]
            dark:text-white
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-[13px]

            text-gray-500
            dark:text-gray-400
          "
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* INPUT */

function Input({ label, ...props }) {
  return (
    <div>
      <label
        className="
          block
          text-[12px]
          font-semibold
          mb-2

          text-[#1E293B]
          dark:text-gray-300
        "
      >
        {label}
      </label>

      <input
        {...props}
        className="
          w-full
          h-[44px]

          rounded-xl

          border
          border-gray-200
          dark:border-[#374151]

          px-4

          text-[14px]

          outline-none

          bg-white
          dark:bg-[#1F2937]

          text-[#0F172A]
          dark:text-white

          placeholder:text-gray-400
          dark:placeholder:text-gray-500

          focus:border-orange-400
          focus:ring-4
          focus:ring-orange-100
          dark:focus:ring-orange-500/20

          transition-all
        "
      />
    </div>
  );
}
