import { useState } from 'react';
import { FiSearch, FiMapPin, FiGlobe, FiDollarSign, FiAlertCircle, FiFlag, FiCloud, FiRss } from 'react-icons/fi';

const DataFinder = () => {
  const [input, setInput] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // API Keys
  const WEATHER_API_KEY = '0eec78474374203d92cbb7ed7152e79f';
  const NEWS_API_KEY = 'ddbf13aadb5647ecb57f25b147a55590';

  // Predefined news categories
  const newsCategories = [
    { label: 'Business', value: 'business' },
    { label: 'Technology', value: 'technology' },
    { label: 'Sports', value: 'sports' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Health', value: 'health' },
    { label: 'Science', value: 'science' },
  ];

  const fetchData = async (apiType, category = '') => {
    if (!input && apiType !== 'ip' && apiType !== 'news') {
      setError('Please enter a query.');
      return;
    }

    if (apiType === 'news' && !input && !category) {
      setError('Please enter a query or select a category.');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      let response, result;

      switch (apiType) {
        case 'ifsc':
          response = await fetch(`https://ifsc.razorpay.com/${input}`);
          if (!response.ok) throw new Error('Invalid IFSC Code or service unavailable');
          result = await response.json();
          if (result.error || result.message?.includes('error')) throw new Error('Invalid IFSC Code');
          setData(Object.fromEntries(Object.entries(result).filter(([_, value]) => value !== null && value !== undefined)));
          break;

        case 'pincode':
          response = await fetch(`https://api.postalpincode.in/pincode/${input}`);
          if (!response.ok) throw new Error('Invalid Pincode');
          result = await response.json();
          if (result[0].Status === 'Error') throw new Error('Pincode not found');
          const filteredPincode = {
            ...result[0],
            PostOffice: result[0].PostOffice.map(po => Object.fromEntries(Object.entries(po).filter(([_, value]) => value !== null && value !== undefined)))
          };
          setData(filteredPincode);
          break;

        case 'ip':
          const url = input ? `https://ipapi.co/${input}/json/` : 'https://ipapi.co/json/';
          response = await fetch(url);
          if (!response.ok) throw new Error('Invalid IP address');
          result = await response.json();
          if (result.error) throw new Error(result.reason);
          setData(Object.fromEntries(Object.entries(result).filter(([_, value]) => value !== null && value !== undefined)));
          break;

        case 'country':
          response = await fetch(`https://restcountries.com/v3.1/name/${input}`);
          if (!response.ok) throw new Error('Country not found');
          result = await response.json();
          if (!result.length) throw new Error('No data for this country');
          const filteredCountry = Object.fromEntries(
            Object.entries(result[0]).filter(([_, value]) => value !== null && value !== undefined)
          );
          setData(filteredCountry);
          break;

        case 'weather':
          response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${WEATHER_API_KEY}&units=metric`);
          if (!response.ok) throw new Error('City not found or service unavailable');
          result = await response.json();
          if (result.cod !== 200) throw new Error(result.message);
          setData({
            city: result.name,
            temp: `${result.main.temp}°C`,
            weather: result.weather[0].description,
            humidity: `${result.main.humidity}%`,
            wind: `${result.wind.speed} m/s`,
          });
          break;

        case 'news':
          const query = category || input;
          response = await fetch(`https://newsapi.org/v2/top-headlines?${category ? `category=${query}` : `q=${query}`}&apiKey=${NEWS_API_KEY}`);
          if (!response.ok) throw new Error('News fetch failed. Check your API key or query.');
          result = await response.json();
          if (result.status !== 'ok') throw new Error(result.message || 'News API error');
          setData({
            totalResults: result.totalResults,
            articles: result.articles.slice(0, 5).map(article => ({
              title: article.title,
              source: article.source.name,
              url: article.url,
            })),
          });
          break;

        default:
          return;
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderNestedData = (obj, depth = 0) => {
    if (!obj || typeof obj !== 'object') {
      return <span className="text-gray-600 text-sm">{String(obj)}</span>;
    }

    return (
      <div className={`space-y-2 ${depth > 0 ? 'ml-4' : ''}`}>
        {Object.entries(obj).map(([key, value]) => (
          <div
            key={key}
            className={`flex flex-col sm:flex-row sm:items-start gap-2 p-2 rounded-lg ${
              depth === 0 ? 'hover:bg-gray-100 transition-colors duration-200' : ''
            }`}
          >
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide sm:w-1/4 flex-shrink-0">
              {key.replace(/_/g, ' ')}
            </span>
            <div className="sm:w-3/4">
              {Array.isArray(value) ? (
                <div className="space-y-2">
                  {value.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                    >
                      {renderNestedData(item, depth + 1)}
                    </div>
                  ))}
                </div>
              ) : typeof value === 'object' && value !== null ? (
                renderNestedData(value, depth + 1)
              ) : (
                <span className="text-sm text-gray-700 font-medium block">{String(value)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white shadow-lg flex flex-col p-4 md:p-6 md:fixed md:h-screen">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-lg mb-4 md:mb-6">
          <h1 className="text-lg md:text-xl font-bold text-white text-center">Data Finder</h1>
          <p className="text-indigo-100 text-xs text-center mt-1">
            Lookup IFSC, Pincode, IP, Country, Weather, News
          </p>
        </div>

        <div className="relative mb-4 md:mb-6">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter query (e.g., city, IP, keyword)"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="space-y-3">
          {[
            { type: 'ifsc', icon: FiDollarSign, label: 'IFSC Lookup' },
            { type: 'pincode', icon: FiMapPin, label: 'Pincode Lookup' },
            { type: 'ip', icon: FiGlobe, label: 'IP Lookup' },
            { type: 'country', icon: FiFlag, label: 'Country Lookup' },
            { type: 'weather', icon: FiCloud, label: 'Weather Lookup' },
          ].map((button) => (
            <button
              key={button.type}
              onClick={() => fetchData(button.type)}
              disabled={loading}
              className={`w-full flex items-center gap-2 py-2 px-4 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-all duration-200 border border-indigo-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <button.icon className="text-lg" /> {button.label}
            </button>
          ))}

          {/* News Section with Categories */}
          <div className="space-y-2">
            <button
              onClick={() => fetchData('news')}
              disabled={loading}
              className={`w-full flex items-center gap-2 py-2 px-4 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-all duration-200 border border-indigo-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiRss className="text-lg" /> News Lookup (Custom)
            </button>
            <div className="flex flex-wrap gap-2">
              {newsCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    setSelectedCategory(category.value);
                    fetchData('news', category.value);
                  }}
                  disabled={loading}
                  className={`flex-1 py-1 px-2 text-xs font-medium rounded-md border transition-all duration-200 ${
                    selectedCategory === category.value
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 md:ml-80">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          {error && (
            <div className="mb-4 md:mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="text-red-500 text-lg flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-10 md:py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="text-sm text-gray-600 mt-2">Loading...</p>
            </div>
          )}

          {data && !loading && (
            <div className="bg-gradient-to-b from-gray-50 to-white p-4 md:p-6 rounded-lg shadow-inner border border-gray-100">
              <div className="flex items-center gap-2 mb-4 bg-gray-50 py-2 border-b border-gray-200">
                <FiSearch className="text-indigo-600 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">Results</h3>
              </div>
              <div className="space-y-2">{renderNestedData(data)}</div>
            </div>
          )}

          {!data && !loading && !error && (
            <div className="text-center py-10 md:py-20 text-gray-500">
              <FiSearch className="text-4xl mx-auto mb-2" />
              <p>Enter a query or select a category in the sidebar to see results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataFinder;
// import { useState } from 'react';
// import { FiSearch, FiMapPin, FiGlobe, FiDollarSign, FiAlertCircle, FiFlag } from 'react-icons/fi';

// const DataFinder = () => {
//   const [input, setInput] = useState('');
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchData = async (apiType) => {
//     setLoading(true);
//     setError('');
//     setData(null);

//     try {
//       let response, result;

//       switch (apiType) {
//         case 'ifsc':
//           response = await fetch(`https://ifsc.razorpay.com/${input}`);
//           if (!response.ok) throw new Error('Invalid IFSC Code or service unavailable');
//           result = await response.json();
//           if (result.error || result.message?.includes('error')) throw new Error('Invalid IFSC Code');
//           setData(Object.fromEntries(Object.entries(result).filter(([_, value]) => value !== null && value !== undefined)));
//           break;

//         case 'pincode':
//           response = await fetch(`https://api.postalpincode.in/pincode/${input}`);
//           if (!response.ok) throw new Error('Invalid Pincode');
//           result = await response.json();
//           if (result[0].Status === 'Error') throw new Error('Pincode not found');
//           const filteredPincode = {
//             ...result[0],
//             PostOffice: result[0].PostOffice.map(po => Object.fromEntries(Object.entries(po).filter(([_, value]) => value !== null && value !== undefined)))
//           };
//           setData(filteredPincode);
//           break;

//         case 'ip':
//           const url = input ? `https://ipapi.co/${input}/json/` : 'https://ipapi.co/json/';
//           response = await fetch(url);
//           if (!response.ok) throw new Error('Invalid IP address');
//           result = await response.json();
//           if (result.error) throw new Error(result.reason);
//           setData(Object.fromEntries(Object.entries(result).filter(([_, value]) => value !== null && value !== undefined)));
//           break;

//         case 'country':
//           response = await fetch(`https://restcountries.com/v3.1/name/${input}`);
//           if (!response.ok) throw new Error('Country not found');
//           result = await response.json();
//           if (!result.length) throw new Error('No data for this country');
//           const filteredCountry = Object.fromEntries(
//             Object.entries(result[0]).filter(([_, value]) => value !== null && value !== undefined)
//           );
//           setData(filteredCountry);
//           break;

//         default:
//           return;
//       }
//     } catch (err) {
//       setError(err.message || 'Something went wrong. Please try again.');
//       console.error('Fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderNestedData = (obj, depth = 0) => {
//     if (!obj || typeof obj !== 'object') {
//       return <span className="text-gray-600 text-sm">{String(obj)}</span>;
//     }

//     return (
//       <div className={`space-y-2 ${depth > 0 ? 'ml-4' : ''}`}>
//         {Object.entries(obj).map(([key, value]) => (
//           <div
//             key={key}
//             className={`flex flex-col sm:flex-row sm:items-start gap-2 p-2 rounded-lg ${
//               depth === 0 ? 'hover:bg-gray-100 transition-colors duration-200' : ''
//             }`}
//           >
//             <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide sm:w-1/4 flex-shrink-0">
//               {key.replace(/_/g, ' ')}
//             </span>
//             <div className="sm:w-3/4">
//               {Array.isArray(value) ? (
//                 <div className="space-y-2">
//                   {value.map((item, index) => (
//                     <div
//                       key={index}
//                       className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
//                     >
//                       {renderNestedData(item, depth + 1)}
//                     </div>
//                   ))}
//                 </div>
//               ) : typeof value === 'object' && value !== null ? (
//                 renderNestedData(value, depth + 1)
//               ) : (
//                 <span className="text-sm text-gray-700 font-medium block">{String(value)}</span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Sidebar */}
//       <div className="w-80 bg-white shadow-lg flex flex-col p-6 fixed h-screen">
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-lg mb-6">
//           <h1 className="text-xl font-bold text-white text-center">Data Finder</h1>
//           <p className="text-indigo-100 text-xs text-center mt-1">
//             Lookup IFSC, Pincode, IP, or Country Info
//           </p>
//         </div>

//         <div className="relative mb-6">
//           <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Enter IFSC, Pincode, IP, or Country"
//             className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//           />
//         </div>

//         <div className="space-y-3">
//           {[
//             { type: 'ifsc', icon: FiDollarSign, label: 'IFSC Lookup' },
//             { type: 'pincode', icon: FiMapPin, label: 'Pincode Lookup' },
//             { type: 'ip', icon: FiGlobe, label: 'IP Lookup' },
//             { type: 'country', icon: FiFlag, label: 'Country Lookup' },
//           ].map((button) => (
//             <button
//               key={button.type}
//               onClick={() => fetchData(button.type)}
//               disabled={loading}
//               className={`w-full flex items-center gap-2 py-2 px-4 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-all duration-200 border border-indigo-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//               <button.icon className="text-lg" /> {button.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-80 p-6 overflow-auto">
//         <div className="bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-3rem)]">
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2">
//               <FiAlertCircle className="text-red-500 text-lg flex-shrink-0" />
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           )}

//           {loading && (
//             <div className="text-center py-20">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
//               <p className="text-sm text-gray-600 mt-2">Loading...</p>
//             </div>
//           )}

//           {data && !loading && (
//             <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-lg shadow-inner border border-gray-100">
//               <div className="flex items-center gap-2 mb-4 bg-gray-50 py-2 border-b border-gray-200">
//                 <FiSearch className="text-indigo-600 text-lg" />
//                 <h3 className="text-lg font-semibold text-gray-800">Results</h3>
//               </div>
//               <div className="space-y-2">{renderNestedData(data)}</div>
//             </div>
//           )}

//           {!data && !loading && !error && (
//             <div className="text-center py-20 text-gray-500">
//               <FiSearch className="text-4xl mx-auto mb-2" />
//               <p>Enter a query in the sidebar to see results here.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataFinder;