import User from "../models/user.mjs";
import Item from "../models/item.mjs";
import Tag from "../models/tag.mjs";
import Reaction from "../models/reaction.mjs";

import boycotts from "../seeds/item.mjs";
import comments from "../seeds/tag.mjs";
import users from "../seeds/users.mjs";
import reactions from "../seeds/reactions.mjs";

export async function seed(req, res, next) {
	const result = {};

	try {
		await Promise.all([
			Item.deleteMany(),
			Tag.deleteMany(),
			User.deleteMany(),
			Reaction.deleteMany(),
		]);

		const [usersInsert, boycottsInsert, commentsInsert, reactionsInsert] = [
			await User.insertMany(users),
			await Item.insertMany(boycotts),
			await Tag.insertMany(comments),
			await Tag.insertMany(reactions),
		];

		if (commentsInsert.length > 0) {
			result.comments = commentsInsert;
		}

		if (boycottsInsert.length > 0) {
			result.boycotts = boycottsInsert;
		}

		if (usersInsert.length > 0) {
			result.users = usersInsert;
		}

		if (reactionsInsert.length > 0) {
			result.reactions = reactionsInsert;
		}

		res.status(200).json(result);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}
