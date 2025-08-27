import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader,
  Trash2,
  Plus,
} from "lucide-react";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "used",
    currency: "INR",
    location_city: "",
    location_state: "",
    location_country: "India",
    category: "",
    is_active: true,
  });

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Load product data on mount
  useEffect(() => {
    if (id) {
      loadProduct();
      loadCategories();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/products/${id}/`);
      const product = response.data;

      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        condition: product.condition || "used",
        currency: product.currency || "INR",
        location_city: product.location_city || "",
        location_state: product.location_state || "",
        location_country: product.location_country || "India",
        category: product.category?.id || "",
        is_active: product.is_active !== undefined ? product.is_active : true,
      });

      // Load existing images
      if (product.images) {
        setImages(product.images);
      }
    } catch (error) {
      console.error("Failed to load product:", error);
      setError(
        "Failed to load product details. You may not have permission to edit this product."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get("/categories/");
      setCategories(response.data.results || response.data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check file types
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    if (validFiles.length !== files.length) {
      setError("Some files were skipped. Only images under 10MB are allowed.");
    }

    // Create preview URLs for new images
    const newImagePreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    setNewImages((prev) => [...prev, ...newImagePreviews]);
  };

  const removeExistingImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setImagesToDelete((prev) => [...prev, imageId]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  const uploadNewImages = async () => {
    if (newImages.length === 0) return [];

    setUploadingImages(true);
    const uploadedImages = [];

    try {
      for (const imageData of newImages) {
        const formData = new FormData();
        formData.append("image", imageData.file);
        formData.append("product", id);

        const response = await axios.post("/product-images/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImages.push(response.data);
      }

      return uploadedImages;
    } catch (error) {
      console.error("Failed to upload images:", error);
      throw new Error("Failed to upload some images");
    } finally {
      setUploadingImages(false);
    }
  };

  const deleteRemovedImages = async () => {
    if (imagesToDelete.length === 0) return;

    try {
      await Promise.all(
        imagesToDelete.map((imageId) =>
          axios.delete(`/product-images/${imageId}/`)
        )
      );
    } catch (error) {
      console.error("Failed to delete some images:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // 1. Update product details
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        category: formData.category || null,
      };

      await axios.patch(`/products/${id}/`, productData);

      // 2. Handle image deletions
      await deleteRemovedImages();

      // 3. Upload new images
      if (newImages.length > 0) {
        await uploadNewImages();
      }

      setSuccess("Product updated successfully!");

      // Clear new images after successful upload
      newImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setNewImages([]);
      setImagesToDelete([]);

      // Reload product data to get updated images
      setTimeout(() => {
        loadProduct();
      }, 1000);
    } catch (error) {
      console.error("Failed to update product:", error);
      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to update product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const totalImages = images.length + newImages.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/my-products")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-2">Update your product listing</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-green-700">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product title"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your product in detail"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="used">Used</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Active Status */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Active (visible to buyers)
                </span>
              </label>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="location_city"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  City
                </label>
                <input
                  type="text"
                  id="location_city"
                  name="location_city"
                  value={formData.location_city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label
                  htmlFor="location_state"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  State
                </label>
                <input
                  type="text"
                  id="location_state"
                  name="location_state"
                  value={formData.location_state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label
                  htmlFor="location_country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="location_country"
                  name="location_country"
                  value={formData.location_country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Product Images ({totalImages}/10)
            </h2>

            {/* Current Images */}
            {(images.length > 0 || newImages.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Existing Images */}
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.image}
                      alt="Product"
                      className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {/* New Images */}
                {newImages.map((imageData, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageData.preview}
                      alt="New product"
                      className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                        New
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload New Images */}
            {totalImages < 10 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImages}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {uploadingImages ? (
                    <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                  ) : (
                    <Plus className="w-12 h-12 text-gray-400 mb-4" />
                  )}
                  <span className="text-lg font-medium text-gray-900 mb-2">
                    {uploadingImages ? "Uploading..." : "Add More Images"}
                  </span>
                  <span className="text-gray-500">
                    Click to upload images (Max 10MB each)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Link
              to="/my-products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || uploadingImages}
              className={`px-8 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2 ${
                saving || uploadingImages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
