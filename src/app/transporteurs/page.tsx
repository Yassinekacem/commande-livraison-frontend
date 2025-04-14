'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import TransporteurTable from '@/components/TransporteurTable';

interface Transporteur {
  id: number;
  nom: string;
  telephone: string;
  note: number;
}

export default function TransporteursPage() {
  const [transporteurs, setTransporteurs] = useState<Transporteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransporteurs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/transporteurs');
        setTransporteurs(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des transporteurs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransporteurs();
  }, []); 

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/transporteurs/${id}`);
      console.log(response.data); // Ajouté pour le débogage
      setTransporteurs(transporteurs.filter(t => t.id !== id));
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
        <h1 className="text-2xl font-bold">Liste des Transporteurs</h1>
        <Link
          href="/transporteurs/add-transporteur"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un Transporteur
        </Link>
      </div>
      <TransporteurTable transporteurs={transporteurs} onDelete={handleDelete} />
    </div>
  );
}