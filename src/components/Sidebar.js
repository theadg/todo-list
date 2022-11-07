import inboxIcon from "../assets/inbox.png";
import todayIcon from "../assets/today.png";
import upcomingIcon from "../assets/upcoming.png";
import projectIcon from "../assets/project.png";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";
import ProjectSection from "./ProjectSection";

import { compareAsc, format } from "date-fns";

let projectList = [],
  id = 1;
const projectGroup = document.querySelector("#projectGroup");

function sideBarItem(icon, name, id) {
  const sideBarItem = document.createElement("section");
  sideBarItem.classList.add("sidebar__item");
  sideBarItem.id = id;

  const sideBarItemImage = new Image();
  sideBarItemImage.src = icon;
  sideBarItemImage.classList.add("sidebar__icon");
  const sideBarItemText = document.createElement("p");
  sideBarItemText.textContent = name;
  sideBarItemText.classList.add("sidebar__text");

  sideBarItem.append(sideBarItemImage, sideBarItemText);
  return sideBarItem;
}

// Approve
// Creates the sidebar items
function createSideBarItems() {
  const inbox = sideBarItem(inboxIcon, "Inbox", "inbox");
  const today = sideBarItem(todayIcon, "Today", "upcoming");
  const upcoming = sideBarItem(upcomingIcon, "Upcoming", "upcoming");

  const taskGroup = document.createElement("div");
  taskGroup.append(inbox, today, upcoming);

  const projectGroup = document.createElement("div");
  projectGroup.id = "projectGroup";
  createSideBarProject(projectGroup);

  return [taskGroup, projectGroup];
}

// Approve
// Creates the Project Section of the Sidebar
function createSideBarProject(projectGroup) {
  projectGroup.append(createSideBarProjectHeader(), addProjectBtn());

  return projectGroup;
}

// Approve
// Creates the Header of the Project Section of the Sidebar
function createSideBarProjectHeader() {
  const projectMainTitle = document.createElement("p");
  projectMainTitle.textContent = "Projects";
  projectMainTitle.classList.add("sidebar__text--main");

  return projectMainTitle;
}

// Approve
// Adds the Add Project Btn to the Sidebar
function addProjectBtn() {
  const addProjectBtn = document.createElement("button");
  addProjectBtn.classList.add("sidebar__button--add");
  const addProjectIcon = document.createElement("span");
  addProjectIcon.classList.add("material-symbols-outlined");
  addProjectIcon.textContent = "add_circle";
  addProjectBtn.textContent = "Add Project";
  addProjectBtn.append(addProjectIcon);

  addProjectBtn.onclick = () => {
    removeItem(addProjectBtn);
    appendToProjectGroup(addProjectInput());
  };

  return addProjectBtn;
}

// Approve
// Adds the Project Title Input to the Sidebar
function addProjectInput() {
  const addProjectInputContainer = document.createElement("div");
  addProjectInputContainer.classList.add("sidebar__input--container");

  const addProjectInput = document.createElement("input");
  addProjectInput.placeholder = "Project Name";
  addProjectInput.classList.add("sidebar__input");

  const addProjectIcon = new Image();
  addProjectIcon.src = projectIcon;
  addProjectIcon.classList.add("sidebar__icon");

  addProjectInputContainer.append(addProjectIcon, addProjectInput);

  const addProjectInputRow = document.createElement("div");
  addProjectInputRow.classList.add("sidebar__input--row", "addProjectInput");

  addProjectInputRow.append(
    addProjectInputContainer,
    addProjectButtons(addProjectInput)
  );

  return addProjectInputRow;
}

function updateProjectInput(userInput, taskID) {
  const addProjectInputRow = document.createElement("div");
  const { addProjectInputContainer, addProjectInput } =
    createAddProjectInputContainer(userInput);

  addProjectInputRow.classList.add("sidebar__input--row", "addProjectInput");
  addProjectInputRow.append(
    addProjectInputContainer,
    addProjectButtons(addProjectInput, true, taskID)
  );

  return addProjectInputRow;
}

// Create a creator function for addProjectButtons

// Approve
// Adds the project options button
// TODO: Add Cancel button here
function addProjectButtons(input, edit = false, taskID = 0) {
  const { addProjectInputButtons, addProjectCancelBtn, addProjectSaveBtn } =
    createAddProjectButtons();

  input.oninput = () => {
    setSaveButtonState(addProjectSaveBtn, input);
  };

  const findCurrentProject = projectList.find(
    (project) => project.Id === taskID
  );

  addProjectSaveBtn.onclick = () => {
    if (edit) {
      findCurrentProject.edit(input.value);
    } else {
      addProject(input.value);
    }

    addProjectsToDOM();
  };

  addProjectCancelBtn.onclick = () => {
    // remove the current addproject then add the existing
    removeItemfromDOM(".addProjectInput");
    appendToProjectGroup(addProjectBtn());
    addProjectsToDOM();
  };
  return addProjectInputButtons;
}

// Approve
// Adds the project to Project Group
function addProjectsToDOM() {
  clearDOM();
  appendToProjectGroup(createSideBarProjectHeader());

  projectList.forEach((project) => {
    const { ProjectInputContainer } = createProjectItems(project);
    createProjectItems(project);
    appendToProjectGroup(ProjectInputContainer);
  });

  appendToProjectGroup(addProjectBtn());
}

// Approve
// Clears the Project Group Node
function clearDOM() {
  const projectGroup = document.querySelector("#projectGroup");
  while (projectGroup.firstChild) {
    projectGroup.removeChild(projectGroup.lastChild);
  }
}

function removeFromProjectList(input) {
  const projectIndex = projectList.findIndex(
    (project) => project.title === input
  );
  projectList.splice(projectIndex, 1);

  console.log(projectList);
}

function addToProjectList(project) {
  projectList.push(project);

  // console.log(projectList);
  return projectList;
}

function addProject(projName) {
  // create factory function
  let project = {
    Id: id,
    title: projName,
    tasks: [
      // {
      //   name: "Testing Max",
      //   desc: "Testing Desc",
      //   id: id,
      //   date: format(new Date(2022, 12, 14), "yyyy-MM-dd"),
      //   // date: new Date("2022-12-14"),
      // },
      // {
      //   name: "Testing Max2",
      //   desc: "Testing Desc2",
      //   id: id,
      //   // date: new Date("2022-12-14"),
      //   date: format(new Date(2022, 12, 14), "yyyy-MM-dd"),
      // },
    ],
    section: (project) => {
      ProjectSection(project);
    },
    edit: (inputField) => {
      project.title = inputField;
      ProjectSection(project).textContent = inputField;
    },
  };

  updateId();
  addToProjectList(project);

  return project;
}

function appendSideBarItems(sidebar) {
  createSideBarItems().forEach((element) => {
    sidebar.append(element);
  });
}

export default function Sidebar() {
  const sidebar = document.createElement("aside");
  sidebar.classList.add("sidebar");
  appendSideBarItems(sidebar);

  return sidebar;
}

// Refactored Code:

function appendAddProjectBtn(addProjectBtn) {}

function appendToProjectGroup(...item) {
  const projectGroup = document.querySelector("#projectGroup");
  item.forEach((item) => {
    projectGroup.append(item);
  });
}

function removeItem(...item) {
  item.forEach((item) => {
    item.remove();
  });
}

function createAddProjectInputContainer(userInput = "") {
  const addProjectInputContainer = document.createElement("div");
  addProjectInputContainer.classList.add("sidebar__input--container");

  const addProjectInput = document.createElement("input");
  addProjectInput.placeholder = "Project Name";
  addProjectInput.classList.add("sidebar__input");
  addProjectInput.value = userInput;

  const addProjectIcon = new Image();
  addProjectIcon.src = projectIcon;
  addProjectIcon.classList.add("sidebar__icon");

  addProjectInputContainer.append(addProjectIcon, addProjectInput);

  return { addProjectInputContainer, addProjectInput };
}

function createAddProjectButtons() {
  const addProjectSaveBtn = document.createElement("button");
  addProjectSaveBtn.classList.add(
    "sidebar__button",
    "sidebar__button--primary"
  );

  addProjectSaveBtn.textContent = "Save";
  addProjectSaveBtn.disabled = true;
  const addProjectCancelBtn = document.createElement("button");
  addProjectCancelBtn.classList.add("sidebar__button");
  addProjectCancelBtn.textContent = "Cancel";

  const addProjectInputButtons = document.createElement("div");
  addProjectInputButtons.classList.add("sidebar__button--container");

  addProjectInputButtons.append(addProjectCancelBtn, addProjectSaveBtn);

  return { addProjectInputButtons, addProjectCancelBtn, addProjectSaveBtn };
}

function setSaveButtonState(btn, input) {
  if (input.value !== "") {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

function createProjectItems(project) {
  const projectGroup = document.querySelector("#projectGroup");
  const ProjectInputContainer = document.createElement("div");
  ProjectInputContainer.classList.add(
    "sidebar__input--container",
    "sidebar__input--container--output",
    "sidebar__item"
  );

  const ProjectInput = document.createElement("p");
  ProjectInput.textContent = project.title;
  ProjectInput.classList.add("sidebar__input");

  const ProjectIcon = new Image();
  ProjectIcon.src = projectIcon;
  ProjectIcon.classList.add("sidebar__icon");

  const ProjectOptions = document.createElement("div");
  ProjectOptions.classList.add("sidebar__project--option", "hidden");

  const ProjectEdit = new Image();
  ProjectEdit.src = editIcon;
  ProjectEdit.classList.add("sidebar__icon", "sidebar__icon--small");

  const ProjectDelete = new Image();
  ProjectDelete.src = deleteIcon;
  ProjectDelete.classList.add("sidebar__icon", "sidebar__icon--small");

  ProjectOptions.append(ProjectEdit, ProjectDelete);
  ProjectInputContainer.append(ProjectIcon, ProjectInput, ProjectOptions);

  ProjectInputContainer.onmouseover = () => {
    ProjectOptions.classList.remove("hidden");
  };

  ProjectInputContainer.onmouseleave = () => {
    ProjectOptions.classList.add("hidden");
  };

  // TODO: Add Edit functionality
  ProjectEdit.onclick = (e) => {
    // removing dom elements

    removeItemfromDOM(".sidebar__button--add");
    const sideBarItems = Array.from(
      document.querySelectorAll(".sidebar__input--container")
    );
    const currentItem = sideBarItems.find(
      (item) => item.textContent === project.title
    );

    projectGroup.insertBefore(
      updateProjectInput(project.title, project.Id),
      currentItem
    );

    currentItem.remove();

    e.stopPropagation();
  };

  // TODO: Add remove from project list as well
  ProjectDelete.onclick = (e) => {
    // remove from dom
    ProjectInputContainer.remove();

    //remove from array
    removeFromProjectList(project.title);
    e.stopPropagation();
  };
  const sectionContainer = document.querySelector("#sectionContainer");
  ProjectInputContainer.onclick = () => {
    // Clear Elements from Section container before adding new elements

    project.section(project);
  };

  return { ProjectInputContainer };
}

function updateId() {
  id++;
}

function removeItemfromDOM(item) {
  document.querySelector(item).remove();
}

export function clearSectionContainer() {
  while (sectionContainer.firstChild) {
    sectionContainer.removeChild(sectionContainer.firstChild);
  }
}
