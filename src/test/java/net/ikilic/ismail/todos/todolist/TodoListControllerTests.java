package net.ikilic.ismail.todos.todolist;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.ikilic.ismail.todos.TestWebSecurityConfig;
import net.ikilic.ismail.todos.user.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.hamcrest.Matchers.samePropertyValuesAs;
import static org.mockito.Matchers.argThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Matt Stine
 */
@RunWith(SpringRunner.class)
@WebMvcTest
@Import(TestWebSecurityConfig.class)
@ActiveProfiles("test")
public class TodoListControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @MockBean
    private TodoListRepository repository;

    @MockBean
    private TodoItemRepository itemRepository;

    @Test
    @WithUserDetails("ismail@example.com")
    public void testCreate() throws Exception {
        String requestBody = mapper.writeValueAsString(
                new TodoListRequest("chores"));

        TodoListCreatedResponse response = new TodoListCreatedResponse("1", "chores",null);

        TodoList todoList = new TodoList("chores", new User());
        todoList.setId(1L);

        when(repository.save(any(TodoList.class))).thenReturn(todoList);

        mvc.perform(post("/lists")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(content().json(mapper.writeValueAsString(response)));

        verify(repository).save(any(TodoList.class));
    }

    @Test
    @WithUserDetails("ismail@example.com")
    public void testCreateItem() throws Exception {
        String requestBody = mapper.writeValueAsString(
                new TodoItemRequest("buy milk","description",new Date(1537787045)));

        TodoItemCreatedResponse response = new TodoItemCreatedResponse("1", "buy milk","description",new Date(1537787045),null);

        TodoList todoList = new TodoList("chores", new User());
        todoList.setId(1L);

        when(repository.findOneByIdAndOwner(eq(1L), any(User.class)))
                .thenReturn(todoList);

        TodoItem todoItem = new TodoItem("buy milk", todoList, new User(),"description",new Date(1537787045));
        todoItem.setId(1L);

        when(itemRepository.save(any(TodoItem.class))).thenReturn(todoItem);

        mvc.perform(post("/lists/{id}/items", "1")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(content().json(mapper.writeValueAsString(response)));

        verify(itemRepository).save(any(TodoItem.class));
    }

    @Test
    @WithUserDetails("ismail@example.com")
    public void testList() throws Exception {
        List<TodoList> results = Arrays.asList(new TodoList("chores", null), new TodoList("errands", null));
        when(repository.findAllByOwner(any(User.class))).thenReturn(results);

        mvc.perform(get("/lists")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(results)))
                .andDo(print());
    }

    @Test
    @WithUserDetails("ismail@example.com")
    public void testGet() throws Exception {
        User owner = new User();
        TodoList todoList = new TodoList("chores", owner);
        when(repository.findOneByIdAndOwner(eq(1L), any(User.class))).thenReturn(todoList);

        mvc.perform(get("/lists/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(todoList)))
                .andDo(print());
    }

    @Test
    @WithUserDetails("ismail@example.com")
    public void testDelete() throws Exception {
        mvc.perform(delete("/lists/{id}", 1L))
                .andExpect(status().isNoContent())
                .andDo(print());

        verify(repository).deleteByIdAndOwner(eq(1L), any(User.class));
    }

    @Test
    @WithUserDetails("ismail@example.com")
    public void testDeleteItem() throws Exception {
        mvc.perform(delete("/lists/{id}/items/{itemId}", 1L, 1L))
                .andExpect(status().isNoContent())
                .andDo(print());

        verify(itemRepository).deleteByIdAndListAndOwner(eq(1L), any(TodoList.class), any(User.class));
    }

    @Test
    @WithUserDetails("ismail@example.com")
    public void testUpdate() throws Exception {
        User owner = new User();
        TodoList todoList = new TodoList("chores", owner);
        when(repository.findOneByIdAndOwner(eq(1L), any(User.class))).thenReturn(todoList);

        TodoListRequest request = new TodoListRequest("Chores");
        String requestBody = mapper.writeValueAsString(
                request);

        mvc.perform(put("/lists/{id}", 1L)
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        TodoList updatedTodoList = TodoList.from(request, owner);
        verify(repository).save(argThat(samePropertyValuesAs(updatedTodoList)));
    }

    @Test
    @WithUserDetails("ismail@example.com")
    public void testUpdateItem() throws Exception {
        User owner = new User();
        TodoList list = new TodoList();
        list.setOwner(owner);
        Date tempDate=new Date();

        TodoItem todoItem = new TodoItem("buy milk", list, owner,"description",tempDate);
        when(itemRepository.findOneByIdAndListAndOwner(eq(1L), any(TodoList.class), any(User.class))).thenReturn(todoItem);

        TodoItemRequest request = new TodoItemRequest("Buy Milk","description",tempDate);
        String requestBody = mapper.writeValueAsString(request);

        mvc.perform(put("/lists/{id}/items/{itemId}", 1L, 1L)
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        TodoItem updatedTodoItem = TodoItem.from(request, list);
        verify(itemRepository).save(argThat(samePropertyValuesAs(updatedTodoItem)));
    }
}
