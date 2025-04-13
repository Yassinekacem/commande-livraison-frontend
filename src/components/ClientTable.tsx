
interface Client {
  id: number;
  nom: string;
  email: string;
  adresse: string;
}

interface ClientTableProps {
  clients: Client[];
}

export default function ClientTable({ clients }: ClientTableProps) {
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
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{client.id}</td>
              <td className="px-4 py-2 border">{client.nom}</td>
              <td className="px-4 py-2 border">{client.email}</td>
              <td className="px-4 py-2 border">{client.adresse}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}