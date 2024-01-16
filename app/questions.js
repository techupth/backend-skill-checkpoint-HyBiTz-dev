import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRouter = Router();

const questionsDB = db.collection("questions");

const answerDB = db.collection("answer");

questionRouter.get("/", async (req, res) => {
  try {
    const name = req.query.keywords;
    const category = req.query.category;
    const query = {};

    if (name) {
      query.title = new RegExp(name, "ig");
    }

    if (category) {
      query.category = new RegExp(category, "ig");
    }

    const resData = await questionsDB.find(query).toArray();
    return res.json(resData);
  } catch {
    return res.json({ message: `Cannot to query question` });
  }
});

questionRouter.get("/:questionId", async (req, res) => {
  try {
    const resData = await questionsDB.findOne({
      _id: new ObjectId(req.params.questionId),
    });
    return res.json(resData);
  } catch {
    return res.json({
      message: `Cannot to query question at id ${req.params.questionId}`,
    });
  }
});

questionRouter.get("/:questionId/answer", async (req, res) => {
  try {
    const resData = await answerDB
      .find({
        questionId: req.params.questionId,
      })
      .toArray();
    return res.json(resData);
  } catch {
    return res.json({
      message: `Cannot to query question at id ${req.params.questionId}`,
    });
  }
});

questionRouter.post("/", async (req, res) => {
  try {
    await questionsDB.insertOne({
      ...req.body,
      opinion: 0,
      created_at: new Date(),
    });
  } catch {
    return res.json({ message: "Cannot to create question" });
  }

  return res.json({ message: "Question has been created successfully" });
});

questionRouter.post("/:questionId/answer", async (req, res) => {
  try {
    if (req.body.content.length >= 300) {
      return res.json({ message: "Please Input Less Than 300 word" });
    } else {
      await answerDB.insertOne({
        questionId: req.params.questionId,
        ...req.body,
        opinion: 0,
        created_at: new Date(),
      });
    }
  } catch {
    return res.json({ message: "Cannot to create answer" });
  }

  return res.json({ message: "Answer has been created successfully" });
});

questionRouter.put("/:questionId", async (req, res) => {
  try {
    await questionsDB.updateOne(
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

questionRouter.put("/:questionId/answer/:answerId", async (req, res) => {
  try {
    await answerDB.updateOne(
      { _id: new ObjectId(req.params.answerId) },
      {
        $set: req.body,
      }
    );
  } catch {
    return res.json({ message: "Cannot to Update answer" });
  }

  return res.json({
    message: "answer has been updated successfully",
  });
});

questionRouter.delete("/:questionId", async (req, res) => {
  try {
    await questionsDB.deleteOne({ _id: new ObjectId(req.params.questionId) });
    await answerDB.deleteMany({
      questionId: req.params.questionId,
    });
  } catch {
    return res.json({ message: "Cannot to Delete question" });
  }

  return res.json({
    message: "Question has been deleted successfully",
  });
});

export default questionRouter;
