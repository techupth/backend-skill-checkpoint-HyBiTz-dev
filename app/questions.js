import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRouter = Router();

const collection = db.collection("questions");

questionRouter.get("/", async (req, res) => {
  const resData = await collection.find().toArray();

  return res.json(resData);
});

questionRouter.get("/:questionId", async (req, res) => {
  const resData = await collection.findOne({
    _id: new ObjectId(req.params.questionId),
  });

  return res.json(resData);
});

questionRouter.post("/", async (req, res) => {
  await collection.insertOne({
    ...req.body,
    opinion: 0,
    created_at: new Date(),
  });

  return res.json({ message: "Question has been created successfully" });
});

questionRouter.put("/:questionId", async (req, res) => {
  await collection.updateOne(
    { _id: new ObjectId(req.params.questionId) },
    {
      $set: req.body,
    }
  );

  return res.json({
    message: "Question has been updated successfully",
  });
});

questionRouter.delete("/:questionId", async (req, res) => {
  await collection.deleteOne({ _id: new ObjectId(req.params.questionId) });

  return res.json({
    message: "Question has been deleted successfully",
  });
});

export default questionRouter;
