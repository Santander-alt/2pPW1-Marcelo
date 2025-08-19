// src/components/Categorias.tsx
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Categorias } from '../models/Categorias';

const backendUrl = "http://localhost:3000/api/categories";

const Categorias = () => {
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [form, setForm] = useState<{ name: string }>({ name: "" });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetch(backendUrl, { credentials: "include" })
            .then(res => res.json())
            .then((data: Categorias[]) => setCategorias(data))
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
        const body = { name: form.name };
        try {
            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });
            setForm({ name: "" });
            setEditingId(null);
            const res = await fetch(backendUrl, { credentials: "include" });
            const data: Categorias[] = await res.json();
            setCategorias(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (categoria: Categorias) => {
        setForm({ name: categoria.name });
        setEditingId(categoria.id);
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`${backendUrl}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const res = await fetch(backendUrl, { credentials: "include" });
            const data: Categorias[] = await res.json();
            setCategorias(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-sky-50 p-10">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6 text-sky-800">Gestión de Categorías</h2>

                <form onSubmit={handleSubmit} className="mb-6 flex gap-4 flex-wrap">
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nombre de categoría"
                        className="flex-1 p-2 border border-sky-300 rounded"
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
                            <th className="py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id} className="border-t">
                                <td className="py-2">{categoria.name}</td>
                                <td className="py-2">
                                    <button
                                        onClick={() => handleEdit(categoria)}
                                        className="text-blue-600 hover:underline mr-4"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(categoria.id)}
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

export default Categorias;