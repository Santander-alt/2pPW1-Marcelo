import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Product } from '../models/Product';
import type { Categorias } from '../models/Categorias';

const backendUrl = "http://localhost:3000/api/products";
const categoriesUrl = "http://localhost:3000/api/categories";

const Productos = () => {
    const [productos, setProductos] = useState<Product[]>([]);
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [form, setForm] = useState<{ name: string; price: string; categoryId: number }>({ name: "", price: "", categoryId: 0 });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filtroCategoriaId, setFiltroCategoriaId] = useState<number>(0);

    // Fetch productos
    const fetchProducts = async (categoryId?: number) => {
        try {
            const url = categoryId && categoryId !== 0 
                ? `${backendUrl}?categoryId=${categoryId}`
                : backendUrl;
            const res = await fetch(url, { credentials: "include" });
            const data: Product[] = await res.json();
            setProductos(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch categorias
    const fetchCategories = async () => {
        try {
            const res = await fetch(categoriesUrl, { credentials: "include" });
            const data: Categorias[] = await res.json();
            setCategorias(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === "categoryId" ? Number(value) : value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${backendUrl}/${editingId}` : backendUrl;
        const body = {
            name: form.name,
            price: Number(form.price),
            categoryId: form.categoryId,
        };
        try {
            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });
            setForm({ name: "", price: "", categoryId: 0 });
            setEditingId(null);
            fetchProducts(filtroCategoriaId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (producto: Product) => {
        setForm({
            name: producto.name,
            price: producto.price?.toString() || "",
            categoryId: (producto as any).categoryId || 0,
        });
        setEditingId(producto.id);
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`${backendUrl}/${id}`, { method: "DELETE", credentials: "include" });
            fetchProducts(filtroCategoriaId);
        } catch (error) {
            console.error(error);
        }
    };

    // Exportar reporte a CSV
    const exportToCSV = () => {
        if (productos.length === 0) {
            alert("No hay datos para exportar");
            return;
        }

        // Encabezados
        const headers = ["ID", "Nombre", "Precio", "Categoría"];

        // Filas
        const rows = productos.map(p => [
            p.id,
            p.name,
            p.price ?? "",
            (p as any).category?.name ?? "Sin categoría"
        ]);

        // Construir CSV
        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(";") + "\n"
            + rows.map(r => r.join(";")).join("\n");

        // Descargar
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "reporte_productos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-sky-50 p-10">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6 text-sky-800">Gestión de Productos</h2>

                {/* FORMULARIO */}
                <form onSubmit={handleSubmit} className="mb-6 flex gap-4 flex-wrap">
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="flex-1 p-2 border border-sky-300 rounded"
                        required
                    />
                    <input
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Precio"
                        className="w-32 p-2 border border-sky-300 rounded"
                        required
                    />
                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-48 p-2 border border-sky-300 rounded"
                        required
                    >
                        <option value={0}>Selecciona categoría</option>
                        {categorias.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
                    >
                        {editingId ? "Actualizar" : "Agregar"}
                    </button>
                </form>

                {/* FILTRO Y REPORTE */}
                <div className="mb-4 flex justify-between items-center">
                    <div>
                        <label className="mr-2 text-sky-700 font-semibold">Filtrar por categoría:</label>
                        <select
                            value={filtroCategoriaId}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                setFiltroCategoriaId(id);
                                fetchProducts(id);
                            }}
                            className="p-2 border border-sky-300 rounded"
                        >
                            <option value={0}>Todas</option>
                            {categorias.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Descargar Reporte CSV
                    </button>
                </div>

                {/* TABLA */}
                <table className="w-full text-left border-t border-sky-300">
                    <thead>
                        <tr className="text-sky-700">
                            <th className="py-2">Nombre</th>
                            <th className="py-2">Precio</th>
                            <th className="py-2">Categoría</th>
                            <th className="py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id} className="border-t">
                                <td className="py-2">{producto.name}</td>
                                <td className="py-2">{producto.price ?? "-"}</td>
                                <td className="py-2">{(producto as any).category?.name || "Sin categoría"}</td>
                                <td className="py-2">
                                    <button
                                        onClick={() => handleEdit(producto)}
                                        className="text-blue-600 hover:underline mr-4"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(producto.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Productos;