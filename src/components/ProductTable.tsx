import Link from 'next/link';

interface Produit {
  id: number;
  nom: string;
  stockActuel: number;
  description: string;
}

interface ProductTableProps {
  products: Produit[];
  onDelete?: (id: number) => void; // Ajout de la fonction de suppression
}

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return <div>Aucun produit à afficher</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nom</th>
            <th className="px-4 py-2 border">Stock</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{product.id}</td>
              <td className="px-4 py-2 border">{product.nom}</td>
              <td className="px-4 py-2 border">{product.stockActuel}</td>
              <td className="px-4 py-2 border">{product.description}</td>
              <td className="px-4 py-2 border">
                <div className="flex space-x-2">
                  <Link
                    href={`/products/edit/${product.id}`}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
                        if (onDelete) {
                          onDelete(product.id);
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