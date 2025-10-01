/**
 * @fileoverview Routes for comment CRUD operations.
 * Exposes an Express router mounted under /api/comments that provides:
 *  - GET /         : list all comments
 *  - POST /        : create a new comment
 *  - GET /:id      : get a comment by id
 *  - PUT /:id      : update a comment by id
 *  - DELETE /:id   : delete a comment by id
 *
 * The routes use the mongoose "Comment" model. Responses are JSON and
 * appropriate HTTP status codes are used for success and error cases.
 */
const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

/**
 * Retrieve all comments.
 *
 * @name GetComments
 * @route GET /api/comments
 * @returns {Promise<void>} 200 - JSON array of comment documents
 * @throws 500 - Internal server error when fetching fails
 */
router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

/**
 * Create a new comment.
 *
 * @name CreateComment
 * @route POST /api/comments
 * @param {Object} req.body - Comment payload (fields depend on Comment schema)
 * @returns {Promise<void>} 201 - JSON of the created comment document
 * @throws 400 - Bad request when validation or saving fails
 */
router.post("/", async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ error: "Failed to create comment" });
    }
});

/**
 * Delete a comment by id.
 *
 * @name DeleteComment
 * @route DELETE /api/comments/:id
 * @param {string} req.params.id - Mongoose ObjectId of the comment to delete
 * @returns {Promise<void>} 200 - JSON message on successful deletion
 * @throws 400 - Invalid id format
 * @throws 404 - Comment not found
 * @throws 500 - Internal server error when deletion fails
 */
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid comment id" });
        }
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deletedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

/**
 * Update a comment by id.
 *
 * @name UpdateComment
 * @route PUT /api/comments/:id
 * @param {string} req.params.id - Mongoose ObjectId of the comment to update
 * @param {Object} req.body - Partial or full comment fields to update
 * @returns {Promise<void>} 200 - JSON of the updated comment document
 * @throws 400 - Invalid id format or bad update payload
 * @throws 404 - Comment not found
 */
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid comment id" });
        }
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json(updatedComment);
    } catch (err) {
        res.status(400).json({ error: "Failed to update comment" });
    }
});

/**
 * Retrieve a comment by id.
 *
 * @name GetCommentById
 * @route GET /api/comments/:id
 * @param {string} req.params.id - Mongoose ObjectId of the comment to retrieve
 * @returns {Promise<void>} 200 - JSON of the comment document
 * @throws 400 - Invalid id format
 * @throws 404 - Comment not found
 * @throws 500 - Internal server error when fetching fails
 */
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid comment id" });
        }
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch comment" });
    }
});

module.exports = router;
