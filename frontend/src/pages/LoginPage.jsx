import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // ✅ Ajout d'un état pour stocker l'utilisateur

  const handleOAuthLoginGithub = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23li9yK9sMMbZM0WOC&redirect_uri=http://localhost:3000/user/oauth/github`;
  };

  const handleSignOut = async () => {
    try {
      await axios.post("http://localhost:3000/user/signout", {
        withCredentials: true,
      });
      console.log(response);
      window.location.href = "http://localhost:5173"
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/me", {
          withCredentials: true,
        });
        if (response.data.id) {
          setUser(response.data);
        }
      } catch (error) {
        console.log("Utilisateur non authentifié");
      }
    };
  
    checkAuth();
  }, [navigate]);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 relative">
      <h1 className="text-2xl font-bold">Connexion</h1>

      {user ? (
        // ✅ Si l'utilisateur est connecté, afficher son avatar et un bouton de déconnexion
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <p>{user.firstname}</p>
          <button 
            onClick={() => handleSignOut()}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      ) : (
        // ✅ Si l'utilisateur n'est pas connecté, afficher les boutons d'authentification
        <div className="flex flex-col gap-3">
          <button onClick={() => handleOAuthLoginGithub()} className="bg-gray-800 text-white px-4 py-2 rounded-md">
            Connexion avec GitHub
          </button>
        </div>
      )}
    </div>
  );
}
