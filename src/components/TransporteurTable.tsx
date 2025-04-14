import Link from 'next/link';

interface Transporteur {
  id: number;
  nom: string;
  telephone: string;
  note: number;
}

interface TransporteurTableProps {
  transporteurs: Transporteur[];
  onDelete?: (id: number) => void;
}

export default function TransporteurTable({ transporteurs, onDelete }: TransporteurTableProps) {
  if (transporteurs.length === 0) {
    return <div>Aucun transporteur à afficher</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nom</th>
            <th className="px-4 py-2 border">Téléphone</th>
            <th className="px-4 py-2 border">Note</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transporteurs.map((transporteur) => (
            <tr key={transporteur.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{transporteur.id}</td>
              <td className="px-4 py-2 border">{transporteur.nom}</td>
              <td className="px-4 py-2 border">{transporteur.telephone}</td>
              <td className="px-4 py-2 border">
                <div className="flex items-center">
                  <span className="mr-2">{transporteur.note.toFixed(1)}</span>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < Math.round(transporteur.note)
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 border">
                <div className="flex space-x-2">
                  <Link
                    href={`/transporteurs/${transporteur.id}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Détails
                  </Link>
                  <Link
                    href={`/transporteurs/edit/${transporteur.id}`}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous vraiment supprimer ce transporteur ?')) {
                        console.log(`Suppression du transporteur avec ID: ${transporteur.id}`);
                        if (onDelete) {
                          onDelete(transporteur.id);
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