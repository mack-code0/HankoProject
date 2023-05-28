import { Toaster } from "react-hot-toast"
import { RoutePaths } from "./routes"

function App() {
  return (
    <>
      <RoutePaths />
      <Toaster toastOptions={{
        success: {
          style: {
            background: "green",
            color: "#fff"
          }
        }
      }} />
    </>
  )
}

export default App
