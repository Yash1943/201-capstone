const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
const { application } = require("express");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("sports-scheduler Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });
  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "user A",
      email: "user2.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
    test("should sign in a user", async () => {
    let res2 = await agent.get("/login");
    let csrfToken2 = extractCsrfToken(res2);
    res2 = await agent.post("/session").send({
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken2,
    });
    expect(res2.statusCode).toBe(302);
  });

 test("Sign out", async () => {
    let res = await agent.get("/");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/player");
    expect(res.statusCode).toBe(302);
  });
  
test("Creating a sport", async () => {
  const agent = request.agent(server);
  await login(agent, "user2.a@test.com", "1234567");

  // Get the user record from the database
  const user = await db.Users.findOne({ where: { email: "user2.a@test.com" } });

  // Check if the user is an admin
  if (!user.admin) {
    // The user is not an admin, so return a 403 error
    return expect(403).toBe(403);
  }

  const res = await agent.get("/admin");
  const csrfToken = extractCsrfToken(res);
  const response = await agent.post("/admin").send({
    id: "4",
    sport_name: "cricket",
    _csrf: csrfToken,
  });

  // Check that the response is successful
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe("Sport created successfully");

  // Checking if the sport was added to the database
  const addedSport = await db.sport.findOne({ where: { id: "4" } });
  expect(addedSport).not.toBeNull();
  expect(addedSport.sport_name).toBe("cricket"); // Assuming the sport_name is stored in lowercase

  // Cleaning up - delete the added sport
  await addedSport.destroy();
});
 
// test("Creating a session", async () => {
//   const agent = request.agent(server);
//   await login(agent, "user.a@test.com", "12345678");
//   const res = await agent.get("/create-session");
//   const csrfToken = extractCsrfToken(res);
//   const response = await agent.post("/create-session").send({
//     venue: "hyd",
//     numberofTeams: 2,
//     numberofplayers: 22,
//     playerNames: ["ram", "rishith"],
//     time: new Date(),
//     sportname: "cricket",
//     _csrf: csrfToken,
//   });

//   expect(response.statusCode).toBe(200);
//   expect(response.text).toBe("Sport-session created successfully");

//   // Verify that a new session was added
//   const addedSession = await db.sportsession.findOne({
//     where: { venue: "hyd" },
//   });
//   expect(addedSession).not.toBeNull();

//   // Verify that the session count was incremented for the sport
//   const updatedSport = await db.sport.findOne({ where: { sport_name: "cricket" } });
//   expect(updatedSport).not.toBeNull();
//   expect(updatedSport.sessioncount).toBe(1);

//   // Clean up - delete the added session and sport
//   await addedSession.destroy();
//   await updatedSport.destroy();
// });


});
  

