'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import LivraisonTable from '@/components/LivraisonTable';

interface Transporteur {
  id: number;
  nom: string;
}

interface LivraisonWithTransporteur extends Livraison {
  transporteurNom?: string;
}

interface Livraison {
  id: number;
  commandeId: number;
  transporteurId: number;
  dateLivraison: string;
  cout: number;
  statut: string;
}

export default function LivraisonsPage() {
  const [livraisons, setLivraisons] = useState<LivraisonWithTransporteur[]>([]);
  // Removed unused transporteurs state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les transporteurs et les livraisons en parallèle
        const [transporteursResponse, livraisonsResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/transporteurs'),
          axios.get('http://localhost:8080/api/livraisons')
        ]);

        // Enrichir les livraisons avec les noms des transporteurs
        const livraisonsAvecNoms = livraisonsResponse.data.map((livraison: Livraison) => {
          const transporteur = transporteursResponse.data.find((t: Transporteur) => t.id === livraison.transporteurId);
          return {
            ...livraison,
            transporteurNom: transporteur?.nom || 'Inconnu'
          };
        });

        setLivraisons(livraisonsAvecNoms);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/livraisons/${id}`);
      setLivraisons(livraisons.filter(l => l.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression de la livraison");
    }
  };

  if (loading) return <div className="text-center py-8">Chargement en cours...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Livraisons</h1>
        <Link
          href="/livraisons/add-livraison"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
        >
          + Ajouter une Livraison
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <LivraisonTable 
          livraisons={livraisons} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
}