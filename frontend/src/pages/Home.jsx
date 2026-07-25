import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Search } from 'lucide-react';
import api from '../lib/api';

const categories = ['All Categories', 'Electronics', 'Wallets/Bags', 'Keys', 'Documents', 'Pets', 'Jewelry', 'Clothing', 'Other'];

const Home = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Only update on form submit

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterCategory) params.append('category', filterCategory);
        if (filterType) params.append('type', filterType);
        if (searchQuery) params.append('search', searchQuery);

        const queryString = params.toString();
        const res = await api.get(`/api/posts${queryString ? `?${queryString}` : ''}`);
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filterType, filterCategory, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            Find What You Lost. Return What You Found.
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A community-driven platform to help neighbors connect and recover lost items quickly and safely.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-900 rounded-2xl p-4 md:p-6 mb-10 shadow-xl border border-slate-800">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            <form onSubmit={handleSearch} className="w-full md:w-1/2 relative">
              <input 
                type="text"
                placeholder="Search items, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <button type="submit" className="hidden">Search</button>
            </form>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <button 
                onClick={() => setFilterType('')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filterType === '' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                All Items
              </button>
              <button 
                onClick={() => setFilterType('lost')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filterType === 'lost' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Lost Items
              </button>
              <button 
                onClick={() => setFilterType('found')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filterType === 'found' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Found Items
              </button>
            </div>

          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            >
              {categories.map((category) => (
                <option key={category} value={category === 'All Categories' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
            <p className="text-sm text-slate-500 flex items-center">
              Filter by post type, search keywords, and narrow results by category.
            </p>
          </div>
        </div>

        {/* Post Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
            <h3 className="text-2xl font-semibold text-slate-300 mb-2">No posts found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
