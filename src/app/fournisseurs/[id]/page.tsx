'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Fournisseur = {
  id: number;
  nom: string;
  adresse: string;
};

type LigneCommande = {
  id: number;
  commandeId: number;
  produitId: number;
  quantite: number;
  prixUnitaire: number;
};

export default function FournisseurDetailPage() {
  const params = useParams();
  const fournisseurId = params.id;

  const [fournisseur, setFournisseur] = useState<Fournisseur | null>(null);
  const [lignes, setLignes] = useState<LigneCommande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/fournisseurs/${fournisseurId}`);
        const data = await res.json();
        setFournisseur(data);
      } catch (error) {
        console.error('Erreur chargement fournisseur:', error);
      }
    };

    const fetchLignesCommande = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/lignes/fournisseur/${fournisseurId}`);
        const data = await res.json();
        setLignes(data);
      } catch (error) {
        console.error('Erreur chargement lignes commande:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFournisseur();
    fetchLignesCommande();
  }, [fournisseurId]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Détails du Fournisseur</h1>

      {fournisseur ? (
        <div className="mb-6">
          <p><strong>Nom :</strong> {fournisseur.nom}</p>
          <p><strong>Adresse :</strong> {fournisseur.adresse}</p>
        </div>
      ) : (
        <p>Fournisseur non trouvé.</p>
      )}

      <h2 className="text-xl font-semibold mb-2">Historique des Commandes</h2>
      {lignes.length > 0 ? (
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Commande ID</th>
              <th className="border p-2">Produit ID</th>
              <th className="border p-2">Quantité</th>
              <th className="border p-2">Prix Unitaire</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((ligne) => (
              <tr key={ligne.id}>
                <td className="border p-2">{ligne.id}</td>
                <td className="border p-2">{ligne.commandeId}</td>
                <td className="border p-2">{ligne.produitId}</td>
                <td className="border p-2">{ligne.quantite}</td>
                <td className="border p-2">{ligne.prixUnitaire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune ligne de commande trouvée pour ce fournisseur.</p>
      )}
    </div>
  );
}
