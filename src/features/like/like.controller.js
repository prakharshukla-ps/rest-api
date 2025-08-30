import LikeRepository from "./like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }
  async likeItem(req, res) {
    try {
      const { id, type } = req.body;
      const { userId } = req;

      if (type != "Product" && type != "Category") {
        return res.status(400).send("Invalid type");
      }

      if (type == "Product") {
        this.likeRepository.likeProduct(userId, id);
      } else {
        this.likeRepository.likeCategory(userId, id);
      }

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }

  async getLikes(req, res) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(type, id);
      return res.status(200).send(likes);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }
}
