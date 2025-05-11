'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Transporteur {
  id: number;
  nom: string;
}

export default function AddLivraisonPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    commandeId: '',
    transporteurId: '',
    dateLivraison: new Date().toISOString().split('T')[0],
    cout: 0,
    statut: 'en cours'
  });
  const [transporteurs, setTransporteurs] = useState<Transporteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransporteurs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/transporteurs');
        setTransporteurs(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des transporteurs:", err);
        setError("Impossible de charger les transporteurs");
      } finally {
        setLoading(false);
      }
    };

    fetchTransporteurs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.commandeId || !formData.transporteurId) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.cout < 0) {
      setError('Le coût ne peut pas être négatif');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/livraisons', {
        commandeId: parseInt(formData.commandeId),
        transporteurId: parseInt(formData.transporteurId),
        dateLivraison: formData.dateLivraison,
        cout: parseFloat(formData.cout.toString()),
        statut: formData.statut
      });
      
      router.push('/livraisons');
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      setError("Erreur lors de l'ajout de la livraison");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="text-center py-8">Chargement en cours...</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Nouvelle Livraison</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="commandeId" className="block mb-1 font-medium">
            ID Commande <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="commandeId"
            name="commandeId"
            value={formData.commandeId}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="1"
          />
        </div>

        <div>
          <label htmlFor="transporteurId" className="block mb-1 font-medium">
            Transporteur <span className="text-red-500">*</span>
          </label>
          <select
            id="transporteurId"
            name="transporteurId"
            value={formData.transporteurId}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez un transporteur</option>
            {transporteurs.map(transporteur => (
              <option key={transporteur.id} value={transporteur.id}>
                {transporteur.nom} 
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dateLivraison" className="block mb-1 font-medium">
            Date de livraison
          </label>
          <input
            type="date"
            id="dateLivraison"
            name="dateLivraison"
            value={formData.dateLivraison}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="cout" className="block mb-1 font-medium">
            Coût (€)
          </label>
          <input
            type="number"
            id="cout"
            name="cout"
            value={formData.cout}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

  

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/livraisons')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Créer la Livraison
          </button>
        </div>
      </form>
    </div>
  );
}