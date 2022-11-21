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
  getCurrentProjectIndex,
} from "./ProjectSection";
import { format } from "date-fns";
import { nanoid } from "nanoid";

export let projectList = [];

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

function createSideBarItems() {
  const inbox = sideBarItem(inboxIcon, "Inbox", "inbox");
  const today = sideBarItem(todayIcon, "Today", "upcoming");
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

  const currentProjectList = JSON.parse(
    localStorage.getItem("projectListStorage")
  );

  currentProjectList.forEach((project) => {
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
  setTab();
}

function createSideBarProject(projectGroup) {
  projectGroup.append(createSideBarProjectHeader(), addProjectBtn());

  return projectGroup;
}

function createSideBarProjectHeader() {
  const projectMainTitle = document.createElement("p");
  projectMainTitle.textContent = "Projects";
  projectMainTitle.classList.add("sidebar__text--main");

  return projectMainTitle;
}

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

  const currentProjectList = JSON.parse(
    localStorage.getItem("projectListStorage")
  );

  const findCurrentProject = currentProjectList.find(
    (project) => project.Id === taskID
  );

  addProjectSaveBtn.onclick = () => {
    if (edit) {
      // findCurrentProject.edit(input.value);
      updateProjectTitle(findCurrentProject, input.value);
      console.log(findCurrentProject);
      showCurrentTabContent(findCurrentProject);
    } else {
      ProjectSection(addProject(input.value));
    }

    addProjectsToDOM();
  };

  addProjectCancelBtn.onclick = () => {
    removeItemfromDOM(".addProjectInput");
    appendToProjectGroup(addProjectBtn());
    projectContainer.prepend(projectHeader);

    addProjectsToDOM();
  };
  return addProjectInputButtons;
}

export function addProjectsToDOM() {
  clearDOM();
  appendToProjectGroup(createSideBarProjectHeader());

  const currentProjectList = JSON.parse(
    localStorage.getItem("projectListStorage")
  );

  console.log(currentProjectList); //working

  currentProjectList.forEach((project) => {
    const { ProjectInputContainer } = createProjectItems(project);
    createProjectItems(project);
    appendToProjectGroup(ProjectInputContainer);
  });

  appendToProjectGroup(addProjectBtn());
}

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
  populateStorage();
  return projectList;
}

export function addProject(projName) {
  let project = {
    Id: nanoid(),
    title: projName,
    tasks: [
      // {
      //   name: "Smile More",
      //   desc: "",
      //   prio: "High Priority",
      //   // date: parseISO(format(new Date(), "yyyy-MM-dd")),
      //   date: format(new Date(), "yyyy-MM-dd"),
      //   id: 1,
      // },
      // {
      //   name: "Worry Less",
      //   desc: "",
      //   prio: "High Priority",
      //   date: format(new Date(), "yyyy-MM-dd"),
      //   id: 2,
      // },
    ],
    section: (project) => {
      // reference the project from the local storage
      ProjectSection(project);
      // ProjectSection(projectList[getCurrentProjectIndex(project)]);
    },
    edit: (inputField) => {
      project.title = inputField;
      ProjectSection(project).textContent = inputField;
    },
  };

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

  ProjectEdit.onclick = (e) => {
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
    populateStorage();
  };

  ProjectDelete.onclick = (e) => {
    // remove from dom
    ProjectInputContainer.remove();

    // remove from arrays
    removeFromProjectList(project.title);
    populateStorage();
    e.stopPropagation();
    // When pressing delete, we then reload the tab
    setTab(null, true);
    getTab();
  };

  ProjectInputContainer.onclick = () => {
    // Clear Elements from Section container before adding new elements
    setCurrentTab("Project");
    console.log(project);
    // get the most current version of the project
    const currentProjectList = JSON.parse(
      localStorage.getItem("projectListStorage")
    );

    const currentProject = currentProjectList.find(
      (proj) => proj.Id === project.Id
    );

    ProjectSection(currentProject);
    setTab(currentProject);
  };

  return { ProjectInputContainer };
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
  if (localStorage.getItem("hasCodeRunBefore") === null) {
    addProject("General Tasks");
    addInitialTasks();
    addProjectsToDOM();
    addAllTasks();
    populateStorage();
    localStorage.setItem("hasCodeRunBefore", true);

    setTab(null, true);
    getTab();
  } else {
    projectList = JSON.parse(localStorage.getItem("projectListStorage"));
    setProjects();
    getTab();
  }
};

function populateStorage() {
  localStorage.setItem("projectListStorage", JSON.stringify(projectList));
}

export function setTab(project = null, deletedTab = false) {
  localStorage.setItem("currentTab", currentTab);
  deletedTab === true
    ? localStorage.setItem("currentTab", "Inbox")
    : localStorage.setItem("currentTab", currentTab);

  localStorage.setItem("currentProject", JSON.stringify(project));
}

export function getTab() {
  const currentTab = localStorage.getItem("currentTab");
  const currentProject = JSON.parse(localStorage.getItem("currentProject"));

  console.log(currentTab, "DEPOTA");
  switch (currentTab) {
    case "Inbox":
      addAllTasks();
      break;
    case "Today":
      addTodayTasks();
      break;
    case "Upcoming":
      addUpcomingTasks();
      break;
    case "Project":
      ProjectSection(currentProject);
  }
}

export function setProjects() {
  addProjectsToDOM();
}

function updateProjectTitle(project, projTitle) {
  project.title = projTitle;
  ProjectSection(project).textContent = projTitle;

  projectList[getCurrentProjectIndex(project)] = project;
  populateStorage();
}

function addInitialTasks() {
  const currentProjectList = JSON.parse(
    localStorage.getItem("projectListStorage")
  );

  const genTasks = currentProjectList.find(
    (project) => project.title === "General Tasks"
  );

  genTasks.tasks.push(
    {
      name: "Smile More",
      desc: "",
      prio: "High Priority",
      date: format(new Date(), "yyyy-MM-dd"),
      id: 1,
    },
    {
      name: "Worry Less",
      desc: "",
      prio: "High Priority",
      date: format(new Date(), "yyyy-MM-dd"),
      id: 2,
    }
  );

  projectList[getCurrentProjectIndex(genTasks)] = genTasks;
}
