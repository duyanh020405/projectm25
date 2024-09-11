"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import logo from "../app/logo.png";
import { Button } from "@/components/ui/button";
import img1 from "@/img/img1.png";
import img2 from "@/img/664dda14edbfae2d6d29f459b05993b3.jpg";
import img3 from "@/img/1.jpg";
import img4 from "@/img/img5.jpg";
import s1 from "@/components/img2/ban-ve-thiet-ke-shop-thoi-trang-1.jpg";
import s2 from "@/components/img2/phoi-ao-thun-nam-voi-quan-au.webp";
import s3 from "@/components/img2/quan-ao-doi-nam-nu-thu-dong.jpg";
import s4 from "@/components/img2/shop-ban-quan-ao-nam-gia-re-tphcm-min.jpg";
import s5 from "@/components/img2/t.jpg";
import s6 from "@/components/img2/thiet-ke-shop-quan-ao-nu-nho-dep-1.jpg";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
};

type Message = {
  text: string;
  href: string;
};

export default function RotatingMessages() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userOnl, setUserOnl] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const messages: Message[] = [
    { text: "Free ship toàn quốc với các sản phẩm trên 500k", href: "" },
    { text: "Sản phẩm được bảo hành", href: "" },
    { text: "Đổi trả sản phẩm sau 7 ngày", href: "" },
    { text: "Hotline mua hàng : (098) 786 4321", href: "" },
  ];

  const images = [s1, s2, s3, s4, s5, s6];
  const adImages = [img1, img2, img3, img4, img1, img2, img3];

  useEffect(() => {
    const user = localStorage.getItem("userOnl");
    if (!user) {
      router.push("/login");
    } else {
      try {
        const parsedUser = JSON.parse(user);
        setUserOnl(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
        router.push("/login");
      }
    }
  }, [router]);

  const fetchProducts = async (category = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/products?category=${category}`
      );
      setProducts(response.data);
    } catch (error) {
      setError("Error fetching products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    const autoRotate = setInterval(nextImage, 3000);
    return () => clearInterval(autoRotate);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const resetFilters = () => {
    setSelectedCategory("");
    fetchProducts();
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        (product.name ? product.name.toLowerCase() : "").includes(searchTerm)
      ),
    [products, searchTerm]
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const viewDetails = (productId: number) => {
    router.push(`/detailProduct/${productId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex justify-center items-center py-8">
        <Image src={logo} alt="Logo" width={300} height={130} />
      </div>

      <div className="text-center opacity-70 mb-8">
        <h1 className="text-3xl font-bold text-hsl(218, 51%, 25%)">
          Shop KenTa.vn
        </h1>
        <p>Nơi mà bạn có thể lựa chọn cho mình những bộ trang phục ưng ý nhất</p>
      </div>

      <div className="mt-12 flex justify-center items-center relative">
        <button
          onClick={prevImage}
          className="absolute left-0 px-4 py-2 bg-gray-300 rounded-full opacity-50 hover:opacity-80"
          aria-label="Previous Image"
        >
          <GrLinkPrevious />
        </button>
        <div className="overflow-hidden max-w-screen-lg">
          <Image
            src={images[currentImageIndex]}
            alt="Rotating image"
            width={1500}
            height={600}
            className="object-cover w-full h-500"
          />
        </div>
        <button
          onClick={nextImage}
          className="absolute right-0 px-4 py-2 bg-gray-300 rounded-full opacity-50 hover:opacity-80"
          aria-label="Next Image"
        >
          <GrLinkNext />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Chọn loại áo khoác" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Áo nỉ">Áo nỉ</SelectItem>
            <SelectItem value="Áo dù">Áo dù</SelectItem>
            <SelectItem value="Áo kaki">Áo kaki</SelectItem>
            <SelectItem value="Playze nam">Playze nam</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Chọn loại áo thun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Áo thun ngắn">Áo thun ngắn</SelectItem>
            <SelectItem value="Áo thun dài">Áo thun dài</SelectItem>
            <SelectItem value="Áo thun polo">Áo thun polo</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={resetFilters} className="bg-red-500">
          Reset
        </Button>
      </div>

      <Input
        type="text"
        placeholder="Tìm kiếm sản phẩm"
        value={searchTerm}
        onChange={handleSearch}
        className="my-4 px-4 py-2 border rounded-lg shadow-sm w-80"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>{error}</p>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow"
            >
              <Image
                src={product.imageUrl || "/path-to-placeholder-image.png"}
                alt={product.name}
                width={300}
                height={200}
                className="object-cover w-full h-48 mb-4"
              />
              <h2 className="text-lg font-bold mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-2">Price: ${product.price}</p>
              <Button onClick={() => viewDetails(product.id)}>
                View Details
              </Button>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

      <div className="my-8">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-full"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
          className="px-4 py-2 bg-gray-300 rounded-full"
        >
          Next
        </button>
      </div>
    </div>
  );
}
