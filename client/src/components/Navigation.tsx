import { useState } from "react";
import { RoutesEnum } from "../configs/router";
import { isLoggedIn } from "../utils/functions";

const Navigation = () => {
  const loginState = isLoggedIn();
  const [loggedIn, setLoggedIn] = useState(loginState);

  const handleLogout = async () => {
    try {
      const { _id: userId, token } = JSON.parse(
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
      setLoggedIn(false);
      window.location.reload();
    } catch (error) {
      console.log("Logout", error);
    }
  };
  return (
    <nav className="bg-gray-900 px-5 py-2 flex justify-between items-center min-h-[10vh] flex-wrap">
      <div className="text-white text-lg font-bold">
        <a href="/">
          <span className="text-white">LINK - SHORTNER</span>
        </a>
      </div>
      <ul className="flex list-none m-0 p-0 gap-5 flex-wrap items-center md:flex-row md:justify-end mt-2 md:mt-0">
        <a
          href="https://github.com/windev0/link-shortener"
          target="_blank"
          className="no-underline flex items-center flex-row justify-between"
        >
          <li className="nav-link text-white hover:text-blue-400 transition-colors">
            <img
              src="/images/github.png"
              color="white"
              alt="github-logo"
              height={50}
              width={50}
            />
          </li>
          <li className="text-white nav-link">Github</li>
        </a>

        {!loggedIn && (
          <>
            <a
              href={RoutesEnum.LOGIN}
              className="no-underline flex items-center"
            >
              <li>
                <img
                  src="/images/archive.png"
                  alt="save-logo"
                  height={50}
                  width={50}
                />
              </li>
              <li className="nav-link text-white hover:text-blue-400 transition-colors">
                Mes sauvegardes
              </li>
            </a>
            <a href="#" className="no-underline">
              <li className="nav-link text-white hover:text-blue-400 transition-colors">
                A Propos
              </li>
            </a>
          </>
        )}
        {loggedIn && (
          <button
            style={{
              backgroundColor: "Highlight", // gray color
            }}
            className="  bg-blue-500 px-4 py-2 rounded hover:bg-blue-500 transition-colors cursor-pointer text-white"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
