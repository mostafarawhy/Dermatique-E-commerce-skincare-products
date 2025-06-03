import { Layout } from "antd";
import NavBar from "./Navbars/NavBar";
import FooterSection from "./FooterSection";
import MobileNavBar from "./Navbars/Mobile nav/MobileNavBar";

import HomePageMain from "./HomePageMain";

const { Header, Footer, Content } = Layout;

const HomePage = () => {
  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          width: "100%",
          height: "80px",
          padding: 0,
          background: "#d1cdc7",
        }}
      >
        <NavBar />
        <MobileNavBar />
      </Header>

      <Content>
        <HomePageMain />
      </Content>
      <Footer
        style={{
          width: "100%",
          padding: 0,
          background: "#342f30",
        }}
      >
        <FooterSection />
      </Footer>
    </Layout>
  );
};

export default HomePage;
