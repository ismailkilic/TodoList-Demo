package net.ikilic.ismail.todos.todolist;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.ikilic.ismail.todos.user.User;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Matt Stine
 */
@Entity
@Data

@ToString(exclude = {"list"})
@Table(name="todo_item")
public class TodoItem {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String description;

    @CreatedDate
    private Date deadline;
    @CreationTimestamp
    private Date create_at;
    private boolean completed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TODO_ITEM_PARENT_ID")
    @JsonIgnore
    private TodoItem parent_item;



    @OneToMany(mappedBy = "parent_item",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<TodoItem> items = new ArrayList<>();


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TODO_LIST_ID")
    @JsonIgnore
    private TodoList list;

    @OneToOne
    @JoinColumn(name = "OWNER_USER_ID")
    @JsonIgnore
    private User owner;

    public TodoItem(String name, TodoList list, User owner,String description,Date deadline) {
        this.setName(name);
        this.setList(list);
        this.setOwner(owner);
        this.setDescription(description);
        this.setDeadline(deadline);
    }
    public TodoItem() {
    }

    public static TodoItem from(TodoItemRequest todoItemRequest, TodoList todoList) {
        return new TodoItem(todoItemRequest.getName(), todoList, todoList.getOwner(),todoItemRequest.getDescription(),todoItemRequest.getDeadline());
    }

    public void merge(TodoItemRequest request) {
        this.setName(request.getName());
        this.setCompleted(request.isCompleted());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public TodoList getList() {
        return list;
    }

    public void setList(TodoList list) {
        this.list = list;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
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

    public Date getCreate_at() {
        return create_at;
    }

    public void setCreate_at(Date create_at) {
        this.create_at = create_at;
    }



    public TodoItem getParent_item() {
        return parent_item;
    }

    public void setParent_item(TodoItem parent_item) {
        this.parent_item = parent_item;
    }

    public List<TodoItem> getItems() {
        return items;
    }

    public void setItems(List<TodoItem> items) {
        this.items = items;
    }
}
