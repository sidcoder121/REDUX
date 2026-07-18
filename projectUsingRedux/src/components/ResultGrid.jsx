import { useDispatch, useSelector } from 'react-redux'
import { fetchPhotos, fetchVideos } from '../api/mediaApi'
import { setQuery, setLoading, setError, setResults } from '../redux/features/searchSlice'
import { useEffect } from 'react'

export const ResultGrid = () => {
    // 1. FIX: Assign useDispatch to a variable
    const dispatch = useDispatch() 
    
    // 2. FIX: Ensure activeTab matches your Redux state name (assuming 'activeTab' based on Tabs.jsx)
    const { query, loading, activeTab, results, error } = useSelector((store) => store.search)
   

    useEffect(function(){
        const getdata = async () => {
        let data;
        if (activeTab === 'Photos') {
            let response = await fetchPhotos(query)     
            data = response.results.map((item)=>({
                id:item.id,
                type:'photo',
                title:item.alt_description,
                thumbnail:items.urls.small,
                src:items.urls.full

            }))
        }
         if (activeTab === 'Videos') {
            let response = await fetchVideos(query)
            data = response.videos.map((item)=>({
                id:item.id,
                type:'video',
                title:item.user.name || 'video',
                thumbnail:items.image,
                src:items.video_files[0].link

            }))
           
        }
       dispatch(setResults(data))
    }
        getdata()
    },[query,activeTab])


    return (
        <div>
           
        </div>
    )
}

export default ResultGrid