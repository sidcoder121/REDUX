import { useDispatch, useSelector } from 'react-redux'
import { fetchPhotos, fetchVideos } from '../api/mediaApi'
import { setQuery, setLoading, setError, setResults } from '../redux/features/searchSlice'
import { useEffect, useState } from 'react'

export const ResultGrid = () => {
    const dispatch = useDispatch() 
    const { query, loading, activeTab, results, error } = useSelector((store) => store.search)
    
    const [downloadingIds, setDownloadingIds] = useState({})
    // State to track the currently selected media item for full-size viewing
    const [selectedMedia, setSelectedMedia] = useState(null)

    useEffect(function(){
        if (!query || !query.trim()) {
            dispatch(setResults([]))
            return;
        }

        const getdata = async () => {
            try {
                dispatch(setLoading(true))
                dispatch(setError(null)) 
                dispatch(setResults([]))

                let data = [];

                if (activeTab === 'Photos') {
                    let response = await fetchPhotos(query)     
                    if (response?.results) {
                        data = response.results.map((item) => ({
                            id: item.id,
                            type: 'photo',
                            title: item.alt_description || 'untitled-photo',
                            thumbnail: item.urls?.small || item.urls?.regular, 
                            src: item.urls?.full || item.urls?.regular
                        }))
                    }
                }

                if (activeTab === 'Videos') {
                    let response = await fetchVideos(query)
                    if (response?.videos) {
                        data = response.videos.map((item) => ({
                            id: item.id,
                            type: 'video',
                            title: item.user?.name ? `video-by-${item.user.name}` : 'untitled-video',
                            thumbnail: item.image, 
                            src: item.video_files?.[0]?.link
                        }))
                    }
                }

                dispatch(setResults(data))

            } catch (err) {
                console.error("Fetch failed:", err)
                dispatch(setError(err.message || 'Failed to fetch media results.'))
            } finally {
                dispatch(setLoading(false)) 
            }
        }

        getdata()
    }, [query, activeTab, dispatch])

    const handleDownload = async (e, url, filename, id) => {
        // Stop the click from bubbling up to the card container and triggering the full-size view modal
        e.stopPropagation();
        
        if (!url) return;
        setDownloadingIds(prev => ({ ...prev, [id]: true }))

        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)
            
            const link = document.createElement('a')
            link.href = blobUrl
            
            const safeName = filename.toLowerCase().replace(/[^a-z0-9]/g, '-')
            link.download = `${safeName}-${id}.${activeTab === 'Photos' ? 'jpg' : 'mp4'}`
            
            document.body.appendChild(link)
            link.click()
            
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
        } catch (err) {
            console.error("Download failed:", err)
            window.open(url, '_blank')
        } finally {
            setDownloadingIds(prev => ({ ...prev, [id]: false }))
        }
    }

    return (
        <div className="p-4 w-full">
            {loading && (
                <div className="text-center py-8">
                    <p className="text-gray-500 animate-pulse">Searching for {activeTab.toLowerCase()} matching "{query}"...</p>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded my-4">
                    <strong>Error:</strong> {error}
                </div>
            )}
            
            {!loading && !error && query && results?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No {activeTab.toLowerCase()} found for "{query}". Try another keyword.</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results && results.map((item) => (
                    <div key={item.id} className="group relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-black flex flex-col justify-between h-64">
                        
                        {/* Container click opens the full-size media viewer */}
                        <div 
                            onClick={() => setSelectedMedia(item)}
                            className="w-full flex-grow overflow-hidden relative bg-gray-900 flex items-center justify-center cursor-zoom-in"
                        >
                            {item.type === 'photo' ? (
                                <img 
                                    src={item.thumbnail} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                            ) : (
                                <video 
                                    src={item.src} 
                                    poster={item.thumbnail} 
                                    preload="none"
                                    className="w-full h-full object-cover pointer-events-none" 
                                />
                            )}

                            {/* Overlay Download Button */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <button
                                    onClick={(e) => handleDownload(e, item.src, item.title, item.id)}
                                    disabled={downloadingIds[item.id]}
                                    className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-1.5 px-3 rounded-full text-xs shadow-md flex items-center gap-1 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {downloadingIds[item.id] ? (
                                        <>
                                            <span className="w-2 h-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-3 border-t border-gray-100 shrink-0">
                            <p className="text-gray-800 text-sm font-medium truncate capitalize" title={item.title}>
                                {item.title}
                            </p>
                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mt-0.5">
                                {item.type}
                            </span>
                        </div>

                    </div>
                ))}
            </div>

            {/* LIGHTBOX MODAL: Full Size Media Preview Layer */}
            {selectedMedia && (
                <div 
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedMedia(null)}
                >
                    {/* Close button */}
                    <button 
                        className="absolute top-4 right-4 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
                        onClick={() => setSelectedMedia(null)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Modal Inner Window */}
                    <div 
                        className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()} // Stop modal closure if item itself is tapped
                    >
                        {selectedMedia.type === 'photo' ? (
                            <img 
                                src={selectedMedia.src} 
                                alt={selectedMedia.title} 
                                className="max-w-full max-h-[85vh] object-contain rounded"
                            />
                        ) : (
                            <video 
                                src={selectedMedia.src} 
                                poster={selectedMedia.thumbnail}
                                controls 
                                autoPlay
                                className="max-w-full max-h-[85vh] object-contain rounded" 
                            />
                        )}
                        
                        {/* Absolute description plate inside Lightbox */}
                        <div className="absolute bottom-[-40px] left-0 right-0 text-center text-white text-sm truncate px-4">
                            {selectedMedia.title}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResultGrid