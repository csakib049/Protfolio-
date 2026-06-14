import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import api from '@/api';

export default function AdminMessages() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get('/messages');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id) => {
    await api.patch(`/messages/${id}/read`);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/messages/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Messages</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className={`glass rounded-2xl p-6 transition-all ${!item.read ? 'border-l-2 border-primary' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  {!item.read && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">New</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{item.email}</p>
                {item.subject && <p className="text-sm text-gray-300 mt-2 font-medium">{item.subject}</p>}
                <p className="text-sm text-gray-400 mt-2 whitespace-pre-wrap">{item.message}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!item.read && (
                  <button onClick={() => handleMarkRead(item._id)} className="p-2 hover:text-primary transition-colors" title="Mark as read">
                    <MailOpen size={16} />
                  </button>
                )}
                <button onClick={() => handleDelete(item._id)} className="p-2 hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="text-center py-16 text-gray-500">
            <Mail size={40} className="mx-auto mb-4 opacity-30" />
            <p>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
