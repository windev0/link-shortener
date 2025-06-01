import OffLineUrlShortener from "../components/OffLineUrlShortenerComponent";
import "../assets/css/nav.css";
import { RoutesEnum } from "../configs/router";
import { isLoggedIn } from "../utils/functions";
import URLShortenerForm from "./UrlShortener.page";

const HomePage = () => {
  const saveHistoric = isLoggedIn();

  const handleLogout = async () => {
    try {
      const { _id: userId , token} = JSON.parse(
        window.localStorage.getItem("user") ?? ""
      );
      console.log(userId);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());

      if (response) localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.log("Logout", error);
    }
  };

  return (
    <>
      <nav
        style={{
          backgroundColor: "#222",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "10vh",
          flexWrap: "wrap",
        }}
      >
        <div style={{ color: "white", fontSize: "1.2rem", fontWeight: "bold" }}>
          <a href="/" style={{ color: "white" }}>
            LINK - SHORTNER
          </a>
        </div>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            margin: 0,
            padding: 0,
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <a href="#">
            <li className="nav-link">Code source</li>
          </a>
          <a href={RoutesEnum.LOGIN}>
            <li className="nav-link">Conserver l'historique</li>
          </a>
          <a href="#">
            <li className="nav-link">A Propos</li>
          </a>{" "}
          {saveHistoric && (
            <button
              style={{
                //   marginTop: "6px",
                padding: "5px 10px",

                color: "black",
                backgroundColor: "white",
                border: "none",
              }}
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          )}
        </ul>

        {/* <div>
          <a href="" style={{ color: "white" }}>
            Hello
          </a>
        </div>*/}
      </nav>
      <div style={{ marginTop: "20px", padding: "10px 20px" }}>
        <h1>Créer en quelques secondes un raccourci de vos liens</h1>
      </div>
      {!saveHistoric ? <OffLineUrlShortener /> : <URLShortenerForm />}
    </>
  );
};

export default HomePage;
