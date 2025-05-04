import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setImage(data.imageUrl);
    } catch (error) {
      alert('Failed to generate image');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">ArtFusion</h1>
      <input
        type="text"
        placeholder="Describe your scene..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full max-w-xl p-2 mb-4 text-black rounded"
      />
      <button
        onClick={generateImage}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Generating...' : 'Generate Art'}
      </button>
      {image && (
        <div className="mt-6 text-center">
          <img src={image} alt="AI Art" className="w-full max-w-xl mx-auto rounded-lg" />
          <a
            href={image}
            download="artfusion.png"
            className="block mt-2 text-blue-400 underline"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
