package net.ikilic.ismail.todos.todolist;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

/**
 * @author Matt Stine
 */
@Data
@NoArgsConstructor
public class TodoItemCreatedResponse {
    private String id;
    private String name;
    private String description;
    private Date deadline;
    private List<TodoItem> todoItemList;




    public TodoItemCreatedResponse(String id, String name, String description, Date deadline, List<TodoItem> todoItemList) {
        this.setId(id);
        this.setName(name);
        this.setDeadline(deadline);
        this.setDescription(description);
        this.setTodoItemList(todoItemList);

    }

    public static TodoItemCreatedResponse from(TodoItem todoItem) {
        return new TodoItemCreatedResponse(todoItem.getId().toString(), todoItem.getName(),todoItem.getDescription(),todoItem.getDeadline(),todoItem.getItems());
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public List<TodoItem> getTodoItemList() {
        return todoItemList;
    }

    public void setTodoItemList(List<TodoItem> todoItemList) {
        this.todoItemList = todoItemList;
    }


}
