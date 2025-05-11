import Link from 'next/link';

interface Livraison {
  id: number;
  commandeId: number;
  transporteurId: number;
  transporteurNom?: string;
  dateLivraison: string;
  cout: number;
  statut: string;
}

interface LivraisonTableProps {
  livraisons: Livraison[];
  onDelete?: (id: number) => void;
}

export default function LivraisonTable({ livraisons, onDelete }: LivraisonTableProps) {
  if (livraisons.length === 0) {
    return <div className="text-center py-4 text-gray-500">Aucune livraison à afficher</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Commande ID</th>
            <th className="px-4 py-2 border">Transporteur</th>
            <th className="px-4 py-2 border">Date Livraison</th>
            <th className="px-4 py-2 border">Coût</th>
            <th className="px-4 py-2 border">Statut</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {livraisons.map((livraison) => (
            <tr key={livraison.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-center">{livraison.id}</td>
              <td className="px-4 py-2 border text-center">
                <Link 
                  href={`/commandes/${livraison.commandeId}`}
                  className="text-blue-500 hover:underline"
                >
                  {livraison.commandeId}
                </Link>
              </td>
              <td className="px-4 py-2 border text-center">
                <Link 
                  href={`/transporteurs/${livraison.transporteurId}`}
                  className="text-blue-500 hover:underline"
                >
                  {livraison.transporteurNom || livraison.transporteurId}
                </Link>
              </td>
              <td className="px-4 py-2 border text-center">
                {new Date(livraison.dateLivraison).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border text-center">{livraison.cout.toFixed(2)} €</td>
              <td className="px-4 py-2 border text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  livraison.statut.toLowerCase() === 'livrée' ? 'bg-green-100 text-green-800' :
                  livraison.statut.toLowerCase() === 'annulée' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {livraison.statut}
                </span>
              </td>
              <td className="px-4 py-2 border">
                <div className="flex justify-center space-x-2">
                  <Link
                    href={`/livraisons/${livraison.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                  >
                    Détails
                  </Link>
                  <Link
                    href={`/livraisons/edit/${livraison.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => {
                        if (confirm('Voulez-vous vraiment supprimer cette livraison ?')) {
                            console.log(`Suppression du livraison avec ID: ${livraison.id}`);
                        if (onDelete) {
                          onDelete(livraison.id);
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