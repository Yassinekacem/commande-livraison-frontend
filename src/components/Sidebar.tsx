import Link from 'next/link';
import { FaUsers, FaBox } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Menu</h1>
      <ul className='flex flex-col gap-4'>
        <li className="">
          <Link href="/clients" className="flex items-center hover:text-blue-300">
            <FaUsers className="mr-2" /> Clients
          </Link>
        </li>
        <li>
          <Link href="/products" className="flex items-center hover:text-blue-300">
            <FaBox className="mr-2" /> Produits
          </Link>
        </li>  

        <li>
          <Link href="/commandes" className="flex items-center hover:text-blue-300">
            <FaBox className="mr-2" /> Commandes
          </Link>
        </li>


   
      </ul>
    </div>
  );
};

export default Sidebar;