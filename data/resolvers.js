import { Author, View, FortuneCookie, Shuting, Compliment } from './connectors';

const resolvers = {
	Query: {
		author(_, args) {
			return Author.find({where: args});
		},
		allAuthors() {
			return Author.findAll();
		},
		getFortuneCookie() {
			return FortuneCookie.getOne()
		},
		getLuckyNumbers() {
			return FortuneCookie.getLuckyNumbers()
		},
		daniel(){
			return "You stank boi"
		},
		whatIsShuting() {
			return Shuting.getInsult()
		},
		complimentMe() {
			return Compliment.getCompliment()
		},
		complimentMe(_, args) {
			return Compliment.getCompliment(args)
		}
	},
	Author: {
		posts(author) {
			return author.getPosts();
		}
	},
	Post: {
		author(post) {
			return post.getAuthor();
		},
		views(post) {
			return View.findOne({ postId: post.id }).then(view => view.views);
		}
	},
}

export default resolvers;