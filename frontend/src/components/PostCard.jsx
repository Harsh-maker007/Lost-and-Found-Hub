import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag, Clock } from 'lucide-react';

const PostCard = ({ post }) => {
  const isLost = post.type === 'lost';
  const typeColor = isLost ? 'bg-red-500' : 'bg-green-500';

  return (
    <Link to={`/post/${post.id}`} className="block h-full">
      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border border-slate-700">
        <div className="relative h-48 bg-slate-700">
          {post.imageUrl ? (
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              No Image
            </div>
          )}
          <div className={`absolute top-4 right-4 ${typeColor} text-white px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider`}>
            {post.type}
          </div>
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{post.title}</h3>
          
          <div className="space-y-2 mt-auto pt-4 text-sm text-slate-400">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-teal-400 shrink-0" />
              <span className="line-clamp-1">{post.location}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-teal-400 shrink-0" />
              <span>{post.category}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-teal-400 shrink-0" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
