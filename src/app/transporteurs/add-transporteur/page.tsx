'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AddTransporteurPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    note: 0
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nom || !formData.telephone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.note < 0 || formData.note > 10) {
      setError('La note doit être entre 0 et 10');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/transporteurs', {
        nom: formData.nom,
        telephone: formData.telephone,
        note: parseFloat(formData.note.toString()) // Convertir en number
      });
      
      router.push('/transporteurs'); // Redirection après succès
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      setError("Erreur lors de l'ajout du transporteur");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Nouveau Transporteur</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nom" className="block mb-1 font-medium">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="telephone" className="block mb-1 font-medium">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            pattern="[+]?[0-9]+"
            title="Format: +21612345678 ou 12345678"
          />
        </div>

        <div>
          <label htmlFor="note" className="block mb-1 font-medium">
            Note (0-10)
          </label>
          <input
            type="number"
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-1 text-sm text-gray-500">
            Valeur entre 0 et 10 (peut inclure des décimales)
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/transporteurs')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}