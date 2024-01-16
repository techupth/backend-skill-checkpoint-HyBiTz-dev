import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRouter = Router();

const collection = db.collection("questions");

questionRouter.get("/", async (req, res) => {
  try {
    const resData = await collection.find().toArray();
    return res.json(resData);
  } catch {
    return res.json({ message: `Cannot to query question` });
  }
});

questionRouter.get("/:questionId", async (req, res) => {
  try {
    const resData = await collection.findOne({
      _id: new ObjectId(req.params.questionId),
    });
    return res.json(resData);
  } catch (error) {
    return res.json({
      message: `Cannot to query question at id ${req.params.questionId}`,
    });
  }
});

questionRouter.post("/", async (req, res) => {
  try {
    await collection.insertOne({
      ...req.body,
      opinion: 0,
      created_at: new Date(),
    });
  } catch {
    return res.json({ message: "Cannot to create question" });
  }

  return res.json({ message: "Question has been created successfully" });
});

questionRouter.put("/:questionId", async (req, res) => {
  try {
    await collection.updateOne(
      { _id: new ObjectId(req.params.questionId) },
      {
        $set: req.body,
      }
    );
  } catch {
    return res.json({ message: "Cannot to Update question" });
  }

  return res.json({
    message: "Question has been updated successfully",
  });
});

questionRouter.delete("/:questionId", async (req, res) => {
  try {
    await collection.deleteOne({ _id: new ObjectId(req.params.questionId) });
  } catch {
    return res.json({ message: "Cannot to Delete question" });
  }

  return res.json({
    message: "Question has been deleted successfully",
  });
});

export default questionRouter;
