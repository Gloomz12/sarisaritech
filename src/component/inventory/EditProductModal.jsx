import React, { useEffect, useState } from "react";

import axios from "axios";

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

  /* NORMAL INPUT */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* CATEGORY VALIDATION */

  const handleCategoryChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

    setFormData({
      ...formData,
      category: value,
    });
  };

  /* UNIT VALIDATION */

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

      await axios.put(`http://127.0.0.1:8000/api/products/${product.id}`, {
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
        bg-black/40
        p-5
        backdrop-blur-[2px]
      "
    >
      <div
        className="
          w-full
          max-w-[1050px]
          overflow-hidden
          rounded-[28px]
          bg-white
          shadow-[0_20px_70px_rgba(15,23,42,0.12)]
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
            px-8
            py-5
          "
        >
          <div>
            <h1
              className="
                text-[34px]
                font-bold
                tracking-[-1px]
                text-[#0f172a]
              "
            >
              Edit Product
            </h1>

            <p
              className="
                mt-1
                text-[15px]
                text-[#64748b]
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
            "
          >
            <X size={28} className="text-[#64748b]" />
          </button>
        </div>

        {/* FORM */}

        <div className="grid grid-cols-2 gap-4 px-8 py-6">
          {/* PRODUCT NAME */}

          <div className="col-span-2">
            <label className={labelClass}>Product Name</label>

            <InputWrapper icon={<Package size={21} />}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Coke"
                className={inputClass}
              />
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
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleUnitChange}
                placeholder="pc"
                className={inputClass}
              />
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
                placeholder="100"
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
            bg-white
            px-8
            py-5
          "
        >
          {/* CANCEL */}

          <button
            onClick={onClose}
            className="
              h-[58px]
              rounded-[18px]
              border
              border-[#dbe2ea]
              bg-white
              text-[16px]
              font-semibold
              text-[#475569]
            "
          >
            Cancel
          </button>

          {/* UPDATE */}

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="
              h-[58px]
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
        h-[60px]
        overflow-hidden
        rounded-[18px]
        border
        border-[#e2e8f0]
        bg-white

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
  outline-none
  placeholder:text-[#94a3b8]
`;

const labelClass = `
  mb-2
  block
  text-[15px]
  font-semibold
  text-[#0f172a]
`;
