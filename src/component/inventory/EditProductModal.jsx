import React, { useEffect, useState } from "react";

import api from "../../services/api";

import { Archive, Bell, Package, PhilippinePeso, Ruler, Tag, X } from "lucide-react";

export default function EditProductModal({ product, onClose, refreshProducts }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",

    category: "",

    unit: "",

    cost_price: "",

    selling_price: "",

    stock_quantity: "",

    min_stock_level: "",
  });

  /* LOAD PRODUCT */

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",

        category: product.category || "",

        unit: product.unit || "",

        cost_price: product.cost_price || "",

        selling_price: product.selling_price || "",

        stock_quantity: product.stock_quantity || "",

        min_stock_level: product.min_stock_level || "",
      });
    }
  }, [product]);

  /* INPUT */

  const handleChange = (e) => {
    let value = e.target.value;

    if (["cost_price", "selling_price", "stock_quantity", "min_stock_level"].includes(e.target.name)) {
      value = value.replace("-", "");

      if (Number(value) < 0) {
        value = 0;
      }
    }

    setFormData({
      ...formData,

      [e.target.name]: value,
    });
  };

  /* CATEGORY */

  const handleCategoryChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

    setFormData({
      ...formData,

      category: value,
    });
  };

  /* UNIT */

  const handleUnitChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "").toLowerCase();

    setFormData({
      ...formData,

      unit: value,
    });
  };

  /* UPDATE PRODUCT */

  const handleUpdate = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Product name is required");

        return;
      }

      setLoading(true);

      await api.put(`/products/${product.id}`, {
        name: formData.name.trim(),

        category: formData.category.trim(),

        unit: formData.unit.trim().toLowerCase(),

        cost_price: Number(formData.cost_price),

        selling_price: Number(formData.selling_price),

        stock_quantity: Number(formData.stock_quantity),

        min_stock_level: Number(formData.min_stock_level),
      });

      refreshProducts();

      onClose();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.detail || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-black/60

        p-5

        backdrop-blur-[4px]
      "
    >
      <div
        className="
        w-full
        max-w-[620px]

        overflow-hidden

        rounded-[28px]

        bg-white

        dark:bg-gradient-to-b
        dark:from-[#111827]
        dark:to-[#0F172A]

        border
        border-gray-100
        dark:border-[#1F2937]
      "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between

            border-b
            border-[#eef2f7]
            dark:border-[#1F2937]

            px-6
            py-5
          "
        >
          <div>
            <h1
              className="
                text-[30px]
                font-bold

                tracking-[-1px]

                text-[#0f172a]
                dark:text-white
              "
            >
              Edit Product
            </h1>

            <p
              className="
                mt-1

                text-[15px]

                text-[#64748b]
                dark:text-gray-400
              "
            >
              Update product information
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex
              h-11
              w-11

              items-center
              justify-center

              rounded-full

              transition-all
              duration-200

              hover:bg-[#f8fafc]
              dark:hover:bg-white/5
            "
          >
            <X
              size={28}
              className="
                text-[#64748b]
                dark:text-gray-400
              "
            />
          </button>
        </div>

        {/* FORM */}

        <div
          className="
            grid
            grid-cols-2
            gap-4

            px-6
            py-5
          "
        >
          {/* NAME */}

          <div className="col-span-2">
            <label className={labelClass}>Product Name</label>

            <InputWrapper icon={<Package size={21} />}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Coke" className={inputClass} />
            </InputWrapper>
          </div>

          {/* CATEGORY */}

          <div>
            <label className={labelClass}>Category</label>

            <InputWrapper icon={<Tag size={20} />}>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                placeholder="Soft Drinks"
                className={inputClass}
              />
            </InputWrapper>
          </div>

          {/* UNIT */}

          <div>
            <label className={labelClass}>Unit</label>

            <InputWrapper icon={<Ruler size={20} />}>
              <input type="text" name="unit" value={formData.unit} onChange={handleUnitChange} placeholder="pc" className={inputClass} />
            </InputWrapper>
          </div>

          {/* COST */}

          <div>
            <label className={labelClass}>Cost Price</label>

            <InputWrapper icon={<PhilippinePeso size={20} />}>
              <input
                type="number"
                name="cost_price"
                value={formData.cost_price}
                onChange={handleChange}
                placeholder="25"
                className={inputClass}
              />
            </InputWrapper>
          </div>

          {/* SELLING */}

          <div>
            <label className={labelClass}>Selling Price</label>

            <InputWrapper icon={<PhilippinePeso size={20} />}>
              <input
                type="number"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleChange}
                placeholder="35"
                className={inputClass}
              />
            </InputWrapper>
          </div>

          {/* STOCK */}

          <div>
            <label className={labelClass}>Current Stock</label>

            <InputWrapper icon={<Archive size={20} />}>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
              />
            </InputWrapper>
          </div>

          {/* MIN STOCK */}

          <div>
            <label className={labelClass}>Min. Stock Level</label>

            <InputWrapper icon={<Bell size={20} />}>
              <input
                type="number"
                name="min_stock_level"
                value={formData.min_stock_level}
                onChange={handleChange}
                placeholder="10"
                className={inputClass}
              />
            </InputWrapper>
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
            grid
            grid-cols-2
            gap-4

            border-t
            border-[#eef2f7]
            dark:border-[#1F2937]

            bg-white
            dark:bg-[#111827]

            px-6
            py-5
          "
        >
          <button
            onClick={onClose}
            className="
              h-[52px]

              rounded-[18px]

              border
              border-[#dbe2ea]
              dark:border-[#374151]

              bg-white
              dark:bg-[#1F2937]

              text-[16px]
              font-semibold

              text-[#475569]
              dark:text-white

              transition-all
              duration-300

              hover:border-orange-300
              dark:hover:border-orange-500/40
            "
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="
              h-[52px]

              rounded-[18px]

              bg-orange-500

              text-[16px]
              font-semibold

              text-white

              shadow-lg
              shadow-orange-500/20

              transition-all
              duration-200

              hover:bg-orange-600
              hover:shadow-orange-500/40
            "
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* REUSABLE */

function InputWrapper({ icon, children }) {
  return (
    <div
      className="
        flex
        h-[54px]

        overflow-hidden

        rounded-[18px]

        border
        border-[#e2e8f0]
        dark:border-[#374151]

        bg-white
        dark:bg-[#111827]

        transition-all
        duration-300

        focus-within:border-orange-300
        focus-within:ring-4
        focus-within:ring-orange-100
      "
    >
      <div
        className="
          flex
          w-[68px]

          items-center
          justify-center

          bg-[#fff7ed]
          dark:bg-orange-500/10

          text-orange-500
        "
      >
        {icon}
      </div>

      {children}
    </div>
  );
}

const inputClass = `
  w-full
  bg-transparent

  px-5

  text-[15px]
  font-medium

  text-[#0f172a]
  dark:text-white

  outline-none

  placeholder:text-[#94a3b8]
  dark:placeholder:text-gray-500
`;

const labelClass = `
  mb-2
  block

  text-[15px]
  font-semibold

  text-[#0f172a]
  dark:text-white
`;
