import "./styles/style.scss";
import "normalize.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const container = document.querySelector("#container");

container.append(Navbar());

(function createMainSection() {
  const section = document.createElement("section");
  section.classList.add("section");

  const sectionContainer = document.createElement("div");
  sectionContainer.classList.add("section--main");
  sectionContainer.id = "sectionContainer";

  section.append(Sidebar(), sectionContainer);

  container.append(section);
})();
