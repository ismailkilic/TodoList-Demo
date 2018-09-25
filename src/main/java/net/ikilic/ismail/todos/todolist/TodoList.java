package net.ikilic.ismail.todos.todolist;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.ikilic.ismail.todos.user.User;
import lombok.Data;
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

@Table(name="todo_list")
public class TodoList {

    @Id
    @GeneratedValue
    private Long id;
    private String name;

    @CreationTimestamp
    private Date create_at;

    @OneToMany(mappedBy = "list",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<TodoItem> items = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "OWNER_USER_ID")
    @JsonIgnore
    private User owner;

    public TodoList(String name, User owner) {
        this.setName(name);
        this.setOwner(owner);

    }
    public TodoList() {
    }
    public static TodoList from(TodoListRequest todoListRequest, User user) {
        return new TodoList(todoListRequest.getName(), user);
    }

    public void merge(TodoListRequest request) {
        setName(request.getName());
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

    public List<TodoItem> getItems() {
        return items;
    }

    public void setItems(List<TodoItem> items) {
        this.items = items;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Date getCreate_at() {
        return create_at;
    }

    public void setCreate_at(Date create_at) {
        this.create_at = create_at;
    }
}
