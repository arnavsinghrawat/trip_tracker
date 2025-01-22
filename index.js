import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "1998",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  // { id: 1, name: "Arnav", color: "yellow" },
  // { id: 2, name: "Anirudh", color: "green" },
];

async function checkVisisted() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries where user_id = $1",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log("Countries for user", currentUserId, ":", countries);
  return countries;
}

async function build_users()
{
  const result = await db.query("select user_id as id,user_name as name,user_color as color from user_table");
  return result.rows;
}

app.get("/", async (req, res) => {
  users = await build_users();
  const countries = await checkVisisted();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: users.find(user => user.id === currentUserId).color
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    if (result.rows.length === 0) {
      const visitedCountries = await checkVisisted();
      return res.render("index.ejs", {
        countries: visitedCountries,
        total: visitedCountries.length,
        users: await build_users(),
        color: users.find(user => user.id === currentUserId).color,
        error: "Country not found"
      });
    }

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code,user_id) VALUES ($1,$2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.post("/user", async (req, res) => {
  if(req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = parseInt(req.body.user);
    res.redirect("/");
  }
});

async function checkName(name)
{
  try{
    const result = await db.query("select user_color from user_table where user_name = $1",[name]);
    if(result.rowCount === 0)
    {
      return true;
    }else{
      return false;
    }
  }catch(err)
  {
    console.log("data base error",err.stack);
    return false;
  }
}

async function checkColor(color)
{
  try{
    const result = await db.query("select user_color from user_table where user_name = $1",[color]);
    if(result.rowCount === 0)
    {
      return true;
    }else{
      return false;
    }
  }catch(err)
  {
    console.log("data base error",err.stack);
    return false;
  }
}


app.post("/new", async (req, res) => {
  if(await checkName(req.body.name))
  {
    if(await checkColor(req.body.color))
    {
      try
      {
        await db.query("insert into user_table(user_name,user_color) values($1,$2)",[req.body.name,req.body.color]);
        res.redirect("/");
      }
      catch(err)
      {
        console.log("data base error",err.stack);
        res.render("new.ejs");
      }
      
    }
    else{
      res.render("new.ejs");
    }
  }else{
    res.render("new.ejs");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
