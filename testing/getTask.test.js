process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const server = require("../app.js");

chai.use(chaiHttp);

describe("User workflow tests", () => {
  it("should register + login a user and manage tasks with the token", (done) => {
    let token; // Declare a variable to store the token
    let taskId; // Declare a variable to store the ID of the task

    // 1) Register new user
    let user = {
      firstName: "hadi",
      lastName: "noureddine",
      userName: "hadi.noureddine",
      email: "hadi@gmail.com",
      password: "password",
      role: "admin",
    };
    chai
      .request(server)
      .post("/auth/signup")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(201);
        expect(res.body).to.be.a("object");

        // 2) Login the user
        chai
          .request(server)
          .post("/auth/signin")
          .send({
            userName: "hadi.noureddine",
            password: "password",
          })
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(200);
            token = res.body.token; // Store the token

            // 3) Create a task with the token
            let taskData = {
              name: "task",
              description: "test",
              assignedTo: "regular",
              createdBy: "hadi.noureddine",
            };

            chai
              .request(server)
              .post("/tasks")
              .set("Authorization", `Bearer ${token}`)
              .send(taskData)
              .end((err, res) => {
                // Asserts for task creation
                expect(res.status).to.be.equal(201);
                taskId = res.body.taskId; // Store the ID of the created task
                // 4) Retrieve the task using GET
                chai
                  .request(server)
                  .get(`/tasks/${taskId}`)
                  .set("Authorization", `Bearer ${token}`)
                  .end((err, res) => {
                    // Asserts for task retrieval
                    expect(res.status).to.be.equal(200);

                    // 5) Edit the task and change its information
                    let updatedTaskData = {
                      name: "updated task",
                      description: "updated test",
                      assignedTo: "new-regular",
                    };

                    chai
                      .request(server)
                      .put(`/tasks/${taskId}`)
                      .set("Authorization", `Bearer ${token}`)
                      .send(updatedTaskData)
                      .end((err, res) => {
                        // Asserts for task update
                        expect(res.status).to.be.equal(200);

                        // 6) Delete the task
                        chai
                          .request(server)
                          .delete(`/tasks/${taskId}`)
                          .set("Authorization", `Bearer ${token}`)
                          .end((err, res) => {
                            // Asserts for task deletion
                            expect(res.status).to.be.equal(200);
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
});
describe("Regular User Tests", () => {
  let regularToken;
  let regularUserId;

  before((done) => {
    // Sign up as a regular user
    let regularUser = {
      firstName: "Regular",
      lastName: "User",
      userName: "regular.user",
      email: "regular.user@gmail.com",
      password: "regularpassword",
      role: "regular",
    };

    chai
      .request(server)
      .post("/auth/signup")
      .send(regularUser)
      .end((err, res) => {
        expect(res.status).to.be.equal(201);

        // Sign in as the regular user
        chai
          .request(server)
          .post("/auth/signin")
          .send({
            userName: "regular.user",
            password: "regularpassword",
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            regularToken = res.body.token; // Store the regular user's token
            regularUserId = res.body.userId;
            done();
          });
      });
  });

  it("should retrieve the regular user's data", (done) => {
    chai
      .request(server)
      .get(`/users/${regularUserId}`)
      .set("Authorization", `Bearer ${regularToken}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it("should edit the regular user's data", (done) => {
    let updatedUserData = {
      firstName: "Updated",
      lastName: "User",
      userName: "updated.user",
      email: "updated.email@gmail.com",
      password: "newpassword",
      role: "regular", // Make sure the role remains "regular"
    };

    chai
      .request(server)
      .put(`/users/${regularUserId}`)
      .set("Authorization", `Bearer ${regularToken}`)
      .send(updatedUserData)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it("should delete the regular user", (done) => {
    chai
      .request(server)
      .delete(`/users/${regularUserId}`)
      .set("Authorization", `Bearer ${regularToken}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
});
