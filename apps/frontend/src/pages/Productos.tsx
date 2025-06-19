import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Product } from '../models/Product';

const backendUrl = "http://localhost:3000/api/products";

const Productos = () => {
    const [productos, setProductos] = useState<Product[]>([]);
    const [form, setForm] = useState<{ name: string; price: string }>({ name: "", price: "" });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetch(backendUrl, {
            credentials: "include" // para enviar cookies
        })
            .then(res => res.json())
            .then((data: Product[]) => setProductos(data))
            .catch(console.error);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${backendUrl}/${editingId}` : backendUrl;
        const body = {
            name: form.name,
            price: Number(form.price),
        };
        try {
            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });
            setForm({ name: "", price: "" });
            setEditingId(null);
            const res = await fetch(backendUrl, { credentials: "include" });
            const data: Product[] = await res.json();
            setProductos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (product: Product) => {
        setForm({ name: product.name, price: product.price.toString() });
        setEditingId(product.id);
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`${backendUrl}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const res = await fetch(backendUrl, { credentials: "include" });
            const data: Product[] = await res.json();
            setProductos(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-sky-50 p-10">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6 text-sky-800">Gestión de Productos</h2>

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
                    <button
                        type="submit"
                        className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
                    >
                        {editingId ? "Actualizar" : "Agregar"}
                    </button>
                </form>

                <table className="w-full text-left border-t border-sky-300">
                    <thead>
                        <tr className="text-sky-700">
                            <th className="py-2">Nombre</th>
                            <th className="py-2">Precio</th>
                            <th className="py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id} className="border-t">
                                <td className="py-2">{producto.name}</td>
                                <td className="py-2">{producto.price}</td>
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