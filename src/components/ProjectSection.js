import { clearSectionContainer } from "./Sidebar";
import priorityIcon from "../assets/priority.svg";
import { format, startOfToday } from "date-fns";

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
    sectionContainer.append(createAddTask(), createAddTaskOptions());
  };

  return projectAddTaskBtn;
}

function createAddTask() {
  // container
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task__container");

  const taskName = document.createElement("input");
  taskName.classList.add("task__input", "task__input--title");
  taskName.placeholder = "Some Placeholder title here";
  taskName.type = "text";

  const taskDesc = document.createElement("textarea");
  taskDesc.classList.add("task__input", "task__input--textarea");
  taskDesc.placeholder = "Some placeholder desc here";

  const taskPriority = document.createElement("select");
  taskPriority.classList.add(
    "task__input",
    "task__input--select",
    "task__input--prio"
  );
  taskPriority.id = "taskPriority";

  // add priority
  taskPriority.add(
    addTaskPriority("Select Priority", "option", "disabled", "true")
  );
  // TODO: Add Flag Svg
  taskPriority.add(addTaskPriority("High Priority", "option--high"));
  taskPriority.add(addTaskPriority("Medium Priority", "option--medium"));
  taskPriority.add(addTaskPriority("Low Priority", "option--low"));

  // change color on load
  taskPriority.onload = () => {
    setTaskPriorityColor(taskPriority);
  };

  taskPriority.oninput = () => {
    setTaskPriorityColor(taskPriority);
  };

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

function addTaskPriority(
  priority,
  className,
  disabled = false,
  selected = false
) {
  const option = document.createElement("option");

  option.classList.add(className);
  option.disabled = disabled;
  option.selected = selected;
  option.text = priority;
  return option;
}

function setTaskPriorityColor(element) {
  console.log(element.value);
  switch (element.value) {
    case "High Priority":
      element.style.color = "#d1453b";
      break;
    case "Medium Priority":
      element.style.color = "#eb8909";
      break;
    case "Low Priority":
      element.style.color = "#837d7d";
  }
}

function createAddTaskOptions() {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task__container", "task__container--options");

  const taskAddBtn = document.createElement("button");
  taskAddBtn.classList.add("task__button", "task__button--add");
  taskAddBtn.textContent = "Add Task";

  const taskCancelBtn = document.createElement("button");
  taskCancelBtn.classList.add("task__button");
  taskCancelBtn.textContent = "Cancel";

  taskContainer.append(taskCancelBtn, taskAddBtn);

  return taskContainer;
}
