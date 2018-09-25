package net.ikilic.ismail.todos.acceptance;

import net.ikilic.ismail.todos.todolist.TodoItemRequest;
import io.restassured.RestAssured;
import io.restassured.authentication.FormAuthConfig;
import io.restassured.http.ContentType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;

import static io.restassured.RestAssured.given;
import static org.hamcrest.core.IsEqual.equalTo;

/**
 * @author Matt Stine
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class OutOfProcessControllerTest {

	@LocalServerPort
	private int serverPort;

	@Before
	public void setUp() {
		RestAssured.baseURI = "http://localhost";
		RestAssured.port = serverPort;
	}

	@Test
	public void shouldCreateListItem() {
		TodoItemRequest request = new TodoItemRequest("write a component test","description",new Date());

		given()
				.auth().form("ismail@example.com", "password",
				new FormAuthConfig("/login", "username", "password"))
				.body(request)
				.accept(ContentType.JSON)
				.contentType(ContentType.JSON)
				.post("/lists/1/items")
				.then()
				.statusCode(201)
				.body("id", equalTo("14"))
				.body("name", equalTo("write a component test"));
	}
}
