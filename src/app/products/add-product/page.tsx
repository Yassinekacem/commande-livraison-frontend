'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios'; 

interface Fournisseur {
  id: number;
  nom: string;
  adresse: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [formData, setFormData] = useState({
    nom: '',
    stockActuel: 0,
    description: '',
    fournisseurId: 0 // Nouvel attribut
  });

  // Récupérer la liste des fournisseurs
  useEffect(() => {
    axios.get('http://localhost:8080/api/fournisseurs')
      .then(response => setFournisseurs(response.data))
      .catch(error => console.error('Erreur lors du chargement des fournisseurs:', error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/produits', {
        nom: formData.nom,
        stockActuel: Number(formData.stockActuel),
        description: formData.description,
        fournisseurId: Number(formData.fournisseurId) // Envoi uniquement le fournisseurId
      });
      router.push('/products');
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("Erreur lors de l'ajout du produit");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stockActuel' ? Number(value) : value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ajouter un Produit</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nom" className="block mb-1">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="stockActuel" className="block mb-1">Stock Actuel</label>
          <input
            type="number"
            id="stockActuel"
            name="stockActuel"
            min="0"
            value={formData.stockActuel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        {/* Champ fournisseur */}
        <div>
          <label htmlFor="fournisseurId" className="block mb-1">Fournisseur</label>
          <select
            id="fournisseurId"
            name="fournisseurId"
            value={formData.fournisseurId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value={0}>-- Sélectionner un fournisseur --</option>
            {fournisseurs.map((fournisseur: Fournisseur) => (
              <option key={fournisseur.id} value={fournisseur.id}>
                {fournisseur.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
