"use client";

interface SidebarProps {
  onSelect?: (view: string) => void;
}

export default function Sidebar({ onSelect }: SidebarProps) {
  const menu = ["overview", "analytics", "customers", "reports"];

  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Sales Dashboard</h2>

      <ul className="space-y-4">
        {menu.map((item) => (
          <li
            key={item}
            className="cursor-pointer capitalize text-gray-700 hover:text-blue-600"
            onClick={() => onSelect?.(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
