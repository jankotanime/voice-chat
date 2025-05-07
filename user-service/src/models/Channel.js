import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
