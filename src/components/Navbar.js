import Sidebar from "./Sidebar";

function navLogo(logo) {
  const navLogo = document.createElement("h2");
  navLogo.textContent = logo;

  return navLogo;
}

export function navMenuBtn(symbol) {
  const navMenuBtn = document.createElement("span");
  navMenuBtn.classList.add("material-symbols-outlined", "navbar__menu");
  navMenuBtn.textContent = symbol;
  navMenuBtn.id = "navMenuBtn";

  navMenuBtn.onclick = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("sidebar--open");
    console.log(Sidebar().classList);
  };

  return navMenuBtn;
}

export default function Navbar() {
  const nav = document.createElement("nav");
  nav.append(navMenuBtn("menu"), navLogo("TheDoList"));
  nav.classList.add("navbar");

  return nav;
}
