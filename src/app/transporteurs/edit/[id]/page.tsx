'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function EditTransporteurPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    note: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransporteur = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/transporteurs/${params.id}`);
        setFormData({
          nom: response.data.nom,
          telephone: response.data.telephone,
          note: response.data.note
        });
      } catch (err) {
        setError('Transporteur non trouvé');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransporteur();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.telephone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/transporteurs/${params.id}`, {
        nom: formData.nom,
        telephone: formData.telephone,
        note: parseFloat(formData.note.toString())
      });
      router.push('/transporteurs');
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      setError("Erreur lors de la modification");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Modifier Transporteur</h1>
      
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