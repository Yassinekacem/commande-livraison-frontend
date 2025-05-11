import Link from 'next/link';
import {
  FaUserFriends,
  FaHandshake,
  FaBoxOpen,
  FaShoppingCart,
  FaTruckMoving,
  FaShippingFast
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg p-6 flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-wide text-center text-blue-400">
          Kacem Delivery
        </h1>
        <p className="text-center text-sm text-gray-400">Dashboard</p>
      </div>
      
      <ul className="space-y-4 text-base">
        <li>
          <Link href="/clients" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all">
            <FaUserFriends className="text-blue-400" /> Clients
          </Link>
        </li>
        <li>
          <Link href="/fournisseurs" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all">
            <FaHandshake className="text-green-400" /> Fournisseurs
          </Link>
        </li>
        <li>
          <Link href="/products" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all">
            <FaBoxOpen className="text-yellow-400" /> Produits
          </Link>
        </li>
        <li>
          <Link href="/commandes" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all">
            <FaShoppingCart className="text-pink-400" /> Commandes
          </Link>
        </li>
        <li>
          <Link href="/transporteurs" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all">
            <FaTruckMoving className="text-purple-400" /> Transporteurs
          </Link>
        </li>
        <li>
          <Link href="/livraisons" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all">
            <FaShippingFast className="text-red-400" /> Livraisons
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
