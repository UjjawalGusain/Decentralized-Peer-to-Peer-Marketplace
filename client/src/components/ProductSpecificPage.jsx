import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import APIS from "../../api/api";
const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold mb-4 border-l-4 border-[#FEC010] pl-3 text-slate-900">
    {children}
  </h2>
);

function ProductSpecificPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const response = await fetch(`${APIS.PRODUCTS}/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
        setMainImage(
          data.images && data.images.length > 0 ? data.images[0] : null
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Title and Category */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
          <p className="text-[#FEC010] font-semibold uppercase tracking-wide">
            {product.category}
          </p>
        </div>

        {/* Image gallery */}
        <div className="mb-6">
          {/* Main large image */}
          {mainImage ? (
            <img
              src={mainImage}
              alt="Main product"
              className="w-full max-h-[300px] object-contain rounded-md shadow mb-4"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400 rounded-md mb-4">
              No image available
            </div>
          )}

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    img === mainImage
                      ? "border-[#FEC010]"
                      : "border-transparent hover:border-[#FEC010]/80"
                  } focus:outline-none`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Video */}
        {product.videoLink && (
          <div className="mb-8">
            <video
              controls
              src={product.videoLink}
              className="w-full max-h-96 rounded-md shadow"
            />
          </div>
        )}

        {/* Description Section */}
        <section className="bg-white p-6 rounded-md shadow-sm">
          <SectionTitle>Description</SectionTitle>
          <p className="text-gray-700 whitespace-pre-wrap">
            {product.description}
          </p>
        </section>

        {/* Price Section */}
        <section className="bg-white p-6 rounded-md shadow-sm">
          <SectionTitle>Price</SectionTitle>
          <div className="text-3xl font-semibold text-slate-800">
            {product.price.toLocaleString(undefined, {
              style: "currency",
              currency: product.currency || "INR",
              minimumFractionDigits: 2,
            })}
          </div>
        </section>

        {/* Product Details Section */}
        <section className="bg-white p-6 rounded-md shadow-sm">
          <SectionTitle>Product Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 text-gray-800 text-lg">
            <div>
              <span className="font-medium text-slate-700">Condition</span>
              <p>{product.condition}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Inventory</span>
              <p>{product.inventory}</p>
            </div>
            <div>
              <span className="font-medium text-slate-700">Warranty</span>
              <p>{product.warrantyPeriod}</p>
            </div>
          </div>
        </section>

        {/* Location Section */}
        {product.location && product.location.address && (
          <section className="bg-white p-6 rounded-md shadow-sm">
            <SectionTitle>Location</SectionTitle>
            <p>
              {product.location.address}, {product.location.city},{" "}
              {product.location.country}
            </p>
          </section>
        )}

        {/* Tags Section */}
        {product.tags && product.tags.length > 0 && (
          <section className="bg-white p-6 rounded-md shadow-sm">
            <SectionTitle>Tags</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#FEC010] text-slate-900 px-3 py-1 rounded-full text-sm font-medium select-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Attributes Section */}
        {product.attributes && Object.keys(product.attributes).length > 0 && (
          <section className="bg-white p-6 rounded-md shadow-sm">
            <SectionTitle>Attributes</SectionTitle>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className="flex gap-1">
                  <dt className="font-medium capitalize">{key}:</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Expiry Date Section */}
        {product.expiryDate && (
          <section className="bg-white p-6 rounded-md shadow-sm">
            <SectionTitle>Expiry Date</SectionTitle>
            <p>{new Date(product.expiryDate).toLocaleDateString()}</p>
          </section>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="bg-slate-800 text-white px-5 py-2 rounded-md hover:bg-[#FEC010] hover:text-slate-900 transition">
            Buy Now
          </button>
          <button className="bg-[#FEC010] text-slate-900 px-5 py-2 rounded-md hover:bg-slate-800 hover:text-white transition">
            Message Seller
          </button>
        </div>
      </main>
    </div>
  );
}

export default ProductSpecificPage;