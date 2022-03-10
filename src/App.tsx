import { GlobalStyle } from "./styles/global";
import { Header } from "./components/Header";
import Routes from './routes';
 
export function App() {
  

  return (
    <div className="App">
      <Header />
      <Routes />
      <GlobalStyle />
    </div>
  );
}