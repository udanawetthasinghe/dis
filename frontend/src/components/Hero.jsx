import { Container, Card, Button } from "react-bootstrap";
import mainImage from "../img/main.jpg"; // Update with the actual path to your image

const Hero = () => {
  return (
    <div className="py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
          <h1 className="text-center mb-4">
            Dengue Information System
          </h1>
          <img
            src={mainImage}
            alt="Main"
            className="mb-4"
            style={{ width: "100%", height: "auto" }}
            data-testid="mainImage"
          />
          <p className="text-center mb-4">
            we introduce a multi-platform, centralized proactive management
            system to manage dengue controlling activities in Sri Lanka. The
            system make common platform (DIS) for all sectors who contribute
            their services for mitigating dengue. We mainly focused to the
            special feature of the system which enhance the centralized
            property. Cross platform environment was developed under this
            feature as a bridge to connect researches and general public. ProDMS
            is a internet base web application and researches can plug their
            dengue forecasting models to the system and publish their outputs as
            graphs through the web system
          </p>
          <p className="text-center mb-4">
for more
          </p>
          <div className="d-flex">
          
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
