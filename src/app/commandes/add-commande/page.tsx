'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Client {
  id: number;
  nom: string;
}

interface Produit {
  id: number;
  nom: string;
  prixUnitaire: number;
}

interface LigneCommande {
  produitId: number;
  produitNom: string;
  quantite: number;
  prixUnitaire: number;
}

export default function AddCommandePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    statut: 'Non payée',
    lignes: [] as LigneCommande[]
  });
  const [currentLigne, setCurrentLigne] = useState({
    produitId: 0,
    quantite: 1,
    prixUnitaire: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, produitsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/clients'),
          axios.get('http://localhost:8080/api/produits')
        ]);
        setClients(clientsRes.data);
        setProduits(produitsRes.data);
      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.lignes.length === 0) {
      alert('Veuillez ajouter au moins un produit');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/commandes', {
        clientId: parseInt(formData.clientId),
        date: formData.date,
        statut: formData.statut,
        lignes: formData.lignes.map(l => ({
          produitId: l.produitId,
          quantite: l.quantite,
          prixUnitaire: l.prixUnitaire
        }))
      });
      router.push('/commandes');
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("Erreur lors de l'ajout de la commande");
    }
  };

  const handleAddLigne = () => {
    if (currentLigne.produitId <= 0 || currentLigne.quantite <= 0 || currentLigne.prixUnitaire <= 0) {
      alert('Veuillez remplir tous les champs de la ligne');
      return;
    }

    const selectedProduit = produits.find(p => p.id === currentLigne.produitId);
    const produitNom = selectedProduit ? selectedProduit.nom : 'Inconnu';

    setFormData(prev => ({
      ...prev,
      lignes: [...prev.lignes, {
        ...currentLigne,
        produitNom
      }]
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
      <h1 className="text-2xl font-bold mb-6">Nouvelle Commande</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de base */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Informations de la commande</h2>
            
            <div className="mb-4">
              <label htmlFor="clientId" className="block mb-1">Client</label>
              <select
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block mb-1">Date</label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

          </div>

          {/* Ajout de lignes de commande */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Ajouter des produits</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="produitId" className="block mb-1">Produit</label>
                <select
                  id="produitId"
                  value={currentLigne.produitId}
                  onChange={(e) => {
                    const produitId = parseInt(e.target.value);
                    const selectedProduit = produits.find(p => p.id === produitId);
                    setCurrentLigne({
                      produitId,
                      quantite: currentLigne.quantite,
                      prixUnitaire: selectedProduit?.prixUnitaire || 0
                    });
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="0">Sélectionnez un produit</option>
                  {produits.map(produit => (
                    <option key={produit.id} value={produit.id}>
                      {produit.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quantite" className="block mb-1">Quantité</label>
                <input
                  type="number"
                  id="quantite"
                  value={currentLigne.quantite}
                  onChange={(e) => setCurrentLigne({
                    ...currentLigne,
                    quantite: parseInt(e.target.value) || 0
                  })}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="prixUnitaire" className="block mb-1">Prix Unitaire</label>
                <input
                  type="number"
                  id="prixUnitaire"
                  value={currentLigne.prixUnitaire}
                  onChange={(e) => setCurrentLigne({
                    ...currentLigne,
                    prixUnitaire: parseFloat(e.target.value) || 0
                  })}
                  className="w-full p-2 border rounded"
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

        {/* Liste des produits ajoutés */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Produits dans la commande</h2>
          
          {formData.lignes.length === 0 ? (
            <p>Aucun produit ajouté</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Produit</th>
                    <th className="p-2 border">Quantité</th>
                    <th className="p-2 border">Prix Unitaire</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.lignes.map((ligne, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{ligne.produitNom}</td>
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

        {/* Boutons de soumission */}
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
            Créer la commande
          </button>
        </div>
      </form>
    </div>
  );
}