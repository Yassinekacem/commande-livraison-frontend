'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AddPaiementPage() {
  const [commandeId, setCommandeId] = useState<number>(0);
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  const [mode, setMode] = useState<string>('Carte bancaire');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const paiementData = {
        commandeId,
        date,
        mode
      };

      await axios.post('http://localhost:8080/api/paiements', paiementData);
      alert('Paiement ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du paiement :', error);
      alert("Erreur lors de l'ajout du paiement.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Ajouter un paiement</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">ID Commande</label>
          <input
            type="number"
            value={commandeId}
            onChange={(e) => setCommandeId(Number(e.target.value))}
            required
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mode de paiement</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Carte bancaire">Carte bancaire</option>
            <option value="Espèces">Espèces</option>
            <option value="Chèque">Chèque</option>
            <option value="Virement">Virement</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
