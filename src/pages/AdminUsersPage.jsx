import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.admin.getUsers().then(setUsers).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Users</h2>
      <div className="overflow-x-auto rounded-xl bg-gray-800/80 border border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-left">
              <th className="p-3 font-medium">User ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Coins</th>
              <th className="p-3 font-medium">Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-b border-gray-700/50 text-gray-300 hover:bg-gray-700/30">
                <td className="p-3 font-mono text-xs">{u.user_id}</td>
                <td className="p-3">{u.name || '-'}</td>
                <td className="p-3">{u.email || '-'}</td>
                <td className="p-3">{u.phone || '-'}</td>
                <td className="p-3">{u.coins}</td>
                <td className="p-3">{u.is_verified ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-red-400" />}</td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-gray-500">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
