
import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';

// MongoDB
import Mongoose from 'mongoose';

// REST endpoints
import fetch from 'node-fetch'; // https://www.npmjs.com/package/node-fetch


Mongoose.Promise = global.Promise;

const mongo = Mongoose.connect('mongodb://localhost/views', {
  useMongoClient: true
});

const ViewSchema = Mongoose.Schema({
  postId: Number,
  views: Number
});

const View = Mongoose.model('views', ViewSchema);

const db = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite',
});

const AuthorModel = db.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
});

const PostModel = db.define('post', {
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING },
});

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

// create mock data with a seed, so we always get the same
// views too
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      return author.createPost({
        title: `A post by ${author.firstName}`,
        text: casual.sentences(3),
      }).then((post) => {
        // Create some mock views:
        return View.update(
          { postId: post.id },
          { views: casual.integer(0, 100) },
          { upsert: true });
      });
    });
  });
});

const Author = db.models.author;
const Post = db.models.post;

// REST
const FortuneCookie = {
  getOne() {
    return fetch('http://fortunecookieapi.herokuapp.com/v1/cookie')
    .then(res => res.json())
    .then(res => {
      return res[0].fortune.message;
    });
  },
  getLuckyNumbers() {
    return fetch('http://fortunecookieapi.herokuapp.com/v1/cookie')
    .then(res => res.json())
    .then(res => {
      return res[0].lotto.numbers.toString();
    });
  },
};

const Shuting = {
  getInsult() {
    return fetch('https://insult.mattbas.org/api/insult.txt?who=Shuting')
    .then(res => res.text())
    .then(res => {
      console.log(res);
      return res;
    });
  }
}

const Compliment = {
  getCompliment() {
    return fetch('https://complimentr.com/api')
    .then(res => res.json())
    .then(res => res.compliment)
  },
  getCompliment(args) {
    return fetch('https://complimentr.com/api')
    .then(res => res.json())
    .then(res => `${args.name}, ${res.compliment}`)
  }
}


export { Author, Post, View, FortuneCookie, Shuting, Compliment };