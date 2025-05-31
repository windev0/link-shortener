import { useState } from "react";
import type { Link } from "../../models/link.model";
import axios from "axios";

const OffLineUrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [error, setError] = useState("");

  // 🎯 Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/links/shorten?offline=true`,
        {
          originalUrl,
        }
      );

      if (response.status !== 200) {
        setError("Erreur lors de la création du lien");
        return;
      }

      const data: Link = response.data;
      if (data) {
        setLinks((prev) => {
          return [data, ...prev];
        });
        setShortUrl(data.shortUrl);
        setOriginalUrl(""); // 🔄 Vide le champ
      }
    } catch (error) {
      console.error("Erreur lors du raccourcissement :", error);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-6">Raccourcisseur de lien 🔗</h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <input
            type="text"
            required
            placeholder="Entrez une URL longue..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full md:w-4/5 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue  px-6 py-2 rounded hover:bg-blue-700 transition"
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

        {links && links?.length > 0 && (
          <div className="mt-10 text-left">
            <h3 className="text-lg font-semibold mb-4">📜 Historique :</h3>
            <ul className="space-y-4">
              {links?.map((link, index) => (
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
    </>
  );
};

export default OffLineUrlShortener;
