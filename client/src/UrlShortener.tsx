import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Link } from "./models/link.model";
import type { LinkResponse } from "./types/link-response";

const URLShortenerForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [refetch, setRefech] = useState(true);
  const [links, setLinks] = useState<Link[]>([]);
  const [error, setError] = useState("");

  // 🧠 Récupération des liens à chaque changement de "refetch"
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/all");
        setLinks(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des liens :", error);
      }
    };

    if (refetch) {
      fetchLinks();
    }
  }, [refetch]);

  // 🎯 Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/shorten", {
        originalUrl,
      });

      if (response.status !== 200) {
        setError("Erreur lors de la création du lien");
        return;
      }

      const data: LinkResponse = response.data;
      setShortUrl(data.shortUrl);
      setRefech((prev) => !prev); // 🔁 Rafraîchit l'historique
      setOriginalUrl(""); // 🔄 Vide le champ
    } catch (error) {
      console.error("Erreur lors du raccourcissement :", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-6">Raccourcisseur de lien 🔗</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          placeholder="Entrez une URL longue..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full md:w-4/5 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          disabled={!originalUrl}
          type="submit"
          className="bg-black  px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Raccourcir
        </button>
      </form>

      {shortUrl && (
        <div className="mt-6">
          <p className="font-medium">Voici ton lien raccourci :</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            {shortUrl}
          </a>
        </div>
      )}

      {links.length > 0 && (
        <div className="mt-10 text-left">
          <h3 className="text-lg font-semibold mb-4">📜 Historique :</h3>
          <ul className="space-y-4">
            {links.map((link, index) => (
              <li key={index} className="border-b pb-3">
                <p>
                  <strong>Original :</strong>{" "}
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {link.originalUrl}
                  </a>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p>
                    <strong>Court :</strong>{" "}
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-600 underline"
                    >
                      {link.shortUrl}
                    </a>
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(link.shortUrl);
                      alert("Lien copié !");
                    }}
                    className="ml-2 text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                  >
                    Copier
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Créé le :{" "}
                  {new Date(link.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}{" "}
                  à{" "}
                  {new Date(link.createdAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="text-red-600 mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default URLShortenerForm;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import type { Link } from "./models/link.model";
// import type { LinkResponse } from "./types/link-response";

// const URLShortenerForm = () => {
//   const [originalUrl, setOriginalUrl] = useState("");
//   const [shortUrl, setShortUrl] = useState("");
//   //   const [history, setHistory] = useState<Link[]>([]);
//   const [refetch, setRefech] = useState<boolean>(true); // 🗂️ Pour forcer la récupération de l'historique
//   const [links, setLinks] = useState<Link[]>([]); // 🗂️ Historique des liens
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // 🗂️ Récupération de l'historique des liens
//     const fetchLinks = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/all");
//         setLinks(response.data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des liens :", error);
//       }
//     };

//     if (refetch) {
//       fetchLinks();
//     }
//   }, [refetch]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:5000/shorten", {
//         originalUrl,
//       });

//       if (response.status !== 200) {
//         setError("Erreur lors de la création du lien");
//         return;
//       }
//       const data: LinkResponse = response.data;
//       setShortUrl(data.shortUrl);

//       // 🧠 Ajoute ce lien à l'historique local
//       //   setHistory((prev) => [...prev, data]);
//       setRefech((prev) => !prev); // 🗂️ Force la récupération de l'historique

//       // Réinitialise le champ texte
//       setOriginalUrl("");
//     } catch (error) {
//       console.error("Erreur lors du raccourcissement :", error);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
//       <h2>Raccourcisseur de lien 🔗</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Entrez une URL longue..."
//           value={originalUrl}
//           onChange={(e) => setOriginalUrl(e.target.value)}
//           style={{ width: "80%", padding: "8px", height: 35 }}
//         />
//         <div style={{ marginTop: 10 }}>
//           <button type="submit" style={{ padding: "8px 16px", marginLeft: 10 }}>
//             Raccourcir
//           </button>
//         </div>
//       </form>

//       {shortUrl && (
//         <div style={{ marginTop: 20 }}>
//           <p>Voici ton lien raccourci :</p>
//           <a
//             href={links.find((item) => item.shortUrl == shortUrl)?.originalUrl}
//             target="_blank"
//             rel="noreferrer"
//           >
//             {shortUrl}
//           </a>
//         </div>
//       )}

//       {/* 🗂️ Affichage de la liste d'historique */}
//       {links.length > 0 && (
//         <div style={{ marginTop: 40, textAlign: "left" }}>
//           <h3>📜 Historique :</h3>
//           <ul>
//             {links.map((link, index) => (
//               <>
//                 <li key={index}>
//                   <strong>Original :</strong>{" "}
//                   <a href={link.originalUrl} target="_blank" rel="noreferrer">
//                     {link.originalUrl}
//                   </a>
//                   <br />
//                   <strong>Court :</strong>{" "}
//                   <a href={link.shortUrl} target="_blank" rel="noreferrer">
//                     {link.shortUrl}
//                   </a>
//                 </li>
//                 <br />
//                 <strong>Créé le: </strong>
//                 <span>
//                   {new Date(link.createdAt).toLocaleDateString("fr-FR", {
//                     year: "numeric",
//                     month: "2-digit",
//                     day: "2-digit",
//                   })}
//                 </span>{" "}
//                 à {""}
//                 <span>
//                   {new Date(link.createdAt).toLocaleTimeString("fr-FR", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </span>
//               </>
//             ))}
//           </ul>
//         </div>
//       )}

//       {true && (
//         <div style={{ color: "red", marginTop: 20 }}>
//           <p>{error}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default URLShortenerForm;
