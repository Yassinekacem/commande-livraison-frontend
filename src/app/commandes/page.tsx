'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import CommandeTable from '@/components/CommandeTable';

interface LigneCommande {
  id: number;
  produitId: number;
  quantite: number;
  prixUnitaire: number;
}

interface Commande {
  id: number;
  clientId: number;
  date: string;
  statut: string;
  montantTotal: number;
  lignes: LigneCommande[];
}

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/commandes');
        setCommandes(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des commandes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/commandes/${id}`);
      setCommandes(commandes.filter(commande => commande.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression de la commande");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Commandes</h1>
        <Link
          href="/commandes/add-commande"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter une Commande
        </Link>
      </div>
      <CommandeTable commandes={commandes} onDelete={handleDelete} />
    </div>
  );
}