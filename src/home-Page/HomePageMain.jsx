import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import HeroSection from "./HeroSection";
import HomeConsciousSection from "./HomeConsciousSection";
import HomeProducts from "./HomeProducts";
import NailCutomed from "./NailCutomed";
import QouteSection from "./QouteSection";
import { useAuthContext } from "../hooks/useAuthContext";
import DemoBanner from "./Navbars/DemoBanner";

const HomePageMain = () => {
  const { state, checkAuthStatus } = useAuthContext();

  return (
    <>
      <DemoBanner />
      <section style={{ border: "1px solid black" }}>
        <HeroSection />
      </section>
      <section style={{ border: "1px solid black" }}>
        <HomeProducts />
      </section>
      <section>
        <QouteSection />
      </section>
      <section className="home-conscious-wrapper">
        <HomeConsciousSection />
      </section>
      <section>
        <NailCutomed />
      </section>
    </>
  );
};

export default HomePageMain;
