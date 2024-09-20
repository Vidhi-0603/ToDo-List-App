const toDoValue=document.getElementById("todoText");
const toDoAlert=document.getElementById("alert");
const listItems=document.getElementById("list-items");
const appUpdate=document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
  todo = [];
}


function createToDoItem(){
    if (toDoValue.value === "") {
        toDoAlert.innerHTML = "Please Enter your todo text";
        toDoValue.focus();
        return;
    } else {
        let isPresent = false;
        todo.forEach((element) => {
            if (element.item == toDoValue.value){
                isPresent= true;
            }
        });

        if (isPresent) {
            setAlertMessage("This item already present in the list!");
            return;
        }

        let li = document.createElement("li");
        const toDoItem=`<div title="Hit double click and complete" ondblclick="completeToDoItem(this);">${toDoValue.value}</div>
        <div><i class="fa-solid fa-pencil todo-controls edit" onclick="editToDoItem(this);"></i>
        <i class="fa-solid fa-trash-can todo-controls delete" onclick="deleteToDoItem(this);"></i></div>`;
        li.innerHTML = toDoItem;
        listItems.appendChild(li);

        if (!todo) {
            todo = [];
        }
        let itemList = { item: toDoValue.value, status: false };
        todo.push(itemList);
        setLocalStorage();

    }
    toDoValue.value = "";
    setAlertMessage("Todo item Created Successfully!");
}

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}

function readToDoItem(){
    todo.forEach((element) => {
        let li= document.createElement("li");
        let style="";
        if(element.status) {
            style="style='text-decoration:line-through'";
        }

        const toDoItem = `<div ${style} title="hit double click and Complete" ondblclick="completeToDoItem(this);">${element.item}
        ${
            style === "" ? "" : '<i class="fa-regular fa-circle-check todo-controls"></i>'
        }</div>
        <div>
        ${
            style === "" ? '<i class="fa-solid fa-pencil todo-controls edit"  onclick="editToDoItem(this);"></i>' : "" 
        }
        <i class="fa-solid fa-trash-can todo-controls delete" onclick="deleteToDoItem(this);"></i>
        </div>`;
        li.innerHTML = toDoItem;
        listItems.appendChild(li);
    });
}

readToDoItem();

function editToDoItem(e){
    if(
        e.parentElement.parentElement.querySelector("div").style.textDecoration === ""
    ){
        toDoValue.value = e.parentElement.parentElement.querySelector("div").innerText;
        updateText = e.parentElement.parentElement.querySelector("div");
        appUpdate.setAttribute("onclick","editSelectedItem()");
        appUpdate.setAttribute("src","refresh.jpg");
        toDoValue.focus();
    }
}

function editSelectedItem(){
    let isPresent = false;
    todo.forEach((element) => {
        if(element.item == toDoValue.value){
            isPresent = true;
        }
    });

    if(isPresent){
        setAlertMessage("This item already present in the list!");
        appUpdate.setAttribute("src","plus.png");
        appUpdate.setAttribute("onclick","createToDoItem()");
        toDoValue.value="";
        return;
    }

    todo.forEach((element) => {
        if(element.item == updateText.innerText.trim()){
            element.item = toDoValue.value;
        }
    });
    
    setLocalStorage();

    updateText.innerText = toDoValue.value;
    appUpdate.setAttribute("src","plus.png");
    appUpdate.setAttribute("onclick","createToDoItem()");
    toDoValue.value="";
    setAlertMessage("Todo item Updated Successfully!");

}

function deleteToDoItem(e){
    let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;

    if(confirm(`Are you sure, do you want to delete this ${deleteValue}!`)){
        e.parentElement.parentElement.setAttribute("class","deleted-item");
        toDoValue.focus();
        let count=0;
        todo.forEach((element) => {
            if(element.item == deleteValue.trim()){
                todo.splice(count, 1);
            }
            count++;
        });

        setTimeout(() => {
            e.parentElement.parentElement.remove();
        },1000);

        setLocalStorage();
    }
}

function completeToDoItem(e){
    if(e.parentElement.querySelector("div").style.textDecoration === ""){
        let i = document.createElement("i");
        i.className="fa-regular fa-circle-check todo-controls" ;
        e.parentElement.querySelector("div").style.textDecoration = "line-through";
        e.parentElement.querySelector("div").appendChild(i);
        e.parentElement.querySelector(".edit").remove();

        todo.forEach((element) => {
            if(e.parentElement.querySelector("div").innerText.trim() == element.item){
                element.status = true;
            }
        });

        setLocalStorage();
        setAlertMessage("Todo item Completed Successfully!");

    }else{
        e.parentElement.querySelector("div i").remove();
        e.parentElement.querySelector("div").style.textDecoration = "";
        todo.forEach((element) => {
            if(e.parentElement.querySelector("div").innerText.trim() == element.item){
                element.status = false;
            }
        });
        e.parentElement.querySelectorAll("div")[1].innerHTML=`<i class="fa-solid fa-pencil todo-controls edit"  onclick="editToDoItem(this);"></i>
        <i class="fa-solid fa-trash-can todo-controls delete" onclick="deleteToDoItem(this);"></i>`;
        setLocalStorage();
        setAlertMessage("Todo item marked as incomplete!");

    }
}


function setAlertMessage(message) {
    toDoAlert.removeAttribute("class");
    toDoAlert.innerText = message;
    setTimeout(() => {
      toDoAlert.classList.add("toggleMe");
    }, 1000);
  }