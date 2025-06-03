import "./App.css";
import { Layout, App as AntApp } from "antd";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ConfigProvider } from "antd";

import StoriesMain from "./stories component/StoriesMain";
import SaloonMain from "./saloon components/SaloonMain";
import LoginPage from "./home-Page/LoginPage";
import NavBar from "./home-Page/Navbars/NavBar";
import MobileNavBar from "./home-Page/Navbars/Mobile nav/MobileNavBar";
import HomePageMain from "./home-Page/HomePageMain";
import FooterSection from "./home-Page/FooterSection";
import ShopMainPage from "./shop components/ShopMainPage";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignUpPage from "./home-Page/SignUpPage";
import DashBoard from "./dashboard/DashBoard";
import { AuthProvider } from "./providers/authProvider";
import { useAuthContext } from "./hooks/useAuthContext";
import { CartProvider } from "./providers/cartProvider";
import { Drawerprovider } from "./providers/DrawerProvider";
import CheckOutPage from "./home-Page/CheckoutPage/CheckOutPage";
import SearchProvider from "./providers/SearchProvider";
import EmailVerificationPage from "./home-Page/EmailVerificationPage";

const { Header, Footer, Content } = Layout;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

function App() {
  const { state } = useAuthContext();

  return (
    <GoogleOAuthProvider clientId="1018277959135-oejj32maeibck9r97iu61s6vahj1tgjj.apps.googleusercontent.com">
      <AuthProvider>
        <Drawerprovider>
          <CartProvider>
            <SearchProvider>
              <ConfigProvider
                theme={{
                  token: {
                    colorLink: "black",
                    colorLinkHover: "black",
                  },
                }}
              >
                <AntApp>
                  <Router>
                    <ScrollToTop />
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
                        <Routes>
                          <Route path="/" element={<HomePageMain />} />

                          <Route path="/shop" element={<ShopMainPage />} />
                          <Route path="/stories" element={<StoriesMain />} />
                          <Route path="/saloon" element={<SaloonMain />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/signup" element={<SignUpPage />} />
                          <Route path="/dashboard" element={<DashBoard />} />
                          <Route path="/checkout" element={<CheckOutPage />} />
                          <Route
                            path="/verify-email/:token"
                            element={<EmailVerificationPage />}
                          />
                          <Route
                            path="/verify-email/success"
                            element={<EmailVerificationPage />}
                          />
                          <Route
                            path="/verify-email/failed"
                            element={<EmailVerificationPage />}
                          />
                        </Routes>
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
                  </Router>
                </AntApp>
              </ConfigProvider>
            </SearchProvider>
          </CartProvider>
        </Drawerprovider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
