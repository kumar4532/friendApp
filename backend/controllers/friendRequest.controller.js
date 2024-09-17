import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";

const sendRequest = async(req, res) => {
    try {
        const { id:userId } = req.params;
		const senderId = req.user._id;        

        if (!userId) {
            return res.status(400).json({ message: "Please enter an id to send a request" });
        }

        const existingRequest = await FriendRequest.findOne({
			sender: senderId,
			recipient: userId,
			status: "pending",
		});

		if (existingRequest) {
			return res.status(400).json({ message: "A connection request already exists" });
		}

        const newRequest = new FriendRequest({
			sender: senderId,
			recipient: userId,
		});

		await newRequest.save();

		res.status(201).json(newRequest);
    } catch (error) {
        console.log("Error in send request controller", error);
        return res.status(500).json({ message: "An error occurred while processing your request" });
    }
}

const acceptFriendRequest = async (req, res) => {
	try {
		const { id:requestId } = req.params;
		const userId = req.user._id;

		const request = await FriendRequest.findById(requestId)
			.populate("sender", "fullname")
			.populate("recipient", "fullname");

		if (!request) {
			return res.status(404).json({ message: "Connection request not found" });
		}

		if (request.recipient._id.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Not authorized to accept this request" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "This request has already been processed" });
		}

		request.status = "accepted";
		await request.save();

		await User.findByIdAndUpdate(request.sender._id, { $addToSet: { friends: userId } });
		await User.findByIdAndUpdate(userId, { $addToSet: { friends: request.sender._id } });

		res.json({ message: "Connection accepted successfully", request });
	} catch (error) {
		console.error("Error in acceptFriendRequest controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const rejectFriendRequest = async (req, res) => {
	try {
		const { id:requestId } = req.params;
		const userId = req.user._id;

		const request = await FriendRequest.findById(requestId);

		if (request.recipient.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Not authorized to reject this request" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "This request has already been processed" });
		}

		request.status = "rejected";
		await request.save();

		res.json({ message: "Connection request rejected", request });
	} catch (error) {
		console.error("Error in rejectFriendRequest controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const getUserConnections = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId).populate(
			"friends",
			"fullname"
		);

		res.json(user.friends);
	} catch (error) {
		console.error("Error in getUserConnections controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};


const removeConnection = async (req, res) => {
	try {
		const myId = req.user._id;
		const { id:userId } = req.params;

		await User.findByIdAndUpdate(myId, { $pull: { friends: userId } });
		await User.findByIdAndUpdate(userId, { $pull: { friends: myId } });

		res.json({ message: "Connection removed successfully" });
	} catch (error) {
		console.error("Error in removeConnection controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const getConnectionRequests = async (req, res) => {
	try {
		const userId = req.user._id;

		const requests = await FriendRequest.find({ recipient: userId, status: "pending" }).populate(
			"sender",
			"fullname"
		);

		res.json(requests);
	} catch (error) {
		console.error("Error in getConnectionRequests controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const getRecommendedFriends = async (req, res) => {
    try {
        const alreadySentRequests = await FriendRequest.find({
            sender: req.user._id
        });

        const sentRequestRecipients = alreadySentRequests.map(request => request.recipient);

        const currentUser = await User.findById(req.user._id).populate("friends", "fullname");

        // Get all users who are friends of the current user's friends
        const friendsOfFriends = await User.aggregate([
			{ $match: { _id: { $in: currentUser.friends.map(friend => friend._id) } } },
			{ $lookup: {
				from: 'users',
				localField: 'friends',
				foreignField: '_id',
				as: 'mutualFriends'
			}},
			{ $unwind: '$mutualFriends' },
			{ $group: {
				_id: '$mutualFriends._id',
				fullname: { $first: '$mutualFriends.fullname' },
				mutualFriendsCount: { $sum: 1 }
			}},
			{ $match: {
				_id: {
					$ne: req.user._id,
					$nin: [...currentUser.friends.map(friend => friend._id), ...sentRequestRecipients]
				}
			}},
			{ $sort: { mutualFriendsCount: -1 } },
			{ $limit: 3 },
			{ $project: { _id: 1, fullname: 1 } }
		]);
		
		const remainingCount = 3 - friendsOfFriends.length;
		
		let suggestedUsers = [];
		if (remainingCount > 0) {
			suggestedUsers = await User.find({
				_id: {
					$ne: req.user._id,
					$nin: [
						...currentUser.friends.map(friend => friend._id),
						...sentRequestRecipients,
						...friendsOfFriends.map(friend => friend._id)
					]
				},
			})
			.select("fullname")
			.limit(remainingCount);
		}
		
		const recommendedFriends = [...friendsOfFriends, ...suggestedUsers];

        res.json(recommendedFriends);
    } catch (error) {
        console.error("Error in getRecommendedFriends controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export {
    sendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getUserConnections,
    removeConnection,
    getConnectionRequests,
	getRecommendedFriends
}