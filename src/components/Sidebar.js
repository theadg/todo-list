import inboxIcon from "../assets/inbox.png";
import todayIcon from "../assets/today.png";
import upcomingIcon from "../assets/upcoming.png";
import projectIcon from "../assets/project.png";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";
import ProjectSection, {
  ShowProjectContent,
  removeTasks,
  createPageHeader,
  showCurrentTabContent,
} from "./ProjectSection";
import { addDays, format, toDate, parseISO } from "date-fns";

let projectList = [],
  id = 1;
export let currentTab = "Inbox";

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
  // TODO Create Today Section
  const today = sideBarItem(todayIcon, "Today", "upcoming");
  // TODO Create Upcoming Section
  const upcoming = sideBarItem(upcomingIcon, "Upcoming", "upcoming");

  const taskGroup = document.createElement("div");
  taskGroup.append(inbox, today, upcoming);

  const projectGroup = document.createElement("div");
  projectGroup.id = "projectGroup";
  createSideBarProject(projectGroup);

  inbox.onclick = () => {
    addAllTasks();
  };

  today.onclick = () => {
    addTodayTasks();
  };

  upcoming.onclick = () => {
    addUpcomingTasks();
  };
  return [taskGroup, projectGroup];
}

export function addAllTasks() {
  clearSectionContainer();
  removeTasks();
  setCurrentTab("Inbox");
  createPageHeader("Inbox");
  projectList.forEach((project) => {
    ShowProjectContent(project);
  });
}

export function addTodayTasks() {
  clearSectionContainer();
  removeTasks();
  setCurrentTab("Today");
  createPageHeader("Today");
  projectList.forEach((project) => {
    ShowProjectContent(project, true, false);
  });
}

export function addUpcomingTasks() {
  clearSectionContainer();
  removeTasks();
  setCurrentTab("Upcoming");
  createPageHeader("Upcoming");
  projectList.forEach((project) => {
    ShowProjectContent(project, false, true);
  });
}

function setCurrentTab(tab) {
  currentTab = tab;
  console.log("CURRENT TAB", currentTab);
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

export function updateProjectInput(
  userInput,
  taskID,
  projectContainer,
  projectHeader
) {
  const addProjectInputRow = document.createElement("div");
  const { addProjectInputContainer, addProjectInput } =
    createAddProjectInputContainer(userInput);

  addProjectInputRow.classList.add("sidebar__input--row", "addProjectInput");
  addProjectInputRow.append(
    addProjectInputContainer,
    addProjectButtons(
      addProjectInput,
      true,
      taskID,
      projectContainer,
      projectHeader
    )
  );

  return addProjectInputRow;
}

// Create a creator function for addProjectButtons

// Approve
// Adds the project options button
// TODO: Add Cancel button here
function addProjectButtons(
  input,
  edit = false,
  taskID = 0,
  projectContainer = document.querySelector(".project__container"),
  projectHeader = document.querySelector(".project__header")
) {
  console.log(projectContainer, projectHeader);
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
      showCurrentTabContent(findCurrentProject);
    } else {
      addProject(input.value);
    }

    addProjectsToDOM();
  };

  addProjectCancelBtn.onclick = () => {
    // remove the current addproject then add the existing
    removeItemfromDOM(".addProjectInput");
    appendToProjectGroup(addProjectBtn());
    projectContainer.prepend(projectHeader);

    addProjectsToDOM();
  };
  return addProjectInputButtons;
}

// Approve
// Adds the project to Project Group
export function addProjectsToDOM() {
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

export function removeFromProjectList(input) {
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

export function addProject(projName) {
  // create factory function
  let project = {
    Id: id,
    title: projName,
    tasks: [
      {
        name: "TASK 1",
        desc: "DESC 1",
        prio: "High Priority",
        // date: parseISO(format(new Date(), "yyyy-MM-dd")),
        date: format(new Date(), "yyyy-MM-dd"),
        id: 1,
      },
      {
        name: "TASK 2",
        desc: "DESC 2",
        prio: "High Priority",
        date: toDate(format(new Date(), "yyyy-MM-dd")),
        id: 2,
      },
      // {
      //   name: "TASK 3",
      //   desc: "DESC 3",
      //   prio: "High Priority",
      //   date: toDate(format(new Date(), "yyyy-MM-dd")),
      //   id: 3,
      // },
      // {
      //   name: "TASK 4",
      //   desc: "DESC 4",
      //   prio: "High Priority",
      //   // date: parseISO(format(addDays(new Date(), 10), "yyyy-MM-dd")),
      //   date: format(addDays(new Date(), 10), "yyyy-MM-dd"),
      //   id: 4,
      // },
      // {
      //   name: "TASK 5",
      //   desc: "DESC 5",
      //   prio: "High Priority",
      //   // date: parseISO(format(addDays(new Date(), 5), "yyyy-MM-dd")),
      //   date: format(addDays(new Date(), 5), "yyyy-MM-dd"),
      //   id: 5,
      // },
      // {
      //   name: "TASK 6",
      //   desc: "DESC 6",
      //   prio: "High Priority",
      //   // date: parseISO(format(addDays(new Date(), 7), "yyyy-MM-dd")),
      //   date: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      //   id: 6,
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

    // removeItemfromDOM(".sidebar__button--add");

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

    // remove from arrays
    removeFromProjectList(project.title);
    e.stopPropagation();
  };

  ProjectInputContainer.onclick = () => {
    // Clear Elements from Section container before adding new elements
    setCurrentTab("Project");
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
  const sectionContainer = document.querySelector("#sectionContainer");
  while (sectionContainer.firstChild) {
    console.log(sectionContainer.firstChild);
    sectionContainer.firstChild.remove();
  }
}

window.onload = () => {
  addProject("General Tasks");
  addProjectsToDOM();
  addAllTasks();
};
