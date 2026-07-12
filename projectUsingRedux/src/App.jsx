import { fetchPhotos, fetchVideos } from "./api/mediaApi"

export const App = () => {

 
  return (
    <div className='h-screen w-full bg-gray-950 text-taupe-50'>
      <button className="bg-amber-200 text-black" onClick={async ()=>{
        const data = await fetchPhotos("nature")
        console.log(data)}
        }>Get Photos</button>

        <button className="bg-emerald-800 text-amber-700"
        onClick={async ()=>{
          const data = await fetchVideos("nature")
          console.log(data)
        }}>Get videos</button>
      
    </div>
  )
}
export default App