'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Commande {
  id: number;
  date: string;
  statut: string;
  montantTotal: number;
}

interface ClientDetail {
  id: number;
  nom: string;
  email: string;
  adresse: string;
  // pas besoin de commandes ici, on les récupère séparément
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientRes = await axios.get(`http://localhost:8080/api/clients/${params.id}`);
        setClient(clientRes.data);

        const commandesRes = await axios.get(`http://localhost:8080/api/commandes/client/${params.id}`);
        setCommandes(commandesRes.data);
      } catch (err) {
        console.error(err);
        setError('Client non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!client) return <div>Client introuvable</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Détails du client</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Retour
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Informations</h2>
        <p><span className="font-medium">ID:</span> {client.id}</p>
        <p><span className="font-medium">Nom:</span> {client.nom}</p>
        <p><span className="font-medium">Email:</span> {client.email}</p>
        <p><span className="font-medium">Adresse:</span> {client.adresse}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Commandes</h2>
        {commandes.length === 0 ? (
          <p>Aucune commande pour ce client.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Statut</th>
                  <th className="px-4 py-2 border">Montant</th>
                  <th className="px-4 py-2 border">Paiment</th>
                </tr>
              </thead>
              <tbody>
                {commandes.map((commande) => (
                  <tr key={commande.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{commande.id}</td>
                    <td className="px-4 py-2 border">{commande.date}</td>
                    <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                  commande.statut === 'Payée' ? 'bg-green-100 text-green-800' :
                  commande.statut === 'Non payée' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                        {commande.statut}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">{commande.montantTotal} DT</td>
                    <td className="px-4 py-2 border">
  {commande.statut !== 'Payée' && (
    <Link
      href={`/clients/add-paiment`}
      className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
    >
      Payer
    </Link>
  )}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
