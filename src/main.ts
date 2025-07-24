import app from "./app";

app.listen(3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
