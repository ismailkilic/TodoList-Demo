package net.ikilic.ismail.todos.todolist;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Matt Stine
 */
@Data
@NoArgsConstructor
public class TodoListCreatedResponse {
    private String id;
    private String name;
    private Date create_at;
    private List<TodoItem> items = new ArrayList<>();

    public TodoListCreatedResponse(String id, String name, Date create_at) {
        this.setId(id);
        this.setName(name);
        this.setCreate_at(create_at);

    }

    public static TodoListCreatedResponse from(TodoList todoList) {
        return new TodoListCreatedResponse(todoList.getId().toString(), todoList.getName(),todoList.getCreate_at());
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

    public List<TodoItem> getItems() {
        return items;
    }

    public void setItems(List<TodoItem> items) {
        this.items = items;
    }

    public Date getCreate_at() {
        return create_at;
    }

    public void setCreate_at(Date create_at) {
        this.create_at = create_at;
    }
}
