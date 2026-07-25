import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, or, where, getDocs } from 'firebase/firestore';

const groupConversations = (messages, currentUserId) => {
  const grouped = new Map();

  messages.forEach((message) => {
    const otherUser = message.senderId.id === currentUserId ? message.receiverId : message.senderId;
    const key = `${message.postId || 'unknown'}-${otherUser.id}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        otherUser,
        post: message.postDetails || { title: 'Unknown Post', type: 'unknown' },
        postId: message.postId,
        latestMessage: message,
        count: 1,
      });
      return;
    }

    const existing = grouped.get(key);
    existing.count += 1;
    if (new Date(message.createdAt) > new Date(existing.latestMessage.createdAt)) {
      existing.latestMessage = message;
    }
  });

  return Array.from(grouped.values()).sort(
    (a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt),
  );
};

const Messages = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const q = query(
          collection(db, 'messages'),
          or(
            where('senderId.id', '==', user.id),
            where('receiverId.id', '==', user.id)
          )
        );
        const snapshot = await getDocs(q);
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      } catch (error) {
        console.error('Error fetching inbox:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate, user]);

  const conversations = useMemo(() => groupConversations(messages, user?.id), [messages, user?.id]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-slate-400 mt-2">
            Track conversations for your lost and found posts in one place.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-10 text-center">
            <h2 className="text-xl font-semibold text-white">No conversations yet</h2>
            <p className="text-slate-400 mt-2">
              Once you contact someone or someone reaches out about your item, the thread will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.key}
                to={`/post/${conversation.postId}`}
                className="block bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-teal-500/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${conversation.post.type === 'lost' ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                        {conversation.post.type}
                      </span>
                      <span className="text-sm text-slate-500">{conversation.post.category}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-white">{conversation.post.title}</h2>
                    <p className="text-slate-400 mt-1">
                      With {conversation.otherUser.name} • {conversation.post.location}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 shrink-0">
                    {new Date(conversation.latestMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-slate-300 mt-4 line-clamp-2">
                  {conversation.latestMessage.senderId.id === user.id ? 'You: ' : `${conversation.otherUser.name}: `}
                  {conversation.latestMessage.messageText}
                </p>
                <p className="text-sm text-teal-400 mt-3">Open post conversation</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
