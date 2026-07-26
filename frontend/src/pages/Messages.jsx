import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../supabase';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group messages into conversations by post_id + other_user_id
        const grouped = new Map();
        (data || []).forEach((msg) => {
          const isMe = msg.sender_id === user.id;
          const otherUserId = isMe ? msg.receiver_id : msg.sender_id;
          const otherUserName = isMe ? msg.receiver_name : msg.sender_name;
          const key = `${msg.post_id}-${otherUserId}`;

          if (!grouped.has(key)) {
            grouped.set(key, {
              key,
              postId: msg.post_id,
              postTitle: msg.post_title,
              postType: msg.post_type,
              postCategory: msg.post_category,
              postLocation: msg.post_location,
              otherUserId,
              otherUserName,
              latestMessage: msg,
              count: 1,
            });
          } else {
            const existing = grouped.get(key);
            existing.count += 1;
            if (new Date(msg.created_at) > new Date(existing.latestMessage.created_at)) {
              existing.latestMessage = msg;
            }
          }
        });

        setConversations(Array.from(grouped.values()));
      } catch (error) {
        console.error('Error fetching inbox:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate, user]);

  if (!user) return null;

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
            {conversations.map((convo) => (
              <Link
                key={convo.key}
                to={`/post/${convo.postId}`}
                className="block bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-teal-500/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${convo.postType === 'lost' ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                        {convo.postType}
                      </span>
                      <span className="text-sm text-slate-500">{convo.postCategory}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-white">{convo.postTitle}</h2>
                    <p className="text-slate-400 mt-1">
                      With {convo.otherUserName} • {convo.postLocation}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 shrink-0">
                    {new Date(convo.latestMessage.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-slate-300 mt-4 line-clamp-2">
                  {convo.latestMessage.sender_id === user.id ? 'You: ' : `${convo.otherUserName}: `}
                  {convo.latestMessage.message_text}
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
