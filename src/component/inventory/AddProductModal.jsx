import React, { useEffect, useState } from "react";

import productService from "../../services/productService";

import { Archive, Bell, Package, PhilippinePeso, Ruler, Tag, X } from "lucide-react";

function capitalizeWords(text) {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AddProductModal({
  onClose,

  refreshProducts,
}) {
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const [units, setUnits] = useState([]);

  const [formData, setFormData] = useState({
    name: "",

    category: "",

    unit: "",

    cost_price: "",

    selling_price: "",

    stock_quantity: "",

    min_stock_level: "",
  });

  /* LOAD SAVED OPTIONS */

  useEffect(() => {
    const defaultCategories = [
      "Soft Drinks",

      "Snacks",

      "Beverages",

      "Instant Food",

      "Condiments",

      "Canned Goods",

      "Frozen Foods",

      "Coffee",

      "Rice",

      "Bread",

      "Dairy",

      "Cleaning Supplies",

      "Personal Care",
    ];

    const defaultUnits = ["pc", "pack", "box", "bottle", "can", "sachet", "kg", "g", "liter", "ml"];

    const savedCategories = JSON.parse(localStorage.getItem("inventory_categories")) || [];

    const savedUnits = JSON.parse(localStorage.getItem("inventory_units")) || [];

    setCategories([...new Set([...defaultCategories, ...savedCategories])]);

    setUnits([...new Set([...defaultUnits, ...savedUnits])]);
  }, []);

  /* NORMAL INPUT */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData({
        ...formData,

        [name]: capitalizeWords(value),
      });

      return;
    }

    setFormData({
      ...formData,

      [name]: value,
    });
  };

  /* CATEGORY */

  const handleCategoryChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

    setFormData({
      ...formData,

      category: capitalizeWords(value),
    });
  };

  /* UNIT */

  const handleUnitChange = (e) => {
    const value = e.target.value

      .replace(/[^a-zA-Z\s]/g, "")

      .toLowerCase();

    setFormData({
      ...formData,

      unit: value,
    });
  };

  /* SAVE CATEGORY */

  const saveCategory = (category) => {
    if (!category.trim()) return;

    const cleaned = category.trim();

    const updated = [...new Set([...categories, cleaned])];

    setCategories(updated);

    localStorage.setItem(
      "inventory_categories",

      JSON.stringify(updated)
    );
  };

  /* SAVE UNIT */

  const saveUnit = (unit) => {
    if (!unit.trim()) return;

    const cleaned = unit.trim().toLowerCase();

    const updated = [...new Set([...units, cleaned])];

    setUnits(updated);

    localStorage.setItem(
      "inventory_units",

      JSON.stringify(updated)
    );
  };

  /* SAVE PRODUCT */

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Product name is required");

        return;
      }

      if (!formData.category.trim()) {
        alert("Category is required");

        return;
      }

      if (!formData.unit.trim()) {
        alert("Unit is required");

        return;
      }

      setLoading(true);

      saveCategory(formData.category);

      saveUnit(formData.unit);

      console.log("FORM DATA:", formData);

      await productService.createProduct({
        id: crypto.randomUUID(),

        name: formData.name.trim(),

        category: formData.category.trim(),

        unit: formData.unit.trim().toLowerCase(),

        cost_price: Number(formData.cost_price),

        selling_price: Number(formData.selling_price),

        stock_quantity: Number(formData.stock_quantity),

        min_stock_level: Number(formData.min_stock_level),
      });

      await refreshProducts();

      onClose();
    } catch (error) {
      console.log("FULL ERROR:", error);

      console.log("ERROR RESPONSE:", error.response);

      console.log("ERROR DATA:", error.response?.data);

      alert(error.response?.data?.detail || "Failed to save product");
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
          max-w-[620px]
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
              Add New Product
            </h1>

            <p
              className="
                mt-1
                text-[15px]
                text-[#64748b]
              "
            >
              Create a new inventory item
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
            <X
              size={28}
              className="
                text-[#64748b]
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
            px-8
            py-6
          "
        >
          {/* PRODUCT NAME */}

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
              <>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  placeholder="Soft Drinks"
                  className={inputClass}
                  list="category-list"
                />

                <datalist id="category-list">
                  {categories.map((category, index) => (
                    <option key={index} value={category} />
                  ))}
                </datalist>
              </>
            </InputWrapper>
          </div>

          {/* UNIT */}

          <div>
            <label className={labelClass}>Unit</label>

            <InputWrapper icon={<Ruler size={20} />}>
              <>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleUnitChange}
                  placeholder="pc"
                  className={inputClass}
                  list="unit-list"
                />

                <datalist id="unit-list">
                  {units.map((unit, index) => (
                    <option key={index} value={unit} />
                  ))}
                </datalist>
              </>
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
            <label className={labelClass}>Initial Stock</label>

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
            sticky
            bottom-0
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

          {/* SAVE */}

          <button
            onClick={handleSave}
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
            {loading ? "Saving..." : "Save Product"}
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
