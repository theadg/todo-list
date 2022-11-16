import { clearSectionContainer } from "./Sidebar";
import { format, startOfToday } from "date-fns";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

let taskID = 1;

export default function ProjectSection(project) {
  const sectionContainer = document.querySelector("#sectionContainer");
  clearSectionContainer();
  // removeTasks();

  // Project Container
  const projectContainer = document.createElement("div");
  projectContainer.classList.add("project__container");

  // Project Title
  const projectTitle = document.createElement("h2");
  projectTitle.classList.add("project__text--title");
  projectTitle.textContent = project.title;

  const projectSection = document.createElement("div");
  projectSection.classList.add("project");
  projectSection.append(projectTitle);

  projectContainer.append(projectSection);
  // Project Tasks
  //   Empty
  if (project.tasks.length === 0) {
    // projectEmpty.append(projectAddTaskBtn);
    projectSection.append(
      emptyText("You have no current tasks for this project")
    );
    projectSection.append(createAddTaskBtn(project, projectContainer));
  } else {
    removeTasks();

    createTaskUI(project.tasks, project, projectContainer);
  }

  sectionContainer.append(projectContainer);
  return { projectTitle };
}

export function clearProjectContainer() {
  const projectContainer = document.querySelector("#projectContainer");
  while (projectContainer.firstChild) {
    console.log(projectContainer.firstChild);
    projectContainer.firstChild.remove();
  }
}

export function ShowProjectContent(project, today = false, incoming = false) {
  const projectTitle = document.createElement("h2");
  projectTitle.classList.add("project__text--title");
  projectTitle.textContent = project.title;

  const projectSection = document.createElement("div");
  projectSection.classList.add("project");

  const projectContainer = document.createElement("div");
  projectContainer.classList.add(".project__container");

  projectSection.append(projectTitle);
  // just show the tasks here
  projectContainer.append(projectSection);
  createTaskUI(project.tasks, project, projectContainer, today, incoming);

  sectionContainer.append(projectContainer);
}

export function removeTasks() {
  const projectContainer = document.querySelector(".project__container");
  if (!projectContainer) return;

  const projectTasks = Array.from(
    document.querySelectorAll(".task__container")
  );

  // while (projectContainer.firstChild) {
  //   projectContainer.removeChild(projectContainer.firstChild);
  // }
  projectTasks.forEach((task) => task.remove());
}

// const projectContainer = document.createElement("div");
// projectContainer.id = "projectContainer";

function createTaskUI(
  tasks,
  project,
  projectContainer = document.querySelector(".project__container"),
  today = false,
  incoming = false
) {
  console.log("PROJECT TASK UI", projectContainer);
  createTaskContainer(tasks, project, projectContainer, today, incoming);
  projectContainer.append(createAddTaskBtnRow(project, projectContainer));
  sectionContainer.append(projectContainer);
}

function createTaskContainer(
  tasks,
  project,
  projectContainer,
  today,
  incoming
) {
  // Decides here kung anong
  tasks.map((element) => {
    if (element.completed) return;
    if (!today && !incoming) {
      createTaskBlock(element, project, projectContainer);
    } else if (today) {
      if (element.date === format(new Date(), "yyyy-MM-dd")) {
        createTaskBlock(element, project, projectContainer);
      }
    } else if (incoming) {
      if (element.date > format(new Date(), "yyyy-MM-dd")) {
        createTaskBlock(element, project, projectContainer);
      }
    }
  });
}

function createTaskBlock(
  element,
  project,
  projectContainer = document.querySelector(".project__container")
) {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task__container", "task__container--item");

  const taskCheckbox = document.createElement("input");
  taskCheckbox.classList.add("task__input--checkbox");
  taskCheckbox.type = "checkbox";

  const taskTitle = document.createElement("h3");
  taskTitle.classList.add("task__input", "task__input--name");
  taskTitle.textContent = element.name;

  const taskDesc = document.createElement("p");
  taskDesc.classList.add("task__input", "task__input--desc");
  taskDesc.textContent = element.desc;

  const taskPriority = document.createElement("select");
  taskPriority.classList.add(
    checkPriority(element.prio),
    "task__input",
    "task__input--select",
    "task__input--prio"
  );
  taskPriority.add(addTaskPriority(element.prio));
  taskPriority.disabled = true;

  const taskDate = document.createElement("input");
  taskDate.type = "date";
  taskDate.classList.add("task__input", "task__input--select");
  taskDate.value = element.date;
  taskDate.disabled = true;

  const selectContainer = document.createElement("div");
  selectContainer.classList.add("task__container--select");
  selectContainer.append(taskPriority, taskDate);

  const textInput = document.createElement("div");
  textInput.classList.add("task__container--text");
  textInput.append(taskTitle, taskDesc, selectContainer);

  const taskOptions = document.createElement("div");
  // taskOptions.classList.add("sidebar__project--option", "hidden");
  taskOptions.classList.add("sidebar__project--option");

  const taskEdit = new Image();
  taskEdit.src = editIcon;
  taskEdit.classList.add("sidebar__icon", "sidebar__icon--small");
  taskEdit.onclick = () => {
    removeElement("#addProjTask");

    taskContainer.after(updateTask(element, project, projectContainer));
    taskContainer.remove();
  };

  const taskDelete = new Image();
  taskDelete.src = deleteIcon;
  taskDelete.classList.add("sidebar__icon", "sidebar__icon--small");

  taskOptions.append(taskEdit, taskDelete);
  taskContainer.append(taskCheckbox, textInput, taskOptions);

  taskCheckbox.onclick = () => {
    // DOM
    taskContainer.remove();

    // App Logic
    element.completed = true;
    console.log(element);
  };

  taskDelete.onclick = () => {
    // remove from DOM
    taskContainer.remove();

    // App Logic
    const currentTask = (task) => task.id === element.id;
    const currentIndex = project.tasks.findIndex(currentTask);
    console.log(project.tasks, currentIndex);

    // remove from app
    project.tasks.splice(currentIndex, 1);
  };

  console.log(projectContainer);
  projectContainer.append(taskContainer);
}

function checkPriority(priority) {
  if (priority === "High Priority") return "option--high";
  else if (priority === "Medium Priority") return "option--medium";
  else if (priority === "Low Priority") return "option--low";
}

function emptyText(text) {
  const projectEmpty = document.createElement("h2");
  projectEmpty.classList.add("project__text--prompt");
  projectEmpty.textContent = text;

  return projectEmpty;
}

function removeElement(element) {
  // element.forEach((element) => {
  //   const projectElement = document.querySelector(`${element}`);
  //   projectElement.remove();
  // });
  document.querySelector(element).remove();
}

function createAddTaskBtn(project, projectContainer) {
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

    projectContainer.append(createAddTask(project));
  };

  return projectAddTaskBtn;
}

function createAddTask(project) {
  // container
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task__container");

  const taskName = document.createElement("input");
  taskName.classList.add("task__input", "task__input--title");
  taskName.placeholder = "Some Placeholder title here";
  taskName.id = "taskName";
  taskName.type = "text";

  const taskDesc = document.createElement("textarea");
  taskDesc.classList.add("task__input", "task__input--textarea");
  taskDesc.placeholder = "Some placeholder desc here";
  taskDesc.id = "taskDesc";

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
  taskDate.min = currentDate;
  taskDate.value = currentDate;
  taskDate.id = "taskDate";

  const selectContainer = document.createElement("div");
  selectContainer.classList.add("task__container--select");
  selectContainer.append(taskPriority, taskDate);
  taskDate.onclick = () => (taskDate.value = currentDate);

  taskContainer.append(taskName, taskDesc, selectContainer);

  const mainTaskContainer = document.createElement("div");
  mainTaskContainer.id = "inputContainer";
  mainTaskContainer.append(taskContainer, createAddTaskOptions(project));

  return mainTaskContainer;

  function createAddTaskOptions(project, projectContainer) {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task__container", "task__container--options");

    const taskAddBtn = document.createElement("button");
    taskAddBtn.classList.add("task__button", "task__button--add");
    taskAddBtn.textContent = "Add Task";

    taskAddBtn.onclick = () => {
      // app logic
      addToProjectTasks(
        project,
        taskName,
        taskDesc,
        taskPriority,
        taskDate,
        mainTaskContainer,
        projectContainer
      );
      removeElement("#addProjTask");
      removeTasks();

      // DOM Logic here
      createTaskUI(project.tasks, project, projectContainer, false, false);
    };

    const taskCancelBtn = document.createElement("button");
    taskCancelBtn.classList.add("task__button");
    taskCancelBtn.textContent = "Cancel";

    taskCancelBtn.onclick = () => {
      mainTaskContainer.remove();
      sectionContainer.append(createAddTaskBtnRow(project, projectContainer));
    };

    taskContainer.append(taskCancelBtn, taskAddBtn);

    return taskContainer;
  }
}

function updateTask(element, project, projectContainer) {
  // container
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task__container");

  const taskName = document.createElement("input");
  taskName.classList.add("task__input", "task__input--title");
  taskName.placeholder = "Some Placeholder title here";
  taskName.id = "taskName";
  taskName.type = "text";
  taskName.value = element.name;

  const taskDesc = document.createElement("textarea");
  taskDesc.classList.add("task__input", "task__input--textarea");
  taskDesc.placeholder = "Some placeholder desc here";
  taskDesc.id = "taskDesc";
  taskDesc.value = element.desc;
  const taskPriority = document.createElement("select");
  taskPriority.classList.add(
    "task__input",
    "task__input--select",
    "task__input--prio"
  );
  taskPriority.id = "taskPriority";
  // add priority
  taskPriority.add(
    addTaskPriority("Select Priority", "option", "disabled", "")
  );
  taskPriority.add(addTaskPriority("High Priority", "option--high"));
  taskPriority.add(addTaskPriority("Medium Priority", "option--medium"));
  taskPriority.add(addTaskPriority("Low Priority", "option--low"));
  const taskPriorityArray = Array.from(taskPriority.children);

  const selectedPriority = taskPriorityArray.find(
    (choice) => choice.value === element.prio
  );

  selectedPriority.selected = true;

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
  taskDate.min = currentDate;
  taskDate.value = currentDate;
  taskDate.id = "taskDate";

  const selectContainer = document.createElement("div");
  selectContainer.classList.add("task__container--select");
  selectContainer.append(taskPriority, taskDate);
  taskDate.onclick = () => (taskDate.value = currentDate);

  taskContainer.append(taskName, taskDesc, selectContainer);

  const mainTaskContainer = document.createElement("div");
  mainTaskContainer.id = "inputContainer";
  // mainTaskContainer.append(taskContainer, createAddTaskOptions(project));
  mainTaskContainer.append(
    taskContainer,
    createUpdateTaskOptions(element, project, projectContainer)
  );

  return mainTaskContainer;

  function createUpdateTaskOptions(element, project) {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task__container", "task__container--options");

    const taskSaveBtn = document.createElement("button");
    taskSaveBtn.classList.add("task__button", "task__button--add");
    taskSaveBtn.textContent = "Save Task";

    taskSaveBtn.onclick = () => {
      // app logic
      updateCurrentTask(
        element,
        taskName.value,
        taskDesc.value,
        taskPriority.value,
        taskDate.value
      );

      removeTasks();

      createTaskUI(project.tasks, project, projectContainer);
      console.log(element);
    };

    const taskCancelBtn = document.createElement("button");
    taskCancelBtn.classList.add("task__button");
    taskCancelBtn.textContent = "Cancel";

    taskCancelBtn.onclick = () => {
      createTaskUI(project.tasks, project, projectContainer);
      taskContainer.remove();
    };

    taskContainer.append(taskCancelBtn, taskSaveBtn);

    return taskContainer;
  }
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

// App Logic for Adding to Project Task
function addToProjectTasks(
  project,
  name,
  desc = "",
  prio,
  date,
  input,
  projectContainer = document.querySelector(".project__container")
) {
  const inputElements = [name, prio, date];
  let valid = true;

  inputElements.forEach((element) => {
    if (element.value === "" || element.value === "Select Priority") {
      element.classList.add("task__input--invalid", "task__input--shake");
      setTimeout(() => {
        element.classList.remove("task__input--shake");
      }, 500);
      valid = false;
    }
  });

  const validation = inputElements.every(validate);

  function validate(element) {
    if (element.value === "Select Priority") return false;
    return element.value !== "";
  }

  // App Logic
  if (valid || validation) {
    project.tasks.push({
      name: name.value,
      desc: desc.value,
      prio: prio.value,
      date: date.value,
      id: taskID,
      completed: false,
    });

    taskID++;

    // DOM
    // console.log(valid, validation);
    console.log(project.tasks);

    input.remove();
    createTaskUI(project.tasks, project, projectContainer, false, false);
  }
}

function createAddTaskBtnRow(
  project,
  projectContainer = document.querySelector(".project__container")
) {
  const addTaskBtnRow = document.createElement("button");
  addTaskBtnRow.classList.add("sidebar__button--add");
  const addProjectIcon = document.createElement("span");
  addProjectIcon.classList.add("material-symbols-outlined");
  addProjectIcon.textContent = "add_circle";
  addTaskBtnRow.textContent = "Add Task";
  addTaskBtnRow.id = "addProjTask";
  addTaskBtnRow.append(addProjectIcon);

  console.log(projectContainer);
  // Add functionality
  addTaskBtnRow.onclick = () => {
    addTaskBtnRow.remove();
    projectContainer.append(createAddTask(project));
  };

  return addTaskBtnRow;
}

// App Logic => Updating Task
function updateCurrentTask(element, name, desc, prio, date) {
  element.name = name;
  element.desc = desc;
  element.prio = prio;
  element.date = date;

  return element;
}

// TODO: sort by date

// TODO: fix bug on Today Edit Save
// TODO: fix save task bug
// TODO: add task bug
