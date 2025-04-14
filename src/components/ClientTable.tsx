import Link from 'next/link';

interface Client {
  id: number;
  nom: string;
  email: string;
  adresse: string;
}

interface ClientTableProps {
  clients: Client[];
  onDelete?: (id: number) => void;
}

export default function ClientTable({ clients, onDelete }: ClientTableProps) {
  if (clients.length === 0) {
    return <div>Aucun client à afficher</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nom</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Adresse</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{client.id}</td>
              <td className="px-4 py-2 border">{client.nom}</td>
              <td className="px-4 py-2 border">{client.email}</td>
              <td className="px-4 py-2 border">{client.adresse}</td>
              <td className="px-4 py-2 border">
                <div className="flex space-x-2">
                  <Link
                    href={`/clients/edit/${client.id}`}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
                        if (onDelete) {
                          onDelete(client.id);
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