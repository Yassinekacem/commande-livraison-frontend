import Link from 'next/link';

interface Fournisseur {
  id: number;
  nom: string;
  adresse: string;
}

interface FournisseurTableProps {
  fournisseurs: Fournisseur[];
  onDelete?: (id: number) => void;
}

export default function FournisseurTable({ fournisseurs, onDelete }: FournisseurTableProps) {
  if (fournisseurs.length === 0) {
    return <div>Aucun fournisseur à afficher</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nom</th>
            <th className="px-4 py-2 border">Adresse</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fournisseurs.map((fournisseur) => (
            <tr key={fournisseur.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{fournisseur.id}</td>
              <td className="px-4 py-2 border">{fournisseur.nom}</td>
              <td className="px-4 py-2 border">{fournisseur.adresse}</td>
              <td className="px-4 py-2 border">
                <div className="flex space-x-2">
                  <Link
                    href={`/fournisseurs/${fournisseur.id}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Détails
                  </Link>

                  <Link
                    href={`/fournisseurs/edit/${fournisseur.id}`}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) {
                        if (onDelete) {
                          onDelete(fournisseur.id);
                        }
                      }
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
