import { useEffect } from "react";
import { api } from "./services/api";
import { GlobalStyle } from "./styles/global";
 
export function App() {
  useEffect(() => {
    api.get('neo/rest/v1/feed', { 
      params: {
        'start_date': '2022-01-01',
        'end_date': '2022-01-08',
        'api_key': process.env.REACT_APP_NASA_API_KEY
      } 
    })
      .then(response => console.log(response.data))
  }, []);

  return (
    <div className="App">
      <h1>Hola!</h1>
      <GlobalStyle />
    </div>
  );
}