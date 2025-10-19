import React, { useState, useEffect } from "react";
import Button from "../ProductPage/Button";
import {Range} from "react-range"

const categoriesList = [ 
  "electronics",
  "clothing",
  "books",
  "home",
  "other",
];

// Simple price input range component
const PriceRange = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => {
  const STEP = 1;
  const MIN = 0;
  const MAX = 1000;
  const values = [minPrice || MIN, maxPrice || MAX];

  return (
    <div className="mb-6">
      <h4 className="text-[#FEC010] font-semibold mb-2">Price Range</h4>
      <Range
        step={STEP}
        min={MIN}
        max={MAX}
        values={values}
        onChange={(vals) => {
          setMinPrice(vals[0]);
          setMaxPrice(vals[1]);
        }}
        renderTrack={({ props, children }) => {
          const { key, ...restProps } = props;
          return (
            <div
              key={key}
              {...restProps}
              className="h-1 bg-gray-300 rounded w-full"
              style={{ ...restProps.style }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props }) => {
          const { key, ...restProps } = props;
          return (
            <div
              key={key}
              {...restProps}
              className="w-3 h-3 bg-slate-800 rounded-full cursor-pointer"
            />
          );
        }}
      />
      <div className="flex justify-between text-sm mt-2 text-gray-700">
        <span>Min: {minPrice || MIN}</span>
        <span>Max: {maxPrice || MAX}</span>
      </div>
    </div>
  );
};
// Category multi-select checkboxes
const CategoryFilter = ({ selectedCategories, setSelectedCategories }) => {
  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="mb-6">
      <h4 className="text-[#FEC010] font-semibold mb-2">Categories</h4>  {/* Logo yellow */}
      <div className="flex flex-col space-y-1">
        {categoriesList.map((cat) => (
          <label key={cat} className="inline-flex items-center text-gray-800">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
              className="mr-2"
            />
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
};

// Sorting dropdown
const SortFilter = ({ sortBy, setSortBy }) => (
  <div className="mb-6">
    <h4 className="text-[#FEC010] font-semibold mb-2">Sort By</h4>

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="w-full p-2 rounded border border-gray-300 text-black"
    >
      <option value="recent">Most Recent</option>
      <option value="priceAsc">Price - Low to High</option>
      <option value="priceDesc">Price - High to Low</option>
    </select>
  </div>
);

const MaxDistanceFilter = ({ maxDistance, setMaxDistance }) => {
  return (
    <div className="mb-6">
      <h4 className="text-[#FEC010] font-semibold mb-2">Max Distance (km)</h4>
      <input
        type="number"
        min="100"
        max="50000"
        step="100"
        value={maxDistance}
        onChange={e => setMaxDistance(Number(e.target.value))}
        className="w-full p-2 rounded border border-gray-300 text-black"
        placeholder="Enter max distance in meters"
      />
    </div>
  );
};


// Location input placeholder (you can implement geolocation API)
const LocationInput = ({ lat, lng, setLat, setLng }) => {
    // console.log("Hello world 1");
  const useMyLocation = () => {
    // console.log("Hello world 2");
    
    // console.log(navigator);
    
    if (navigator.geolocation) {
        // console.log(`Nagivator: ${navigator.geolocation}`);
        
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      });
    }
  };

  return (
    <div className="mb-6">
      <h4 className="text-[#FEC010] font-semibold mb-2">Location (Optional)</h4>
      <Button onSubmit={useMyLocation} label={"Use My Location"}/>
      {lat && lng && (
        <p className="text-white text-sm">
          Lat: {lat.toFixed(3)}, Lng: {lng.toFixed(3)}
        </p>
      )}
    </div>
  );
};

const FiltersSidebar = ({
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  lat,
  setLat,
  lng,
  setLng,
  sortBy,
  setSortBy,
  maxDistance,
  setMaxDistance,
  onApplyFilters,
}) => {
  // Local states for controlled inputs within sidebar
  const [localCategory, setLocalCategory] = useState(category);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [localLat, setLocalLat] = useState(lat);
  const [localLng, setLocalLng] = useState(lng);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localMaxDistance, setLocalMaxDistance] = useState(maxDistance || 5000);

  
  useEffect(() => {
    setLocalCategory(category);
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    setLocalLat(lat);
    setLocalLng(lng);
    setLocalSortBy(sortBy);
    setLocalMaxDistance(maxDistance || 5000);
  }, [category, minPrice, maxPrice, lat, lng, sortBy, maxDistance]);

  const applyFilters = () => {
    setCategory(localCategory);
    setMinPrice(localMinPrice);
    setMaxPrice(localMaxPrice);
    setMaxDistance(localMaxDistance);
    setLat(localLat);
    setLng(localLng);
    setSortBy(localSortBy);
    if (onApplyFilters) onApplyFilters();
  };

  return (
    <div className="p-4 rounded-lg bg-white shadow sticky h-fit top-2 text-gray-800">
      {/* Pass local state and setters to filter UI components */}
      <CategoryFilter
        selectedCategories={localCategory}
        setSelectedCategories={setLocalCategory}
      />
      <PriceRange
        minPrice={localMinPrice}
        setMinPrice={setLocalMinPrice}
        maxPrice={localMaxPrice}
        setMaxPrice={setLocalMaxPrice}
      />
      <LocationInput
        lat={localLat}
        lng={localLng}
        setLat={setLocalLat}
        setLng={setLocalLng}
      />
      <MaxDistanceFilter maxDistance={localMaxDistance} setMaxDistance={setLocalMaxDistance} />
      <SortFilter sortBy={localSortBy} setSortBy={setLocalSortBy} />

      {/* Apply button */}
      <Button label="Apply Filters" onSubmit={applyFilters} width="full" />
    </div>
  );
}

export default FiltersSidebar;