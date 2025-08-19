import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-sky-700 mb-4">¡Bienvenido al Dashboard!</h1>
                <p className="text-sky-800 mb-8">Gestiona tus productos, categorías, ventas y más.</p>

                <div className="flex flex-col gap-4">
                    <Link
                        to="/productos"
                        className="inline-block px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl shadow-md hover:bg-sky-700 transition duration-300"
                    >
                        Productos
                    </Link>

                    <Link
                        to="/categorias"
                        className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition duration-300"
                    >
                        Categorías
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;