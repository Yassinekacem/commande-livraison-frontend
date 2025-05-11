'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditFournisseurPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/fournisseurs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNom(data.nom);
          setAdresse(data.adresse);
        } else {
          setMessage('Fournisseur introuvable');
        }
      } catch (err) {
        console.error('Erreur de chargement:', err); 
        setMessage('Erreur de chargement du fournisseur');
      }
    };

    if (id) fetchFournisseur();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFournisseur = { nom, adresse };

    try {
      const res = await fetch(`http://localhost:8080/api/fournisseurs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFournisseur),
      });

      if (res.ok) {
        setMessage('Fournisseur mis à jour avec succès.');
        router.push('/fournisseurs'); // facultatif
      } else {
        const err = await res.text();
        setMessage('Erreur : ' + err);
      }
    } catch (error) {
      setMessage('Erreur réseau : ' + error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Modifier le Fournisseur</h1>
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
