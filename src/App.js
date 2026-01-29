import logo from './logo.svg';
import './css/App.css';
import AppRautes from './routes.js';
import AuthProvider from './Page/Context/AuthContext.js';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRautes />
      </AuthProvider>
    </div>
  );
}

export default App;