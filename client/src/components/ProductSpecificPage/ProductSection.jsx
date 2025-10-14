import SectionTitle from "../common/SectionTitle";
import Button from "../ProductPage/Button";


export default function ProductSection({
    product,
    mainImage,
    setMainImage,
    handleBuy,
}) {
    return (
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

            {/* Description */}
            <section className="bg-white p-6 rounded-md shadow-sm">
                <SectionTitle>Description</SectionTitle>
                <p className="text-gray-700 whitespace-pre-wrap">
                    {product.description}
                </p>
            </section>

            {/* Price */}
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

            {/* Product Details */}
            <section className="bg-white p-6 rounded-md shadow-sm">
                <SectionTitle>Product Details</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 text-gray-800 text-lg">
                    <div>
                        <span className="font-medium text-slate-700">
                            Condition
                        </span>
                        <p>{product.condition}</p>
                    </div>
                    <div>
                        <span className="font-medium text-slate-700">
                            Inventory
                        </span>
                        <p>{product.inventory}</p>
                    </div>
                    <div>
                        <span className="font-medium text-slate-700">
                            Warranty
                        </span>
                        <p>{product.warrantyPeriod}</p>
                    </div>
                </div>
            </section>

            {/* Location */}
            {product.location?.address && (
                <section className="bg-white p-6 rounded-md shadow-sm">
                    <SectionTitle>Location</SectionTitle>
                    <p>
                        {product.location.address}, {product.location.city},{" "}
                        {product.location.country}
                    </p>
                </section>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
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

            {/* Attributes */}
            {product.attributes &&
                Object.keys(product.attributes).length > 0 && (
                    <section className="bg-white p-6 rounded-md shadow-sm">
                        <SectionTitle>Attributes</SectionTitle>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
                            {Object.entries(product.attributes).map(
                                ([key, value]) => (
                                    <div key={key} className="flex gap-1">
                                        <dt className="font-medium capitalize">
                                            {key}:
                                        </dt>
                                        <dd>{String(value)}</dd>
                                    </div>
                                )
                            )}
                        </dl>
                    </section>
                )}

            {/* Expiry Date */}
            {product.expiryDate && (
                <section className="bg-white p-6 rounded-md shadow-sm">
                    <SectionTitle>Expiry Date</SectionTitle>
                    <p>{new Date(product.expiryDate).toLocaleDateString()}</p>
                </section>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
                {/* Changed onSubmit to onClick for Button component */}
                <Button label={"Buy Now"} onSubmit={handleBuy} />
                <Button label={"Message Seller"} color={"bg-[#FEC010]"} />
            </div>
        </main>
    );
}
