"use client";
// pages/_app.js or pages/_app.tsx
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image"
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

export default function RotatingMessages() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  // lay nguoi dung :

  const messages = [
    { text: "Free ship toàn quốc với các sản phẩm trên 500k", href: "" },
    { text: "Sản phẩm được bảo hành", href: "" },
    { text: "Đổi trả sản phẩm sau 7 ngày", href: "" },
    { text: "Hotline mua hàng : (098) 786 4321", href: "" },
  ];

  const images = [s1, s2, s3, s4, s5, s6];
  const adImages = [img1, img2, img3, img4, img1, img2, img3];

  // Check userOnl and redirect if not found
  const [userOnl, setUserOnl] = useState<any>(null);

  useEffect(() => {
    const a = localStorage.getItem("userOnl");
    
    if (!a) {
      router.push("/login");
    } else {
      try {
        const parsedUser = JSON.parse(a);
        setUserOnl(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
        router.push("/login");
      }
    }
  }, [router]);
  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:8080/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Handle image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    const autoRotate = setInterval(() => {
      nextImage();
    }, 3000);
    return () => clearInterval(autoRotate);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Handle selection change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProductsByCategory(category);
  };

  const filterProductsByCategory = (category: string) => {
    if (category) {
      const filtered = products.filter((product) =>
        product.category.toLowerCase().includes(category)
      );
      setProducts(filtered);
    } else {
      axios
        .get("http://localhost:8080/products")
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  };

  const resetFilters = () => {
    setSelectedCategory("");
    axios
      .get("http://localhost:8080/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error resetting filters:", error);
      });
  };

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const viewDetails = (productId: any) => {
    router.push(`/detailProduct/${productId}`); // Navigate to the detailProduct page
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
        <p>
          Nơi mà bạn có thể lựa chọn cho mình những bộ trang phục ưng ý nhất
        </p>
      </div>

      <div className="mt-12 flex justify-center items-center relative">
        <button
          onClick={prevImage}
          className="absolute left-0 px-4 py-2 bg-gray-300 rounded-full opacity-50 hover:opacity-80"
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
            <SelectItem value="ni">Áo nỉ</SelectItem>
            <SelectItem value="du">Áo dù</SelectItem>
            <SelectItem value="kaki">Áo kaki</SelectItem>
            <SelectItem value="playze_nam">Playze nam</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Chọn loại áo thun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thunn">Áo thun ngắn</SelectItem>
            <SelectItem value="thund">Áo thun dài</SelectItem>
            <SelectItem value="thunpl">Áo thun polo</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Chọn loại áo sơ mi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="somin">Áo sơ mi ngắn tay</SelectItem>
            <SelectItem value="somid">Áo sơ mi dài tay</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Chọn loại quần dài" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quanj">Quần jean</SelectItem>
            <SelectItem value="shortk">Quần kaki</SelectItem>
            <SelectItem value="shortv">Quần vải</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={resetFilters} className="bg-red-500">
          Reset
        </Button>
      </div>

      {/** Hien thi user va tim kiem san pham  */}

      <div className="flex items-center space-x-4 mt-8">
        <Input
          type="text"
          placeholder="Tìm sản phẩm..."
          className="max-w-sm"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button type="button">
          <FaSearch />
        </Button>
        <MdOutlineShoppingCart style={{ width: "80px", height: "80px" }} />
        <FaUserCircle style={{ width: "80px", height: "80px" }} />
        <h3 style={{display:'flex',flexDirection:'row'}}> <p>{userOnl ? userOnl.name : ""}</p></h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 ">
        {currentProducts.map((product) => (
          <div key={product.id} className="p-4 border-4 border-black rounded">
            <Image
              src={product.img}
              alt={product.name}
              width={200}
              height={200}
              className="object-cover"
            />
            <h2 className="mt-2 font-semibold">{product.name}</h2>
            <p className="text-gray-500">{product.price} VND</p>
            <div className="flex flex-col gap-5">
              <div className="flex gap-15">
                <Button
                  className="mt-2"
                  onClick={() => viewDetails(product.id)}
                >
                  Mua ngay
                </Button>
                <Button
                  className="mt-2"
                  onClick={() => viewDetails(product.id)}
                >
                  Xem chi tiết
                </Button>
              </div>
              <a href="#" onClick={() => viewDetails(product.id)}>
                Bình luận về sản phẩm, ấn tại đây
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2 mt-8">
        {Array.from({
          length: Math.ceil(filteredProducts.length / productsPerPage),
        }).map((_, i) => (
          <Button
            key={i}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? "bg-blue-500" : ""}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      <div className="mt-8 w-full max-w-screen-lg mx-auto p-4 bg-gray-100 border-t border-gray-300">
        <h2 className="text-xl font-semibold mb-2">Quảng cáo</h2>
        <div className="flex overflow-x-auto space-x-4">
          <Image
            src={adImages[currentImageIndex]}
            alt="Advertisement"
            width={300}
            height={150}
            className="object-cover"
          />
          <Image
            src={adImages[currentImageIndex]}
            alt="Advertisement"
            width={300}
            height={150}
            className="object-cover"
          />
          <Image
            src={adImages[currentImageIndex]}
            alt="Advertisement"
            width={300}
            height={150}
            className="object-cover"
          />
          {/* Add more advertisement images if needed */}
        </div>
      </div>
    </div>
  );
}
