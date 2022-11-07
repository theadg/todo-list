import { clearSectionContainer } from "./Sidebar";
import {
  compareAsc,
  format,
  formatISO,
  parseISO,
  startOfToday,
} from "date-fns";

export default function ProjectSection(project) {
  const sectionContainer = document.querySelector("#sectionContainer");
  clearSectionContainer();
  // Project Title
  const projectTitle = document.createElement("h2");
  projectTitle.classList.add("project__text--title");
  projectTitle.textContent = project.title;

  const projectSection = document.createElement("div");
  projectSection.classList.add("project");
  projectSection.append(projectTitle);
  sectionContainer.append(projectSection);

  // Project Tasks
  //   Empty
  if (project.tasks.length === 0) {
    // projectEmpty.append(projectAddTaskBtn);
    projectSection.append(
      emptyText("You have no current tasks for this project")
    );
    projectSection.append(createAddTaskBtn());

    // TODO: REFACTOR MUNA

    // TODO: ADD TASK FUNCTIONALITY
  } else {
  }
  showTasks(project.tasks);
  return { projectTitle };
}

function showTasks(tasks) {
  tasks.forEach((element) => {
    const taskTitle = document.createElement("h3");
    taskTitle.textContent = element.name;

    const taskDesc = document.createElement("p");
    taskDesc.textContent = element.desc;

    const taskDate = document.createElement("input");
    taskDate.type = "date";

    taskDate.setAttribute("value", element.date);
    taskDate.value = element.date;

    sectionContainer.append(taskTitle, taskDesc, taskDate);
  });
}

function emptyText(text) {
  const projectEmpty = document.createElement("h2");
  projectEmpty.classList.add("project__text--prompt");
  projectEmpty.textContent = text;

  return projectEmpty;
}

function removeElement(element) {
  const projectElement = document.querySelector(`${element}`);
  projectElement.remove();
}

function createAddTaskBtn() {
  // TODO: create add task btn
  const projectAddTaskBtn = document.createElement("button");
  projectAddTaskBtn.classList.add("project__button--add", "project__button");
  const addProjectIcon = document.createElement("span");
  addProjectIcon.classList.add("material-symbols-outlined");
  addProjectIcon.textContent = "add_circle";
  projectAddTaskBtn.textContent = "Add Task";
  projectAddTaskBtn.append(addProjectIcon);

  // add on click here
  projectAddTaskBtn.onclick = () => {
    // remove empty text and btn
    removeElement(".project__text--prompt");
    removeElement(".project__button--add");

    // show add task ui
    sectionContainer.append(createAddTask());
  };
  return projectAddTaskBtn;
}

function createAddTask() {
  // container
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task__container");

  const taskName = document.createElement("input");
  taskName.classList.add("task__input");
  taskName.placeholder = "Some Placeholder title here";
  taskName.type = "text";

  const taskDesc = document.createElement("textarea");
  taskDesc.classList.add("task__input");
  taskDesc.placeholder = "Some placeholder title here";

  const taskPriority = document.createElement("select");
  taskPriority.classList.add("task__input", "task__input--select");
  taskPriority.id = "taskPriority";

  // add priority
  taskPriority.add(addTaskPriority("High Priority"));
  taskPriority.add(addTaskPriority("Medium Priority"));
  taskPriority.add(addTaskPriority("Low Priority"));

  const currentDate = format(startOfToday(), "yyyy-MM-dd");
  const taskDate = document.createElement("input");
  taskDate.classList.add("task__input", "task__input--select");
  taskDate.type = "date";
  console.log(currentDate);
  taskDate.min = currentDate;
  taskDate.value = currentDate;

  const selectContainer = document.createElement("div");
  selectContainer.classList.add("task__container--select");
  selectContainer.append(taskPriority, taskDate);
  taskDate.onclick = () => (taskDate.value = currentDate);
  taskContainer.append(taskName, taskDesc, selectContainer);
  return taskContainer;
}

function addTaskPriority(priority) {
  const option = document.createElement("option");
  option.text = priority;

  return option;
}
