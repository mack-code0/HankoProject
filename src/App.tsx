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
        },
        error: {
          style: {
            background: "#dd1f4a",
            color: "#fff"
          }
        }
      }} />
    </>
  )
}

export default App
