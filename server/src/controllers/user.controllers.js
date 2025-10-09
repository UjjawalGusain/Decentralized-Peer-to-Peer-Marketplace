const User = require('./../models/Users.models');
const mongoose = require('mongoose');

class UserController {
  async getUser(req, res) {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const user = await User.findById(userId).select('-password').lean();

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const { name, location, roles } = req.body;

      const updateFields = {};

      if (name !== undefined) updateFields['profile.name'] = name;

      if (location) {
        if (location.coordinates !== undefined)
          updateFields['profile.location.coordinates'] = location.coordinates;
        if (location.city !== undefined)
          updateFields['profile.location.city'] = location.city;
        if (location.country !== undefined)
          updateFields['profile.location.country'] = location.country;
      }

      if (roles !== undefined && Array.isArray(roles)) {
        updateFields['roles'] = roles;
      }

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true, context: 'query' }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

}

module.exports = new UserController();
