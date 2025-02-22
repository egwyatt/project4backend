import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// connecting Database
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb"
});

/*************************************************************************
 * QUERY (GET)
 *************************************************************************/
router.get("/", async (req, res) => {       // localhost:5000/users/ [GET]
  console.log("handling localhost:5000/users GET")  
  try {
        const data =  await connection.promise().query(
          "SELECT * FROM users;"
        );
        console.log(data[0])
        res.status(202).json({  // res.send(data)
          users: data[0]
        });
      } catch (err) {
        res.status(500).json({
          message: err
        });
      }
});

/*************************************************************************
 * QUERY ID (GET)
 *************************************************************************/
router.get("/:id", async (req, res) => {       // localhost:5000/users/1 [GET]
    const {id} = req.params;
    console.log("handling localhost:5000/users/" + id + " GET")  
    try {
          const data =  await connection.promise().query(
            "SELECT * FROM users WHERE id = ?;", [id]
          );
          console.log(data[0])
          res.status(202).json({  // res.send(data)
            users: data[0]
          });
        } catch (err) {
          res.status(500).json({
            message: err
          });
        }
});

/*************************************************************************
 * INSERT (POST)
 *************************************************************************/
router.post("/", async (req, res) => {       // localhost:5000/users/ [POST]
    const {username, password, email} = req.body;
    console.log("handling localhost:5000/users/ POST")  
    try {
          const data =  await connection.promise().query(
            "INSERT INTO users (username, password, email) VALUES (?, ?, ?);", [username, password, email]
          );
          console.log(data[0])
          res.status(202).json({  // res.send(data)
            users: data[0]
          });
        } catch (err) {
          res.status(500).json({
            message: err
          });
        }
});

/*************************************************************************
 * UPDATE (PUT)
 *************************************************************************/
router.put("/:id", async (req, res) => {       // localhost:5000/users/:id [PUT]
    const {id} = req.params;
    console.log("handling localhost:5000/users/" + id + " PUT")  
    const {username, password, email} = req.body;
    try {
          const data =  await connection.promise().query(
            "UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?;", [username, password, email, id]
          );
          console.log(data[0])
          res.status(202).json({  // res.send(data)
            users: data[0]
          });
        } catch (err) {
          res.status(500).json({
            message: err
          });
        }
});

/*************************************************************************
 * DELETE (DELETE)
 *************************************************************************/
router.delete("/:id", async (req, res) => {       // localhost:5000/users/:id [DELETE]
    const { id } = req.params;
    console.log("handling localhost:5000/users/" + id + " DELETE");
    try {
        const data = await connection.promise().query(
            "DELETE FROM users WHERE id = ?;", [id]
        );
        console.log(data[0]);
        // Check if any rows were deleted
        if (data[0].affectedRows === 0) {
            return res.status(404).json({
                message: `User with ID ${id} not found`
            });
        }

        // Respond with the affected row count
        res.status(202).json({
            message: `Deleted user with ID ${id}`,
            affectedRows: data[0].affectedRows
        });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            message: "An error occurred while deleting the user",
            error: err.message || err
        });
    }
});

export default router;
