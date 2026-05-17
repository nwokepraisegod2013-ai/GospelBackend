import Content from '../models/Content.js';
import Like from '../models/Like.js';
import { NotFoundError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const getAllContent = async (req, res, next) => {
  try {
    const { type, isLive, category, search, page = 1, limit = 20 } = req.query;
    
    const query = { isPublished: true };
    
    if (type) query.type = type;
    if (isLive === 'true') query.isLive = true;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const content = await Content.find(query)
      .populate('author', 'name avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Content.countDocuments(query);
    
    // Convert stored duration (seconds) to milliseconds for Flutter client
    const data = content.map((c) => {
      const obj = c.toObject({ virtuals: true });
      obj.duration = (obj.duration || 0) * 1000;
      return obj;
    });

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar bio followers')
      .populate('likedBy', 'name avatar');
    
    if (!content) {
      throw new NotFoundError('Content not found');
    }
    
    // Convert stored duration (seconds) to milliseconds for Flutter client
    const contentObj = content.toObject({ virtuals: true });
    contentObj.duration = (contentObj.duration || 0) * 1000;

    res.status(200).json({
      success: true,
      data: contentObj,
    });
  } catch (error) {
    next(error);
  }
};

export const createContent = async (req, res, next) => {
  try {
    const { title, subtitle, description, type, category, thumbnailUrl, contentUrl, duration } = req.body;

    // Accept duration in milliseconds from client (Flutter). Convert to seconds for storage.
    let durationSeconds = 0;
    if (typeof duration === 'number') {
      durationSeconds = duration >= 1000 ? Math.floor(duration / 1000) : duration;
    }
    
    const content = new Content({
      title,
      subtitle,
      description,
      type,
      category,
      thumbnailUrl,
      contentUrl,
      duration: durationSeconds,
      author: req.user._id,
    });
    
    await content.save();
    await content.populate('author', 'name avatar email');
    
    logger.info(`Content created: ${content._id}`);
    // Return duration as milliseconds to match Flutter client expectations
    const contentObj = content.toObject({ virtuals: true });
    contentObj.duration = (contentObj.duration || 0) * 1000;

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: contentObj,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, category, isPublished, duration } = req.body;
    
    let content = await Content.findById(id);
    
    if (!content) {
      throw new NotFoundError('Content not found');
    }
    
    // Check authorization
    if (content.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this content',
      });
    }
    
    // If client supplies duration in milliseconds, convert to seconds for storage
    const updatePayload = { title, subtitle, description, category, isPublished };
    if (typeof duration === 'number') {
      updatePayload.duration = duration >= 1000 ? Math.floor(duration / 1000) : duration;
    }

    content = await Content.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');
    
    logger.info(`Content updated: ${content._id}`);
    // Return duration as milliseconds to match Flutter client expectations
    const updatedObj = content.toObject({ virtuals: true });
    updatedObj.duration = (updatedObj.duration || 0) * 1000;

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: updatedObj,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findById(id);
    
    if (!content) {
      throw new NotFoundError('Content not found');
    }
    
    // Check authorization
    if (content.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this content',
      });
    }
    
    await Content.findByIdAndDelete(id);
    
    logger.info(`Content deleted: ${id}`);
    
    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const likeContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findById(id);
    if (!content) {
      throw new NotFoundError('Content not found');
    }
    
    if (!req.user) {
      content.likes += 1;
      await content.save();
      return res.status(200).json({
        success: true,
        message: 'Content liked',
        data: { likes: content.likes, isLiked: true },
      });
    }

    // Check if user already liked
    const existingLike = await Like.findOne({
      contentId: id,
      userId: req.user._id,
    });
    
    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      content.likes = Math.max(0, content.likes - 1);
      content.likedBy = content.likedBy.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Like
      const like = new Like({
        contentId: id,
        userId: req.user._id,
      });
      await like.save();
      content.likes += 1;
      content.likedBy.push(req.user._id);
    }
    
    await content.save();
    
    res.status(200).json({
      success: true,
      message: existingLike ? 'Content unliked' : 'Content liked',
      data: { likes: content.likes, isLiked: !existingLike },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  likeContent,
};
