package net.ikilic.ismail.todos.user;

import org.springframework.data.repository.CrudRepository;

/**
 * @author Matt Stine
 */
public interface UserRepository extends CrudRepository<User, Long> {
    User findByEmail(String email);
}
