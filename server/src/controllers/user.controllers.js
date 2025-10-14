const User = require('./../models/Users.models');
const razorpay = require('./../config/razorpay');
const mongoose = require('mongoose');
const axios = require('axios');

const RAZORPAY_BASE_URL = 'https://api.razorpay.com/v1';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Helper axios instance with Razorpay credentials
const razorpayAxios = axios.create({
  baseURL: RAZORPAY_BASE_URL,
  auth: {
    username: RAZORPAY_KEY_ID,
    password: RAZORPAY_KEY_SECRET,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

async function createContactForUser(user) {
  const payload = {
    name: user.profile.name,
    email: user.email,
    contact: user.profile.phone || '',
    type: 'vendor',
    reference_id: `user_${user._id}`,
    notes: { user_id: user._id.toString() },
  };

  try {
    const response = await razorpayAxios.post('/contacts', payload);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating Razorpay contact:',
      error.response?.data || error.message
    );
    throw error;
  }
}

async function createFundAccountForUser(user) {
  if (!user.fund_contact_id)
    throw new Error('User contact_id missing for fund account creation');

  if (!user.upi)
    throw new Error('User UPI ID missing for fund account creation');

  const payload = {
    account_type: 'vpa',
    contact_id: user.fund_contact_id,
    vpa: {
      address: user.upi,
    },
  };

  try {
    const response = await razorpayAxios.post('/fund_accounts', payload);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating Razorpay fund account (VPA):',
      error.response?.data || error.message
    );
    throw error;
  }
}

async function editFundAccountStatus(fundAccountId, active) {
  try {
    const response = await razorpayAxios.patch(
      `/fund_accounts/${fundAccountId}`,
      { active }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error updating fund account status:',
      error.response?.data || error.message
    );
    throw error;
  }
}

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

      const { _id, ...userWithoutId } = user;
      const transformedUser = { id: _id.toString(), ...userWithoutId };

      res.json(transformedUser);
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

      const { name, location, roles, phone, upi } = req.body;

      const updateFields = {};

      if (name !== undefined) updateFields['profile.name'] = name;

      if (phone !== undefined) updateFields['profile.phone'] = phone;

      if (upi !== undefined) updateFields['upi'] = upi;

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

      const oldUser = await User.findById(userId);
      if (!oldUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const oldRoles = oldUser.roles || [];
      const oldFundAccountId = oldUser.fund_account_id;
      const oldActive = oldUser.fund_account_active;
      const newRoles = roles || oldRoles;

      const wasSeller = oldRoles.includes('seller');
      const isSeller = newRoles.includes('seller');

      // If user has no fund_contact_id, create contact first
      if (!oldUser.fund_contact_id) {
        const contact = await createContactForUser(oldUser);
        updateFields['fund_contact_id'] = contact.id;
        // Update oldUser object locally with fund_contact_id for next steps
        oldUser.fund_contact_id = contact.id;
      }
      console.log(oldUser.fund_contact_id);

      if (isSeller && !wasSeller) {
        if (oldFundAccountId) {
          await editFundAccountStatus(oldFundAccountId, true);
          updateFields['fund_account_active'] = true;
        } else {
          const fundAccount = await createFundAccountForUser(oldUser);
          updateFields['fund_account_id'] = fundAccount.id;
          updateFields['fund_account_active'] = true;
        }
      } else if (!isSeller && wasSeller) {
        if (oldFundAccountId) {
          await editFundAccountStatus(oldFundAccountId, false);
          updateFields['fund_account_active'] = false;
        }
      } else if (isSeller && wasSeller && !oldActive) {
        if (oldFundAccountId) {
          await editFundAccountStatus(oldFundAccountId, true);
          updateFields['fund_account_active'] = true;
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true, context: 'query' }
      ).select('-password');

      const {_id, ...userWithoutId} = updatedUser;
      const transformedUser = { id: _id.toString(), ...userWithoutId };

      res.json({ message: 'Profile updated', user: transformedUser });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new UserController();
