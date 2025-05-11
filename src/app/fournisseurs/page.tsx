'use client'; // Important pour les hooks React

import { useEffect, useState } from 'react';
import axios from 'axios';
import FournisseurTable from '@/components/FournisseurTable'; // Assure-toi de créer ce fichier
import Link from 'next/link';

interface Fournisseur {
  id: number;
  nom: string;
  adresse: string;
}

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/fournisseurs');
        setFournisseurs(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des fournisseurs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFournisseurs();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/fournisseurs/${id}`);
      console.log(response.data); // Pour débogage
      setFournisseurs(fournisseurs.filter(fournisseur => fournisseur.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Fournisseurs</h1>
        <Link
          href="/fournisseurs/add-fournisseur"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un Fournisseur
        </Link>
      </div>
      <FournisseurTable fournisseurs={fournisseurs} onDelete={handleDelete} />
    </div>
  );
}
