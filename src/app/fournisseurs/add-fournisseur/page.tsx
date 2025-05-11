'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddFournisseurPage() {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fournisseur = { nom, adresse };

    try {
      const res = await fetch('http://localhost:8080/api/fournisseurs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fournisseur),
      });

      if (res.ok) {
        setMessage('Fournisseur ajouté avec succès !');
        setNom('');
        setAdresse('');
        // Optionnel : rediriger vers la liste ou page de détails
        router.push('/fournisseurs');
      } else {
        const err = await res.text();
        setMessage('Erreur : ' + err);
      }
    } catch (error) {
      setMessage('Erreur réseau ou serveur : ' + error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Fournisseur</h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Adresse</label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
