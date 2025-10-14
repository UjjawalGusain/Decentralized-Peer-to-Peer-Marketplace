import React, { useState } from "react";
import { useForm } from "react-hook-form";
import APIS from "../../api/api";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "./ProductPage/Button.jsx";
import { useNavigate, useParams } from "react-router-dom";

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold mb-4 border-l-4 border-[#FEC010] pl-3 text-slate-900">
    {children}
  </h2>
);

function UserProfileUpdate() {
  const { id } = useParams();
  const { token, refreshUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      upi: "",
      location: {
        city: "",
        country: "",
        coordinates: "",
      },
      roles: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const response = await fetch(`${APIS.USERS}/${id}`);
        if (!response.ok) throw new Error("Could not fetch profile.");
        const data = await response.json();

        setValue("name", data.profile?.name ?? "");
        setValue("phone", data.profile?.phone ?? "");
        setValue("upi", data.upi ?? "");
        setValue("location.city", data.profile?.location?.city ?? "");
        setValue("location.country", data.profile?.location?.country ?? "");
        setValue(
          "location.coordinates",
          data.profile?.location?.coordinates
            ? JSON.stringify(data.profile.location.coordinates)
            : ""
        );
        setValue("roles", data.roles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id, setValue]);

  function fillUserLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported on your browser.");
      return;
    }
    const options = { enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.longitude, position.coords.latitude];
        setValue("location.coordinates", JSON.stringify(coords));
      },
      () => alert("Unable to retrieve your location."),
      options
    );
  }

  async function onSubmit(data) {
    try {
      setError("");
      // Parse coordinates string to array
      let coordsStr = data.location.coordinates;
      coordsStr = coordsStr.replace(/^\[|\]$/g, "");
      const parts = coordsStr
        .split(",")
        .map((part) => parseFloat(part.trim()));
      const validCoords =
        parts.length === 2 && parts.every((num) => !isNaN(num)) ? parts : [];

      const payload = {
        name: data.name,
        phone: data.phone,
        upi: data.upi,
        location: {
          city: data.location.city,
          country: data.location.country,
          coordinates: validCoords,
        },
        roles: data.roles,
      };

      const response = await fetch(`${APIS.USERS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Profile update failed.");
      } else {
        alert("Profile updated!");
        // console.log(result);
        
        refreshUser(result?.user?.id);
        
        // await refreshUser(user?.id);
        navigate(`/users/${result?.user?.id}`);
      }
    } catch (err) {
      setError("Unexpected error. Try again.");
      console.error("Profile update error:", err);
    }
  }

  const roleOptions = [
    { label: "Buyer", value: "buyer" },
    { label: "Seller", value: "seller" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-[#FEC010] text-xl font-bold">Loading...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex flex-col items-center px-4 py-12 relative overflow-visible">
      <div
        className="absolute top-24 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-[#FEC010] rounded-full opacity-10 z-0"
        style={{ boxShadow: "0 0 100px 50px rgba(254, 192, 16, 0.6)" }}
        aria-hidden="true"
      />
      <main className="w-full max-w-xl mx-auto rounded-xl shadow-lg py-8 px-6 relative z-10 border border-yellow-50">
        <h1 className="text-4xl font-bold text-center text-[#FEC010] mb-8">
          Edit Profile
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <section className="bg-white p-6 rounded-md shadow-sm">
            <SectionTitle>Name</SectionTitle>
            <input
              {...register("name", { required: true, maxLength: 100 })}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white"
              placeholder="Your name"
            />
            {errors.name && (
              <span className="text-pink-500 text-xs pl-1">Name is required</span>
            )}
          </section>

          {/* Phone */}
          <section className="bg-white p-6 rounded-md shadow-sm">
            <SectionTitle>Phone</SectionTitle>
            <input
              {...register("phone")}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white"
              placeholder="Enter your phone number"
            />
          </section>

          {/* UPI */}
          <section className="bg-white p-6 rounded-md shadow-sm">
            <SectionTitle>UPI ID</SectionTitle>
            <input
              {...register("upi")}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition bg-white"
              placeholder="Enter your UPI ID"
            />
          </section>

          {/* Role */}
          <section className="bg-white p-6 rounded-md shadow-sm">
            <SectionTitle>Role</SectionTitle>
            <div className="flex gap-6 mt-2">
              {roleOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center text-lg text-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    {...register("roles")}
                    value={opt.value}
                    className="mr-2 w-5 h-5 accent-[#FEC010] rounded focus:ring-2 focus:ring-yellow-300"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </section>

          {/* Location */}
          <section className="bg-white p-6 rounded-md shadow-sm">
            <SectionTitle>Location</SectionTitle>
            <div className="gap-5 grid grid-cols-1 sm:grid-cols-2">
              <input
                {...register("location.city")}
                type="text"
                placeholder="City"
                className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white mt-2"
              />
              <input
                {...register("location.country")}
                type="text"
                placeholder="Country"
                className="w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white mt-2"
              />
              <input
                {...register("location.coordinates")}
                type="text"
                placeholder="Coordinates e.g. [77.5946,12.9716]"
                className="col-span-2 w-full px-4 py-2 rounded-md border border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white mt-2"
              />
            </div>
            <button
              type="button"
              onClick={fillUserLocation}
              className="mt-3 px-4 py-1 bg-[#FEC010] font-semibold rounded-full transition-transform hover:scale-105 shadow"
            >
              Fill from my location
            </button>
          </section>

          {/* Submit */}
          <div className="flex justify-center mt-7">
            <Button label={"Update Profile"} type="submit" disabled={isSubmitting} />
          </div>
        </form>
      </main>
    </div>
  );
}

export default UserProfileUpdate;
