import OffLineUrlShortener from "../components/OffLineUrlShortenerComponent";
import "../assets/css/nav.css";
import { isLoggedIn } from "../utils/functions";
import URLShortenerForm from "./UrlShortener.page";
import Navigation from "../components/Navigation";

const HomePage = () => {
  const saveHistoric = isLoggedIn();

  return (
    <>
      <Navigation />

      <div className="flex justify-center items-center flex-col mt-10">
        <p className="p-3 text-2xl font-bold font-stretch-condensed text-blue-500">Créer en quelques secondes un raccourci de vos liens</p>
      </div>
      {!saveHistoric ? <OffLineUrlShortener /> : <URLShortenerForm />}
    </>
  );
};

export default HomePage;
