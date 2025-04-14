'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Livraison {
  id: number;
  dateLivraison: string;
  statut: string;
  commandeId: number;
}

interface TransporteurDetail {
  id: number;
  nom: string;
  telephone: string;
  note: number;
  livraisons: Livraison[];
}

export default function TransporteurDetailPage({ params }: { params: { id: string } }) {
  const [transporteur, setTransporteur] = useState<TransporteurDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTransporteur = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/transporteurs/${params.id}`);
        setTransporteur(response.data);
      } catch (err) {
        setError('Transporteur non trouvé');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransporteur();
  }, [params.id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!transporteur) return <div>Transporteur introuvable</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Détails du transporteur</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Retour
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Informations</h2>
            <p><span className="font-medium">ID:</span> {transporteur.id}</p>
            <p><span className="font-medium">Nom:</span> {transporteur.nom}</p>
            <p><span className="font-medium">Téléphone:</span> {transporteur.telephone}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Note</h2>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2">{transporteur.note.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < Math.round(transporteur.note)
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Livraisons</h2>
        {transporteur.livraisons.length === 0 ? (
          <p>Aucune livraison pour ce transporteur</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Statut</th>
                  <th className="px-4 py-2 border">Commande ID</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transporteur.livraisons.map((livraison) => (
                  <tr key={livraison.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{livraison.id}</td>
                    <td className="px-4 py-2 border">{livraison.dateLivraison}</td>
                    <td className="px-4 py-2 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        livraison.statut === 'livrée' ? 'bg-green-100 text-green-800' :
                        livraison.statut === 'annulée' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {livraison.statut}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      <Link 
                        href={`/commandes/${livraison.commandeId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {livraison.commandeId}
                      </Link>
                    </td>
                    <td className="px-4 py-2 border">
                      <Link
                        href={`/livraisons/${livraison.id}`}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Détails
                      </Link>
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