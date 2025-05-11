import Link from 'next/link';

interface LigneCommande {
  id: number;
  produitId: number;
  quantite: number;
  prixUnitaire: number;
}

interface Commande {
  id: number;
  clientId: number;
  date: string;
  statut: string;
  montantTotal: number;
  lignes: LigneCommande[];
}

interface CommandeTableProps {
  commandes: Commande[];
  onDelete: (id: number) => void;
}

export default function CommandeTable({ commandes, onDelete }: CommandeTableProps) {
  if (commandes.length === 0) {
    return <div>Aucune commande à afficher</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Client ID</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Statut</th>
            <th className="px-4 py-2 border">Montant Total</th>
            <th className="px-4 py-2 border">Articles</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande) => (
            <tr key={commande.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{commande.id}</td>
              <td className="px-4 py-2 border">{commande.clientId}</td>
              <td className="px-4 py-2 border">{commande.date}</td>
              <td className="px-4 py-2 border">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  commande.statut === 'Payée' ? 'bg-green-100 text-green-800' :
                  commande.statut === 'Non payée' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {commande.statut}
                </span>
              </td>
              <td className="px-4 py-2 border">{commande.montantTotal} €</td>
              <td className="px-4 py-2 border">
                {commande.lignes.length} article(s)
              </td>
              <td className="px-4 py-2 border">
                <div className="flex space-x-2">
                <Link
  href={`/commandes/${commande.id}`}
  className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
>
  Détails
</Link>
                  <Link
                    href={`/commandes/edit/${commande.id}`}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => onDelete(commande.id)}
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