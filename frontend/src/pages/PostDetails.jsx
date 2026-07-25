import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Tag, Clock, Send } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !post) {
        setMessages([]);
        return;
      }
      try {
        const q = query(collection(db, 'messages'), where('postId', '==', id));
        const snapshot = await getDocs(q);
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // sort by createdAt
        msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMessages(msgs);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    if (post) {
      fetchMessages();
    }
  }, [id, user, post]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to send a message.");
      navigate('/login');
      return;
    }
    
    setSendingMsg(true);
    try {
      const newMsg = {
        postId: post.id,
        postDetails: {
          title: post.title,
          type: post.type,
          category: post.category,
          location: post.location
        },
        senderId: {
          id: user.id,
          name: user.name
        },
        receiverId: post.createdBy,
        messageText: message,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'messages'), newMsg);
      setMessages((prev) => [...prev, { id: docRef.id, ...newMsg }]);
      alert('Message sent successfully!');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white text-2xl font-bold">
        Post not found.
      </div>
    );
  }

  const isLost = post.type === 'lost';
  const typeColor = isLost ? 'bg-red-500' : 'bg-green-500';
  const isOwner = user && user.id === post.createdBy.id;
  const hasConversation = messages.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 text-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="md:w-1/2 relative bg-slate-800">
            {post.imageUrl ? (
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
              />
            ) : (
              <div className="w-full h-full min-h-[300px] flex items-center justify-center text-slate-500 text-xl font-medium">
                No Image Provided
              </div>
            )}
            <div className={`absolute top-6 right-6 ${typeColor} text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg`}>
              {post.type}
            </div>
          </div>
          
          {/* Details Section */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">{post.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-400 mb-8 border-b border-slate-800 pb-6">
              <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg">
                <MapPin className="h-4 w-4 mr-2 text-teal-400" />
                {post.location}
              </div>
              <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg">
                <Tag className="h-4 w-4 mr-2 text-teal-400" />
                {post.category}
              </div>
              <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg">
                <Clock className="h-4 w-4 mr-2 text-teal-400" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="prose prose-invert max-w-none flex-grow mb-8">
              <h3 className="text-xl font-bold text-white mb-2">Description</h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{post.description}</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mt-auto">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-md">
                  {post.createdBy.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Posted by</p>
                  <p className="font-bold text-white">{post.createdBy.name}</p>
                </div>
              </div>

              {!isOwner ? (
                <form onSubmit={handleSendMessage} className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Send a message to {post.createdBy.name.split(' ')[0]}</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="E.g. Is this still available?"
                      className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={sendingMsg}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center shadow-md disabled:bg-slate-600"
                    >
                      {sendingMsg ? 'Sending...' : <Send className="h-5 w-5" />}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 bg-teal-500/10 text-teal-400 border border-teal-500/30 p-3 rounded-lg text-sm text-center font-medium">
                  This is your post. Open the messages page to manage conversations about this item.
                </div>
              )}
            </div>

            {user && (
              <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Conversation</h3>
                  {hasConversation && (
                    <button
                      type="button"
                      onClick={() => navigate('/messages')}
                      className="text-sm text-teal-400 hover:text-teal-300"
                    >
                      View all messages
                    </button>
                  )}
                </div>
                {hasConversation ? (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                    {messages.map((item) => {
                      const mine = item.senderId.id === user.id;

                      return (
                        <div
                          key={item.id}
                          className={`rounded-xl px-4 py-3 text-sm ${mine ? 'bg-teal-500/15 border border-teal-500/30 ml-8' : 'bg-slate-900 border border-slate-700 mr-8'}`}
                        >
                          <p className="text-xs text-slate-400 mb-1">
                            {mine ? 'You' : item.senderId.name} • {new Date(item.createdAt).toLocaleString()}
                          </p>
                          <p className="text-slate-200 whitespace-pre-wrap">{item.messageText}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No conversation yet for this post. Once someone sends a message, it will appear here for the participants.
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
