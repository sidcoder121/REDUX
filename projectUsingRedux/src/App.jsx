import { ResultGrid } from "./components/ResultGrid"
import SearchBar from "./components/SearchBar"
import { Tabs } from "./components/Tabs"

export const App = () => {

 
  return (
    <div className='h-screen w-full bg-gray-950 text-taupe-50'>
     <SearchBar/>
     <Tabs/>
     <ResultGrid/>
      
    </div>
  )
}
export default App