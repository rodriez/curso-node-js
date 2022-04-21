import UserService from "./services/UserService.js";
import UserPeristenceFileRepository from "./repositories/UserPersistenceFileRepository.js";

const userPersitenceRepo = new UserPeristenceFileRepository('data.json')
const userService = new UserService(userPersitenceRepo);
try {
    userService.addUser({ name: "User1", email: "user1@test.com", pass: "contraseña" })
} catch (e) {
    console.log(e.message)
}