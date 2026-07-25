import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Upload, MapPin, Tag } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    location: '',
    category: 'Electronics'
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const categories = ['Electronics', 'Wallets/Bags', 'Keys', 'Documents', 'Pets', 'Jewelry', 'Clothing', 'Other'];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        imageUrl: preview || '',
        createdAt: new Date().toISOString(),
        createdBy: {
          id: user.id,
          name: user.name
        }
      };

      const docRef = await addDoc(collection(db, 'posts'), payload);
      navigate(`/`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-center border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to create a post</h2>
          <button onClick={() => navigate('/login')} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Report an Item</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Type Selection */}
            <div className="flex gap-4">
              <label className={`flex-1 cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${formData.type === 'lost' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'}`}>
                <input type="radio" name="type" value="lost" checked={formData.type === 'lost'} onChange={handleInputChange} className="hidden" />
                <span className="font-bold text-lg">I Lost Something</span>
              </label>
              <label className={`flex-1 cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${formData.type === 'found' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'}`}>
                <input type="radio" name="type" value="found" checked={formData.type === 'found'} onChange={handleInputChange} className="hidden" />
                <span className="font-bold text-lg">I Found Something</span>
              </label>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  placeholder="e.g. Black Leather Wallet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea 
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                  placeholder="Provide details like color, brand, distinct features..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> Location</div>
                  </label>
                  <input 
                    type="text" 
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    placeholder="e.g. Block A Park"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center"><Tag className="w-4 h-4 mr-1"/> Category</div>
                  </label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Photo (Optional but highly recommended)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl bg-slate-800 hover:bg-slate-750 transition-all">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="mx-auto h-48 object-cover rounded-lg" />
                      <button 
                        type="button"
                        onClick={() => { setPreview(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-400 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-teal-400 hover:text-teal-300 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-semibold py-4 rounded-xl text-white transition-all text-lg shadow-lg ${loading ? 'bg-slate-600 cursor-not-allowed' : formData.type === 'lost' ? 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/20' : 'bg-green-500 hover:bg-green-600 hover:shadow-green-500/20'}`}
            >
              {loading ? 'Submitting...' : formData.type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
