import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // ✅ Ajout d'un état pour stocker l'utilisateur

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  if (
    
  )
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/auth/me", {
//           withCredentials: true,
//         });
  
//         if (response.data.user) {
//           console.log("Utilisateur connecté :", response.data.user);
//           setUser(response.data.user);
  
//           // ✅ Ne redirige que si tu n'es PAS déjà sur la page d'accueil
//           if (window.location.pathname === "/login") {
//             navigate("/");
//           }
//         }
//       } catch (error) {
//         console.log("Utilisateur non authentifié");
//       }
//     };
  
//     checkAuth();
//   }, [navigate]);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 relative">
      <h1 className="text-2xl font-bold">Connexion</h1>

      {user ? (
        // ✅ Si l'utilisateur est connecté, afficher son avatar et un bouton de déconnexion
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <img 
            src={user.avatar} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border border-gray-300 shadow-md" 
          />
          <p>{user.firstname || user.email}</p>
          <button 
            onClick={() => window.location.href = "http://localhost:3000/auth/logout"}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      ) : (
        // ✅ Si l'utilisateur n'est pas connecté, afficher les boutons d'authentification
        <div className="flex flex-col gap-3">
          <button onClick={() => handleOAuthLogin("google")} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Connexion avec Google
          </button>
          <button onClick={() => handleOAuthLogin("twitter")} disabled={loading} className="bg-blue-400 text-white px-4 py-2 rounded-md">
            Connexion avec Twitter
          </button>
          <button onClick={() => handleOAuthLogin("github")} disabled={loading} className="bg-gray-800 text-white px-4 py-2 rounded-md">
            Connexion avec GitHub
          </button>
        </div>
      )}
    </div>
  );
}
