"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import React from "react";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  img: string;
  description: string;
  quantity: number;
  price: number;
  size: string[];
  category: string; // Assuming category for related products
}

export default function DetailProduct({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const userOnl = JSON.parse(localStorage.getItem("userOnl") || "{}");
  const User_comment = userOnl.name;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/products/${id}`
        );
        setProduct(response.data);

        // Fetch related products
        const relatedResponse = await axios.get(
          `http://localhost:8080/products?category=${response.data.category}`
        );
        setRelatedProducts(relatedResponse.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleFavorite = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedLikes = isFavorite
        ? user.likes.filter((productId: string) => productId !== id)
        : [...user.likes, id];

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, likes: updatedLikes })
      );
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    axios
      .post("http://localhost:8080/comments", {
        comments: { User_comment, comment },
      })
      .then(()=>{alert("Bình luận thành công "),setComment('')})
      .catch((error) => console.error("Error adding comment:", error));
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!product)
    return <p className="text-center text-gray-600">No product found</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl border-2 border-gray-200 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{product.name}</h1>
      <div className="relative overflow-hidden rounded-lg shadow-lg mb-6">
        <Image
          src={product.img}
          alt={product.name}
          width={1200}
          height={800}
          className="object-cover w-full h-72 md:h-96"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Giá: {product.price} VND
          </p>
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Số lượng: {product.quantity}
          </p>
          <p className="text-lg font-semibold text-gray-800 mb-4">Size: </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.size.map((item) => (
              <button
                key={item}
                onClick={() => handleSizeClick(item)}
                className={`px-4 py-2 border-2 rounded-md transition-colors duration-300 ease-in-out ${
                  selectedSize === item
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-200 text-gray-800 border-gray-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Mô tả: {product.description}
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleFavorite}
              className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out ${
                isFavorite ? "bg-red-700" : ""
              }`}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
              Buy Now
            </button>
          </div>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label
              htmlFor="comment"
              className="block text-gray-700 font-semibold"
            >
              Bình luận:
            </label>
            <textarea
              id="comment"
              name="comment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              value={comment}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="px-4 py-2 border-2 border-black text-black font-semibold rounded-md transition-colors duration-300 ease-in-out hover:bg-gray-100"
            >
              Send Comment
            </button>
          </form>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Sản phẩm liên quan:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedProducts.map((relatedProduct) => (
          <div
            key={relatedProduct.id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <Image
              src={relatedProduct.img}
              alt={relatedProduct.name}
              width={400}
              height={300}
              className="object-cover w-full h-48 mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">
              {relatedProduct.name}
            </h3>
            <p className="text-gray-800 mb-2">
              Giá: {relatedProduct.price} VND
            </p>
            <a
              href={`/products/${relatedProduct.id}`}
              className="text-blue-600 hover:underline"
            >
              Xem chi tiết
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
