import { Toaster } from "react-hot-toast"
import { RoutePaths } from "./routes"
import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  hanko-auth,
  hanko-profile {
    /* Color Scheme */
    --color: #fff;
    --color-shade-1: #8f9095;
    --color-shade-2: #5a5a5a;

    --brand-color: #506cf0;
    --brand-color-shade-1: #6b84fb;
    --brand-contrast-color: white;

    --background-color: none;
    --error-color: #e82020;
    --link-color: #506cf0;

    /* Font Styles */
    --font-weight: 400;
    --font-size: 16px;
    --font-family: figtree;

    /* Border Styles */
    --border-radius: 8px;
    --border-style: solid;
    --border-width: 1px;

    /* Item Styles */
    --item-height: 34px;
    --item-margin: 0.5rem 0;

    /* Container Styles */
    --container-padding: 30px;
    --container-max-width: 410px;

    /* Headline Styles */
    --headline1-font-size: 24px;
    --headline1-font-weight: 600;
    --headline1-margin: 0 0 1rem;

    --headline2-font-size: 16px;
    --headline2-font-weight: 600;
    --headline2-margin: 1rem 0 0.5rem;

    /* Divider Styles */
    --divider-padding: 0 42px;
    --divider-visibility: visible;

    /* Link Styles */
    --link-text-decoration: none;
    --link-text-decoration-hover: underline;

    /* Input Styles */
    --input-min-width: 14em;

    /* Button Styles */
    --button-min-width: max-content;

  }
`

function App() {
  return (
    <>
      <GlobalStyles />
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
