"use client";
import '@/components/css/products.css';
import Swal from 'sweetalert2'; 
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import Image from "next/image";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"; // Điều chỉnh đường dẫn import theo thư viện bạn sử dụng

// Constants for Pagination
const PAGE_SIZE = 8;

export default function Page() {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const router = useRouter();

    // State for Adding New Category
    const [isAddingNewCategory, setIsAddingNewCategory] = useState<boolean>(false);
    const [newCategoryName, setNewCategoryName] = useState<string>('');

    // Fetch Products on Component Mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8080/products");
                setProducts(response.data);
                setFilteredProducts(response.data);
                setTotalPages(Math.ceil(response.data.length / PAGE_SIZE));
            } catch (error) {
                setError("Error fetching products");
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Authentication Check
    useEffect(() => {
        const adminData = localStorage.getItem('admin');
        if (adminData) {
            try {
                const parsedAdmin = JSON.parse(adminData);
                if (parsedAdmin.email !== 'duyanh2005@gmail.com') {
                    router.push('/login');
                }
            } catch (error) {
                console.error("Error parsing admin data from localStorage", error);
                router.push('/login');
            }
        } else {
            router.push('/login');
        }

        const storedItem = localStorage.getItem('choiceManager');
        if (storedItem) {
            // Nếu cần sử dụng storedItem, bạn có thể xử lý ở đây
        }
    }, [router]);

    // Handle Filtering and Sorting
    useEffect(() => {
        let filtered = [...products];

        // Filter by Category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((product) => product.category === selectedCategory);
        }

        // Search by Name
        if (searchTerm) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by Price
        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
        setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
        setCurrentPage(1); // Reset to first page when filters change
    }, [selectedCategory, products, searchTerm, sortOrder]);

    // Handle Category Change
    const handleCategoryChange = (value: string) => {
        if (value === 'new') {
            setIsAddingNewCategory(true);
        } else {
            setIsAddingNewCategory(false);
            setSelectedCategory(value);
        }
    };

    // Handle Logout

const handleLogout = () => {
    Swal.fire({
        title: 'Bạn có chắc chắn muốn đăng xuất?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('admin');
            router.push('/login');
        }
    });
};


    // Handle Page Change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle Reset Category
    const handleResetCategory = () => {
        setSelectedCategory('all');
    };

    // Handle Delete Product
    const handleDeleteProduct = async (productId: string) => {
        const { isConfirmed } = await Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this product!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
        });

        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/products/${productId}`);
                const updatedProducts = products.filter((product) => product.id !== productId);
                setProducts(updatedProducts);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your product has been deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire("Error", "Có lỗi xảy ra khi xóa sản phẩm.", "error");
                console.error("Error deleting product:", error);
            }
        } else {
            Swal.fire({
                title: "Cancelled",
                text: "Your product is safe!",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    // Handle Edit Product
    const handleEditProduct = (productId: string) => {
        router.push(`/edit-product/${productId}`);
    };

    // Handle Delete All Products
    const handleDeleteAllProducts = async () => {
        const { isConfirmed } = await Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, all products will be removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Yes, delete all!',
            cancelButtonText: 'No, keep them',
            reverseButtons: true,
        });

        if (isConfirmed) {
            try {
                await axios.delete("http://localhost:8080/products");
                setProducts([]);
                Swal.fire({
                    title: "Deleted!",
                    text: "All products have been deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire("Error", "Có lỗi xảy ra khi xóa tất cả sản phẩm.", "error");
                console.error("Error deleting all products:", error);
            }
        }
    };

    // Handle Add New Category
    const addNewCategory = async () => {
        if (!newCategoryName.trim()) {
            Swal.fire("Warning", "Tên danh mục không được để trống.", "warning");
            return;
        }

        try {
            // Kiểm tra xem danh mục đã tồn tại chưa
            const existingCategory = await axios.get(`http://localhost:8080/categories?name=${newCategoryName}`);
            if (existingCategory.data.length > 0) {
                Swal.fire("Warning", "Danh mục đã tồn tại.", "warning");
                return;
            }

            await axios.post('http://localhost:8080/categories', { name: newCategoryName });
            Swal.fire("Success", "Danh mục mới đã được thêm!", "success");
            setSelectedCategory(newCategoryName);
            setIsAddingNewCategory(false);
            setNewCategoryName('');

            // Tải lại danh sách sản phẩm để phản ánh danh mục mới nếu cần
            const response = await axios.get("http://localhost:8080/products");
            setProducts(response.data);
        } catch (error) {
            Swal.fire("Error", "Có lỗi xảy ra khi thêm danh mục mới.", "error");
            console.error(error);
        }
    };

    // Pagination Logic
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="flex justify-center items-center py-8">
                <Image src={''} alt="Logo" width={300} height={130} />
            </div>

            <div className="text-center opacity-70 mb-8">
                <h1 className="text-3xl font-bold text-hsl(218, 51%, 25%)">Shop KenTa.vn</h1>
                <p>Nơi mà bạn có thể lựa chọn cho mình những bộ trang phục ưng ý nhất</p>
            </div>

            {/* User Info and Logout */}
            <div className="flex justify-center items-center mb-4">
                <FaRegUserCircle className="mr-2 text-lg" />
                <span className="text-lg">Duy Anh</span>
                <IoIosLogOut onClick={handleLogout} className="text-red-500 cursor-pointer ml-2 text-xl" />
            </div>

            {/* Controls: Category Select, Add Category, Reset, Delete All, Sort */}
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
                {/* Category Select */}
                <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                    <SelectTrigger className="w-44 bg-black text-white">
                        <SelectValue placeholder="Chọn loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="Áo nỉ">Áo nỉ</SelectItem>
                        <SelectItem value="Áo dù">Áo dù</SelectItem>
                        <SelectItem value="Áo kaki">Áo kaki</SelectItem>
                        <SelectItem value="Playzer nam">Playzer nam</SelectItem>
                        <SelectItem value="Áo thun ngắn">Áo thun ngắn</SelectItem>
                        <SelectItem value="Áo thun dài">Áo thun dài</SelectItem>
                        <SelectItem value="Áo thun polo">Áo thun polo</SelectItem>
                        <SelectItem value="Áo sơ mi ngắn tay">Áo sơ mi ngắn tay</SelectItem>
                        <SelectItem value="Áo sơ mi dài tay">Áo sơ mi dài tay</SelectItem>
                        <SelectItem value="Quần short kaki">Quần short kaki</SelectItem>
                        <SelectItem value="Quần jean">Quần jean</SelectItem>
                        <SelectItem value="Quần kaki">Quần kaki</SelectItem>
                        <SelectItem value="Quần vải">Quần vải</SelectItem>
                        <SelectItem value="new">Thêm loại mới</SelectItem>
                    </SelectContent>
                </Select>

                {/* Add New Category */}
                {isAddingNewCategory && (
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="border rounded-md px-4 py-2 w-60"
                            placeholder="Tên danh mục mới"
                        />
                        <button
                            onClick={addNewCategory}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Thêm danh mục
                        </button>
                        <button
                            onClick={() => {
                                setIsAddingNewCategory(false);
                                setNewCategoryName('');
                            }}
                            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                    </div>
                )}

                {/* Reset Button */}
                <button onClick={handleResetCategory} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    Reset
                </button>

                {/* Delete All Products */}
                <button onClick={handleDeleteAllProducts} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Xóa tất cả sản phẩm
                </button>

                {/* Sort Buttons */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setSortOrder('asc')}
                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${sortOrder === 'asc' ? 'opacity-100' : 'opacity-70'}`}
                    >
                        Sắp xếp giá ↑
                    </button>
                    <button
                        onClick={() => setSortOrder('desc')}
                        className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${sortOrder === 'desc' ? 'opacity-100' : 'opacity-70'}`}
                    >
                        Sắp xếp giá ↓
                    </button>
                    <button
                        onClick={() => setSortOrder('')}
                        className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${sortOrder === '' ? 'opacity-100' : 'opacity-70'}`}
                    >
                        Không sắp xếp
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded-md px-4 py-2 w-80"
                />
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-4">Sản phẩm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : paginatedProducts.length === 0 ? (
                        <p>Không tìm thấy sản phẩm nào.</p>
                    ) : (
                        paginatedProducts.map((product) => (
                            <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg">
                                {/* Bạn có thể thêm hình ảnh sản phẩm ở đây nếu có */}
                                <img style={{position:'relative' , width:350 , height:270}} src={product.img} alt="" />
                                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                                <p className="text-lg font-bold mb-2">Giá :${product.price.toLocaleString()}</p>
                                <p className="mb-2">Danh mục: {product.category}</p>
                                <p className="mb-2">Số lượng: {product.quantity}</p>
                                <p className="mb-2">Sizes: {product.size}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditProduct(product.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Previous
                </button>
                <span className="px-4 py-2 bg-white rounded">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
