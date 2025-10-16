import React, { useState } from "react";
import { useForm } from "react-hook-form";
import APIS from "../../../api/api.js";
import { useAuth } from "./../../context/AuthContext.jsx";
import AttributesInput from "./SellAttributesInput";

export default function SellForm() {
    const { token } = useAuth();
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            attributes: [{ key: "", value: "" }],
            location: { coordinates: "" },
            currency: "INR",
            condition: "used",
            warrantyPeriod: "No warranty",
            expiryDate: "",
        },
    });

    const fillUserLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported on your browser.");
            return;
        }
        const options = { enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = [
                    position.coords.longitude,
                    position.coords.latitude,
                ];
                setValue("location.coordinates", JSON.stringify(coords));
            },
            () => alert("Unable to retrieve your location."),
            options
        );
    };

    // Handle image preview and file selection
    const handleImagePreview = (e) => {
        const files = Array.from(e.target.files).slice(0, 6);
        setSelectedImages(files);
        setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    };

    // Form submit
    const onSubmit = async (data) => {
        try {
            if (data.tags && typeof data.tags === "string") {
                data.tags = data.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
            }
            if (data.location && data.location.coordinates) {
                let coordsStr = data.location.coordinates.replace(
                    /^\[|\]$/g,
                    ""
                );
                const parts = coordsStr
                    .split(",")
                    .map((part) => parseFloat(part.trim()));
                data.location.coordinates =
                    parts.length === 2 && parts.every((num) => !isNaN(num))
                        ? parts
                        : [];
            }
            data.attributes = data.attributes.filter(
                (attr) => attr.key.trim() && attr.value.trim()
            );

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("category", data.category);
            formData.append("price", data.price);
            formData.append("currency", data.currency || "INR");
            formData.append("condition", data.condition || "used");
            formData.append(
                "warrantyPeriod",
                data.warrantyPeriod || "No warranty"
            );
            formData.append("inventory", data.inventory || 1);
            formData.append("status", "active");
            formData.append("expiryDate", data.expiryDate || "");
            formData.append("location[address]", data.location.address || "");
            formData.append("location[city]", data.location.city || "");
            formData.append("location[country]", data.location.country || "");
            formData.append(
                "location[coordinates]",
                JSON.stringify(data.location.coordinates || [])
            );
            formData.append("tags", JSON.stringify(data.tags || []));
            const attrObj = {};
            (data.attributes || []).forEach(
                ({ key, value }) => (attrObj[key] = value)
            );
            formData.append("attributes", JSON.stringify(attrObj));
            if (selectedImages.length) {
                selectedImages.forEach((file) =>
                    formData.append("images", file)
                );
            }
            if (data.video && data.video[0]) {
                formData.append("file", data.video[0]);
            }

            const response = await fetch(APIS.PRODUCTS, {
                method: "POST",
                body: formData,
                credentials: "include",
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (!response.ok) {
                alert(result.message || "Failed to create product");
            } else {
                alert("Product created successfully!");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Title <span className="text-[#FEC010]">*</span>
                </label>
                <input
                    {...register("title", { required: true, maxLength: 100 })}
                    type="text"
                    className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                    placeholder="What's the item called?"
                />
                {errors.title && (
                    <span className="text-pink-500 text-xs pl-1">
                        Title is required
                    </span>
                )}
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Category <span className="text-[#FEC010]">*</span>
                    </label>
                    <select
                        {...register("category", { required: true })}
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Pick one!
                        </option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="books">Books</option>
                        <option value="home">Home</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.category && (
                        <span className="text-pink-500 text-xs pl-1">
                            Category is required
                        </span>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Condition
                    </label>
                    <select
                        {...register("condition")}
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white"
                        defaultValue="used"
                    >
                        <option value="new">New</option>
                        <option value="used">Used</option>
                        <option value="refurbished">Refurbished</option>
                        <option value="damaged">Damaged</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Description <span className="text-[#FEC010]">*</span>
                </label>
                <textarea
                    {...register("description", {
                        required: true,
                        maxLength: 2000,
                    })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                    placeholder="Describe your item in a fun way!"
                />
                {errors.description && (
                    <span className="text-pink-500 text-xs pl-1">
                        Description is required
                    </span>
                )}
            </div>

            {/* Price and Currency */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Price <span className="text-[#FEC010]">*</span>
                    </label>
                    <input
                        {...register("price", { required: true, min: 0 })}
                        type="number"
                        step="0.01"
                        min={0}
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                        placeholder="0.00"
                    />
                    {errors.price && (
                        <span className="text-pink-500 text-xs pl-1">
                            Price is required
                        </span>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Currency
                    </label>
                    <select
                        {...register("currency")}
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white"
                        defaultValue="INR"
                    >
                        <option value="INR">INR ₹</option>
                        <option value="USD">USD $</option>
                        <option value="EUR">EUR €</option>
                        <option value="GBP">GBP £</option>
                        <option value="AUD">AUD A$</option>
                        <option value="CAD">CAD C$</option>
                    </select>
                </div>
            </div>

            {/* Inventory and Warranty */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Inventory
                    </label>
                    <input
                        {...register("inventory", {
                            valueAsNumber: true,
                            min: 1,
                        })}
                        type="number"
                        min={1}
                        defaultValue={1}
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Warranty Period
                    </label>
                    <input
                        {...register("warrantyPeriod")}
                        type="text"
                        defaultValue="No warranty"
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                    />
                </div>
            </div>

            {/* Attributes dynamic list */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Attributes{" "}
                    <span className="text-gray-400">(key-value pairs)</span>
                </label>
                <AttributesInput control={control} register={register} />
            </div>

            {/* Location */}
            <div className="mt-5">
                <label className="block text-gray-700 font-medium mb-1">
                    Location (optional)
                </label>
                <button
                    type="button"
                    onClick={fillUserLocation}
                    className="mb-3 px-4 py-1 bg-[#FEC010] transition-transform transform hover:px-5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                    Use my current location
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input
                        {...register("location.address")}
                        type="text"
                        placeholder="Address"
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                    />
                    <input
                        {...register("location.city")}
                        type="text"
                        placeholder="City"
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                    />
                    <input
                        {...register("location.country")}
                        type="text"
                        placeholder="Country"
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                    />
                    <input
                        {...register("location.coordinates")}
                        type="text"
                        placeholder="Coordinates e.g. [77.5946,12.9716]"
                        className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                    />
                </div>
            </div>

            {/* Expiry Date */}
            <div className="mt-5">
                <label className="block text-gray-700 font-medium mb-1">
                    Expiry Date{" "}
                    <span className="text-gray-400">(optional)</span>
                </label>
                <input
                    {...register("expiryDate")}
                    type="date"
                    className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                />
            </div>

            {/* Tags */}
            <div className="mt-5">
                <label className="block text-gray-700 font-medium mb-1">
                    Tags{" "}
                    <span className="text-gray-400">(comma separated)</span>
                </label>
                <input
                    {...register("tags")}
                    type="text"
                    className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white font-inter"
                    placeholder="e.g. quirky, rare, vintage"
                />
            </div>

            {/* Images */}
            <div className="mt-5">
                <label className="block text-gray-700 font-medium mb-1">
                    Images <span className="text-[#FEC010]">(up to 6)</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagePreview}
                    className="block w-full px-4 py-2 border border-yellow-200 rounded-md file:font-medium file:rounded file:mr-3 file:border-0 file:bg-[#FEC010] file:text-gray-800"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {previewImages.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`preview-${idx}`}
                            className="w-16 h-16 object-cover rounded border border-yellow-200 shadow"
                        />
                    ))}
                </div>
            </div>

            {/* Video */}
            <div className="mt-5">
                <label className="block text-gray-700 font-medium mb-1">
                    Video <span className="text-gray-300">(optional)</span>
                </label>
                <input
                    {...register("video")}
                    type="file"
                    accept="video/*"
                    className="block w-full px-4 py-2 border border-yellow-200 rounded-md file:font-medium file:rounded file:mr-3 file:border-0 file:bg-[#FEC010] file:text-gray-800"
                />
            </div>

            {/* Submit button */}
            <div className="flex justify-center mt-8">
                <button
                    type="submit"
                    className="px-10 py-3 bg-[#FEC010] rounded-full shadow text-gray-900 font-bold text-lg transition-transform transform hover:bg-yellow-400 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    onClick={fillUserLocation}
                >
                    Post My Ad!
                </button>
            </div>
        </form>
    );
}
