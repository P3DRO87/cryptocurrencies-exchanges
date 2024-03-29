import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MainLogo from "../assets/main-logo.png";
import ListBoxSearch from "./ListBoxSearch";
import { CoinContext } from "../context/CoinContext";
import { fetchCoins } from "../assets/js/fetchCoins";

const Header = () => {
   const { pathname } = useLocation();

   const { state, searchCoins } = useContext(CoinContext);
   const { coin, coinSearch, BASE_URL, limit } = state;

   const isCorrectPath = pathname.includes(coin?.id);

   const [isFocusInputActive, setIsFocusInputActive] = useState(false);
   const [loadedCoins, setLoadedCoins] = useState([]);
   const isListBoxActive = coin && isCorrectPath && isFocusInputActive && coinSearch;
   useEffect(() => {
      let isMounted = true;

      document.addEventListener("click", (e) => {
         !e.target.matches("#search") && setIsFocusInputActive(false);
      });

      fetchCoins(limit).then((coins) => {
         if (!isMounted) return;

         setLoadedCoins(coins);
      });

      return () => (isMounted = false);
   }, [BASE_URL, coin, limit]);

   return (
      <header>
         <div className="container-fluid">
            <div className="row justify-content-between">
               <div className="col-lg-3 col-sm-6">
                  <div className="logo-container">
                     <Link className="main-link d-flex" to="/">
                        <div className="img-logo-container">
                           <img
                              className="main-logo"
                              src={MainLogo}
                              alt="cripto coins..."
                           />
                        </div>
                        <p>
                           <span>Cryptocurrencies </span>
                           <span>Exchanges</span>
                        </p>
                     </Link>
                  </div>
               </div>
               <div className="col-lg-4 col-sm-6 position-relative d-flex align-items-center">
                  <div className="search-bar-container w-100">
                     <input
                        id="search"
                        value={coinSearch}
                        type="text"
                        className="form-control"
                        name="search"
                        onChange={(e) => searchCoins(e.target.value)}
                        onFocus={() => setIsFocusInputActive(true)}
                        autoComplete="off"
                     />
                     <div className="search-icon-container">
                        <i className="fas fa-search"></i>
                     </div>
                     {isListBoxActive && (
                        <ListBoxSearch
                           loadedCoins={loadedCoins}
                           setIsFocusInputActive={setIsFocusInputActive}
                        />
                     )}
                  </div>
               </div>
               <div className="col-lg-3 col-sm-12 d-flex align-items-center">
                  <ul className="link-list">
                     {loadedCoins.slice(0, 3).map((coin) => (
                        <li key={coin.id}>
                           <Link to={`/coin/${coin.id}`}>{coin.name}</Link>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </header>
   );
};
export default Header;
