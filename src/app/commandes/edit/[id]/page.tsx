'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface LigneCommande {
  id?: number;
  produitId: number;
  quantite: number;
  prixUnitaire: number;
}

export default function EditCommandePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientId: '',
    date: '',
    statut: 'en cours',
    lignes: [] as LigneCommande[]
  });
  const [currentLigne, setCurrentLigne] = useState<LigneCommande>({
    produitId: 0,
    quantite: 1,
    prixUnitaire: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/commandes/${params.id}`);
        const commande = response.data;
        
        setFormData({
          clientId: commande.clientId.toString(),
          date: commande.date,
          statut: commande.statut,
          lignes: commande.lignes.map((l: LigneCommande) => ({
            id: l.id,
            produitId: l.produitId,
            quantite: l.quantite,
            prixUnitaire: l.prixUnitaire
          }))
        });
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        alert("Commande non trouvée");
        router.push('/commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.put(`http://localhost:8080/api/commandes/${params.id}`, {
        clientId: parseInt(formData.clientId),
        date: formData.date,
        statut: formData.statut,
        lignes: formData.lignes
      });
      router.push('/commandes');
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      alert("Erreur lors de la modification");
    }
  };

  const handleAddLigne = () => {
    if (currentLigne.produitId <= 0 || currentLigne.quantite <= 0 || currentLigne.prixUnitaire <= 0) {
      alert('Veuillez remplir tous les champs de la ligne');
      return;
    }

    setFormData(prev => ({
      ...prev,
      lignes: [...prev.lignes, currentLigne]
    }));

    setCurrentLigne({
      produitId: 0,
      quantite: 1,
      prixUnitaire: 0
    });
  };

  const handleRemoveLigne = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lignes: prev.lignes.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Modifier la commande #{params.id}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de base */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Informations de la commande</h2>
            
            <div className="mb-4">
              <label htmlFor="clientId" className="block mb-1">ID Client</label>
              <input
                type="number"
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                className="w-full p-2 border rounded"
                required
                min="1"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block mb-1">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="statut" className="block mb-1">Statut</label>
              <select
                id="statut"
                name="statut"
                value={formData.statut}
                onChange={(e) => setFormData({...formData, statut: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="en cours">En cours</option>
                <option value="livrée">Livrée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
          </div>

          {/* Ajout de lignes de commande */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Ajouter des produits</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="produitId" className="block mb-1">ID Produit</label>
                <input
                  type="number"
                  id="produitId"
                  name="produitId"
                  value={currentLigne.produitId || ''}
                  onChange={(e) => setCurrentLigne({...currentLigne, produitId: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="quantite" className="block mb-1">Quantité</label>
                <input
                  type="number"
                  id="quantite"
                  name="quantite"
                  value={currentLigne.quantite || ''}
                  onChange={(e) => setCurrentLigne({...currentLigne, quantite: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="prixUnitaire" className="block mb-1">Prix Unitaire</label>
                <input
                  type="number"
                  id="prixUnitaire"
                  name="prixUnitaire"
                  value={currentLigne.prixUnitaire || ''}
                  onChange={(e) => setCurrentLigne({...currentLigne, prixUnitaire: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddLigne}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ajouter ce produit
            </button>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Produits dans la commande</h2>
          
          {formData.lignes.length === 0 ? (
            <p>Aucun produit dans cette commande</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">ID Produit</th>
                    <th className="p-2 border">Quantité</th>
                    <th className="p-2 border">Prix Unitaire</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.lignes.map((ligne, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{ligne.produitId}</td>
                      <td className="p-2 border">{ligne.quantite}</td>
                      <td className="p-2 border">{ligne.prixUnitaire} €</td>
                      <td className="p-2 border">{(ligne.quantite * ligne.prixUnitaire).toFixed(2)} €</td>
                      <td className="p-2 border">
                        <button
                          type="button"
                          onClick={() => handleRemoveLigne(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/commandes')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}