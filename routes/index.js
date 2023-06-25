const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

//if wrong route input

router.use((req, res) => {
  res.status(404).send("<h1> 🤡 404 Error! Please Check Your Route and Try again</h1>");
});

module.exports = router;
