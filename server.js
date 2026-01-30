const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* ---------- UTIL: FIND SMALLEST UNUSED NUMBER ---------- */
function getNextId(rows, field) {
  const ids = rows.map((r) => r[field]).sort((a, b) => a - b);
  let next = 1;
  for (let id of ids) {
    if (id === next) next++;
    else break;
  }
  return next;
}

/* ---------------- CATEGORY APIs ---------------- */

app.get("/api/categories", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY id", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post("/api/categories", (req, res) => {
  const { name } = req.body;

  db.query("SELECT id FROM categories ORDER BY id", (err, rows) => {
    if (err) return res.status(500).send(err);

    const newId = getNextId(rows, "id");

    db.query(
      "INSERT INTO categories (id, name) VALUES (?, ?)",
      [newId, name],
      (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: newId, name });
      },
    );
  });
});

app.put("/api/categories/:id", (req, res) => {
  const { name } = req.body;
  db.query(
    "UPDATE categories SET name=? WHERE id=?",
    [name, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    },
  );
});

app.delete("/api/categories/:id", (req, res) => {
  db.query("DELETE FROM categories WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

/* ---------------- PRODUCT APIs ---------------- */

app.get("/api/products", (req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  const offset = (page - 1) * pageSize;

  const sql = `
    SELECT p.productId, p.productName, p.categoryId, c.name AS categoryName
    FROM products p
    JOIN categories c ON p.categoryId = c.id
    ORDER BY p.productId
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [pageSize, offset], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post("/api/products", (req, res) => {
  const { name, categoryId } = req.body;

  db.query("SELECT productId FROM products ORDER BY productId", (err, rows) => {
    if (err) return res.status(500).send(err);

    const newId = getNextId(rows, "productId");

    db.query(
      "INSERT INTO products (productId, productName, categoryId) VALUES (?, ?, ?)",
      [newId, name, categoryId],
      (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({
          productId: newId,
          productName: name,
          categoryId,
        });
      },
    );
  });
});

app.put("/api/products/:id", (req, res) => {
  const { name, categoryId } = req.body;
  db.query(
    "UPDATE products SET productName=?, categoryId=? WHERE productId=?",
    [name, categoryId, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    },
  );
});

app.delete("/api/products/:id", (req, res) => {
  db.query("DELETE FROM products WHERE productId=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

/* ---------------- SERVER ---------------- */

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
