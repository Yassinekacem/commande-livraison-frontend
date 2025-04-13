'use client'; // Important pour les hooks React

import { useEffect, useState } from 'react';
import axios from 'axios';
import ClientTable from '@/components/ClientTable';
import Link from 'next/link';

interface Client {
  id: number;
  nom: string;
  email: string;
  adresse: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/clients');
        setClients(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des clients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Clients</h1>


<Link
  href="/clients/add-client"
  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  Ajouter un Client
</Link>

      </div>
      <ClientTable clients={clients} />
    </div>
  );
}