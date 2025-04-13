'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface LigneCommande {
  id: number;
  commandeId: number;
  produitId: number;
  quantite: number;
  prixUnitaire: number;
}

interface CommandeDetail {
  id: number;
  clientId: number;
  date: string;
  statut: string;
  montantTotal: number;
  lignes: LigneCommande[];
}

export default function CommandeDetailPage({ params }: { params: { id: string } }) {
  const [commande, setCommande] = useState<CommandeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/commandes/${params.id}`);
        setCommande(response.data);
      } catch (err) {
        setError('Commande non trouvée');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [params.id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!commande) return <div>Commande introuvable</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Détails de la commande #{commande.id}</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Retour
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Informations générales</h2>
            <p><span className="font-medium">Client ID:</span> {commande.clientId}</p>
            <p><span className="font-medium">Date:</span> {commande.date}</p>
            <p><span className="font-medium">Statut:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                commande.statut === 'livrée' ? 'bg-green-100 text-green-800' :
                commande.statut === 'annulée' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {commande.statut}
              </span>
            </p>
            <p><span className="font-medium">Montant total:</span> {commande.montantTotal} €</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Articles de la commande</h2>
        {commande.lignes.length === 0 ? (
          <p>Aucun article dans cette commande</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">ID Produit</th>
                  <th className="px-4 py-2 border">Quantité</th>
                  <th className="px-4 py-2 border">Prix Unitaire</th>
                  <th className="px-4 py-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {commande.lignes.map((ligne) => (
                  <tr key={`${ligne.commandeId}-${ligne.produitId}`}>
                    <td className="px-4 py-2 border">{ligne.produitId}</td>
                    <td className="px-4 py-2 border">{ligne.quantite}</td>
                    <td className="px-4 py-2 border">{ligne.prixUnitaire} €</td>
                    <td className="px-4 py-2 border">{(ligne.quantite * ligne.prixUnitaire).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-2 border font-medium text-right">Total général:</td>
                  <td className="px-4 py-2 border font-medium">{commande.montantTotal} €</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}