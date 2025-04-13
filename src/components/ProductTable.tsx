interface Produit {
    id: number;
    nom: string;
    stockActuel: number;
    description: string;
  }
  
  interface ProductTableProps {
    products: Produit[];
  }
  
  export default function ProductTable({ products }: ProductTableProps) {
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
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{product.id}</td>
                <td className="px-4 py-2 border">{product.nom}</td>
                <td className="px-4 py-2 border">{product.stockActuel}</td>
                <td className="px-4 py-2 border">{product.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }