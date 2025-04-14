'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductTable from '@/components/ProductTable';
import Link from 'next/link';

interface Produit {
  id: number;
  nom: string;
  stockActuel: number;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/produits');
        setProducts(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/produits/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression du produit");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Produits</h1>
        <Link
          href="/products/add-product"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un Produit
        </Link>
      </div>
      <ProductTable products={products} onDelete={handleDelete} />
    </div>
  );
}