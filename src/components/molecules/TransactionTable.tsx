interface Transaction {
  id: number;
  customer: string;
  amount: number;
}

interface TransactionTableProps {
  data: Transaction[];
}

export default function TransactionTable({ data }: TransactionTableProps) {
  return (
    <table className="w-full bg-white rounded-xl shadow mt-6">
      <thead>
        <tr className="text-left border-b">
          <th className="p-4">ID</th>
          <th className="p-4">Customer</th>
          <th className="p-4">Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((tx) => (
          <tr key={tx.id} className="border-b last:border-none">
            <td className="p-4">{tx.id}</td>
            <td className="p-4">{tx.customer}</td>
            <td className="p-4">${tx.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
